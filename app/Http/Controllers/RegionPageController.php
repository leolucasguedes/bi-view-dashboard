<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;

class RegionPageController extends Controller
{
    public function index($bairro)
    {
        return Inertia::render('RegionPage', ['bairro' => $bairro]);
    }

    public function regionData(Request $request)
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

        $filteredUsers = $users->filter(function ($user) use ($request) {
            return strcasecmp($user->bairro, $request->bairro) === 0;
        })->map(function ($user) {
            $indicatedUsers = $user->descendants()->whereDepth('<=', 1)->count();

            $networkSum = $user->descendants()->whereDepth('<=', 5)->count();

            return [
                'id' => $user->id,
                'name' => $user->name,
                'whatsapp' => $user->whatsapp,
                'sexo' => $user->sexo,
                'idade' => $user->idade,
                'bairro' => $user->bairro,
                'cidade' => $user->cidade,
                'user_id' => $user->user_id,
                'indications' => $indicatedUsers,
                'rede' => $networkSum,
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
