<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;

class APIRede extends Controller
{
    public function redeData(Request $request)
    {
        $user = User::find($request->input('userId'));

        if (!$user) {
            return response()->json([
                'success' => false,
            ]);
        }

        $perPage = 25;
        $page = $request->input('page', 1);

        if ($user->is_admin == 1) {
            $query = User::query();
        } else {
            $query = $user->descendants()->whereDepth('<=', 5);
        }

        $query->orderByDesc('id');

        $totalUsers = $query->count();
        $users = $query->skip(($page - 1) * $perPage)->take($perPage)->get();

        $filteredUsers = $users->map(function ($user) {
            $indicatedUsers = $user->descendants()->whereDepth('<=', 1)->count();

            $networkSum = $user->descendants()->whereDepth('<=', 5)->count();

            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'whatsapp' => $user->whatsapp,
                'idade' => $user->idade,
                'nascimento' => $user->nascimento,
                'sexo' => $user->sexo,
                'bairro' => $user->bairro,
                'cidade' => $user->cidade,
                'indications' => $indicatedUsers,
                'rede' => $networkSum,
                'user_id' => $user->user_id,
                'created_at' => $user->created_at,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => [
                'users' => $filteredUsers,
                'total' => $totalUsers,
                'current_page' => $page,
                'per_page' => $perPage,
            ]
        ]);
    }
    public function redeDataAll(Request $request)
    {
        $user = User::find($request->input('userId'));

        if (!$user) {
            return response()->json([
                'success' => false,
            ]);
        }

        if ($user->is_admin == 1) {
            $users = User::all();
        } else {
            $users = $user->descendants()->whereDepth('<=', 5)->get();
        }

        $filteredUsers = $users->map(function ($user) {
            $indicatedUsers = $user->descendants()->whereDepth('<=', 1)->count();

            $networkSum = $user->descendants()->whereDepth('<=', 5)->count();

            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'whatsapp' => $user->whatsapp,
                'idade' => $user->idade,
                'nascimento' => $user->nascimento,
                'sexo' => $user->sexo,
                'bairro' => $user->bairro,
                'cidade' => $user->cidade,
                'indications' => $indicatedUsers,
                'rede' => $networkSum,
                'user_id' => $user->user_id,
                'created_at' => $user->created_at,
            ];
        });

        $sortedUsers = $filteredUsers->sortByDesc('id')->values()->all();

        return response()->json([
            'success' => true,
            'data' => [
                'users' => $sortedUsers,
            ]
        ]);
    }
    public function redeOne(Request $request)
    {
        $user = User::find($request->input('userId'));

        if (!$user) {
            return response()->json([
                'success' => false,
            ]);
        }

        if ($user->is_admin == 1) {
            $users = User::all();
        } else {
            $users = $user->descendants()->whereDepth('<=', 1)->get();
        }

        $filteredUsers = $users->map(function ($user) {
            $indicatedUsers = $user->descendants()->whereDepth('<=', 1)->count();

            $networkSum = $user->descendants()->whereDepth('<=', 5)->count();

            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'whatsapp' => $user->whatsapp,
                'idade' => $user->idade,
                'nascimento' => $user->nascimento,
                'sexo' => $user->sexo,
                'bairro' => $user->bairro,
                'cidade' => $user->cidade,
                'indications' => $indicatedUsers,
                'rede' => $networkSum,
                'user_id' => $user->user_id,
                'created_at' => $user->created_at,
            ];
        });

        $sortedUsers = $filteredUsers->sortByDesc('id')->values()->all();

        return response()->json([
            'success' => true,
            'data' => [
                'users' => $sortedUsers
            ]
        ]);
    }
}
