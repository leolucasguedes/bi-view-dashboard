<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Redirect;
use App\Models\User;
use Inertia\Inertia;

class UserPageController extends Controller
{
    public function index($id)
    {
        $user = User::findOrFail($id);

        if (!$user) {
            return response()->json([
                'success' => false,
            ]);
        }

        $users = $user->descendants()->whereDepth('<=', 1)->get();
        $filteredUsers = $users->map(function ($user) {
            $indicatedUsers = $user->descendants()->whereDepth('<=', 1)->count();

            $networkSum = $user->descendants()->whereDepth('<=', 5)->count();

            return [
                'id' => $user->id,
                'name' => $user->name,
                'whatsapp' => $user->whatsapp,
                'sexo' => $user->sexo,
                'bairro' => $user->bairro,
                'cidade' => $user->cidade,
                'indications' => $indicatedUsers,
                'rede' => $networkSum,
                'user_id' => $user->user_id,
            ];
        });

        $sortedUsers = $filteredUsers->sortByDesc('indications')->values()->all();
        $networkSum = $user->descendants()->whereDepth('<=', 5)->count();

        $userName = null;
        if (!is_null($user->user_id)) {
            $correspondingUser = User::all()->firstWhere('id', $user->user_id);
            if ($correspondingUser) {
                $userName = $correspondingUser->name;
            }
        }

        return Inertia::render('UserPage', ['users' => $sortedUsers, 'userDT' => $user, 'rede' => $networkSum, 'userName' => $userName]);
    }

    public function update(Request $request, $id): RedirectResponse
    {
        $validatedData = $request->validate([
            'bairro' => ['nullable', 'string', 'max:55'],
            'cidade' => ['nullable', 'string', 'max:55'],
            'zona_eleitoral' => ['nullable', 'string', 'max:55'],
        ]);

        $user = User::findOrFail($id);
        $user->update($validatedData);

        return Redirect::route('painel.index', ['id' => $id]);
    }
}
