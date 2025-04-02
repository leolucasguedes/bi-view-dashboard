<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Http\Request;
use Closure;

class Authenticate extends Middleware
{

    public function handle($request, Closure $next, ...$guards)
    {
        $this->authenticate($request, $guards);

        if ($request->is('login') && $request->user()) {
            return redirect('/dashboard');
        }

        if ($request->is('/') || $request->is('')) {
            return redirect('/login');
        }

        return $next($request);
    }

    /**
     * Get the path the user should be redirected to when they are not authenticated.
     */
    protected function redirectTo(Request $request): ?string
    {
        return $request->expectsJson() ? null : route('login');
    }
}
