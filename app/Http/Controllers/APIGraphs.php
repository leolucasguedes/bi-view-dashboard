<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;

class APIGraphs extends Controller
{
    public function usersData(Request $request)
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

        $sortedUsers = $filteredUsers->sortByDesc('indications')->values()->all();

        return response()->json([
            'success' => true,
            'data' => [
                'users' => $sortedUsers,
            ]
        ]);
    }
}
