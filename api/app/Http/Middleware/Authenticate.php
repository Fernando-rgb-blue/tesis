<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Auth\Middleware\Authenticate as Middleware;

class Authenticate extends Middleware
{
    /**
     * Get the path the user should be redirected to when they are not authenticated.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return string|null
     */
    protected function redirectTo($request)
    {
        // if (! $request->expectsJson()) {
        //     return route('login');
        // }
        if (! $request->expectsJson()) {
            abort(401, 'No autenticado'); // Lanza error 401 en vez de redirigir
        }
    }

    public function handle($request, Closure $next, ...$guards)
    {
        if ($token = $request->cookie('cookie_token')) {
            $request->headers->set('Authorization', 'Bearer ' . $token);
        }
        $this->authenticate($request, $guards);
        return $next($request);
    }
}
