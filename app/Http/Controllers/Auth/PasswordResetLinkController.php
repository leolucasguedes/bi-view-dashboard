<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\JsonResponse;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class PasswordResetLinkController extends Controller
{
    /**
     * Display the password reset link request view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/ForgotPassword', [
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming password reset link request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email',
            'whatsapp' => 'required',
        ]);

        $user = User::where('whatsapp', $request->whatsapp)->first();

        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Usuário não encontrado'], 404);
        }

        if ($user->email !== $request->email) {
            return response()->json(['success' => false, 'message' => 'E-mail não corresponde ao número'], 401);
        }

        return response()->json([
            'success' => true,
            'user' => [
                'name' => $user->name,
                'password' => $user->pass,
            ]
        ]);
    }
}
