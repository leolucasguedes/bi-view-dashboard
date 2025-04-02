<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;

class APIDashboard extends Controller
{
    public function statsOverview(Request $request)
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

        $total = $users->count();
        $leaders = $users->filter(function ($descendant) {
            return $descendant->children()->exists();
        })->count();

        if ($user->is_admin == 1) {
            $rede = $leaders;
        } else {
            $rede = $user->descendants()->whereDepth('<=', 5)->count();
        }

        $withBairro = $users->filter(function ($descendant) {
            return !is_null($descendant->bairro) && $descendant->bairro !== '';
        })->count();

        return response()->json([
            'success' => true,
            'data' => [
                'total' => $total,
                'leaders' => $leaders,
                'rede' => $rede,
                'bairro' => $withBairro
            ]
        ]);
    }
}
