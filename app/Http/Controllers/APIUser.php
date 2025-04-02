<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Models\User;
use Inertia\Inertia;

class APIUser extends Controller
{
    public function exportInfo(Request $request)
    {
        $usersAll = $request->input('users');

        foreach ($usersAll as &$user) {
            $userName = null;
            $leadersCount = 0;

            if (!is_null($user['id'])) {
                $leadersCount = $this->countDirectDescendantsWithChildren($user['id']);
            }

            if (!is_null($user['user_id'])) {
                $correspondingUser = User::find($user['user_id']);
                if ($correspondingUser) {
                    $userName = $correspondingUser->name;
                }
            }

            if (isset($user['created_at'])) {
                $user['created_at'] = \Carbon\Carbon::parse($user['created_at'])->toDateTimeString();
            }

            $user['embaixador'] = $userName;
            $user['leaders'] = $leadersCount;
        }

        return response()->json([
            'success' => true,
            'data' => [
                'users' => $usersAll
            ]
        ]);
    }
    private function countDirectDescendantsWithChildren($userId)
    {
        $total = 0;
        $user = User::find($userId);

        if ($user) {
            $descendants = $user->descendants()->whereDepth('<=', 1)->get();

            foreach ($descendants as $descendant) {
                if ($descendant->children()->exists()) {
                    $total++;
                }
            }
        }

        return $total;
    }
}
