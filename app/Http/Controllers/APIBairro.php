<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class APIBairro extends Controller
{
    public function countBairros(Request $request)
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

        $groupedBairros = $users->groupBy('bairro')->map(function ($items, $key) {
            return [
                'name' => $key,
                'count' => $items->count(),
            ];
        })->sortByDesc('count')->values()->all();

        return response()->json([
            'success' => true,
            'data' => [
                'bairros' => $groupedBairros,
            ]
        ]);
    }
}
