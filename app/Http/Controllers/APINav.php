<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;

class APINav extends Controller
{
    public function nav(Request $request)
    {
        $user = User::find($request->input('userId'));

        if (!$user) {
            return response()->json([
                'success' => false,
            ]);
        }

        $usersAll = User::all();

        $filteredUsers = $usersAll->map(function ($user) {
            $networkSum = $user->descendants()->whereDepth('<=', 4)->count();

            return [
                'id' => $user->id,
                'name' => $user->name,
                'rede' => $networkSum,
                'user_id' => $user->user_id,
            ];
        });

        $sortedUsers = $filteredUsers->sortByDesc('rede')->values();

        $position = $sortedUsers->search(function ($item) use ($user) {
            return $item['id'] == $user->id;
        }) + 1;


        return response()->json([
            'success' => true,
            'data' => [
                'position' => $position
            ]
        ]);
    }
}
