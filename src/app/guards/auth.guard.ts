import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

// NOTE: inject() only works synchronously, so services are grabbed BEFORE the first `await`.

/** Protects /app/** – waits for session restore, redirects unauthenticated visitors to /login,
 *  and redirects first-time OAuth users to career goals onboarding before dashboard access. */
export const authGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  await auth.ready;

  if (!auth.isLoggedIn()) {
    const err = auth.oauthError();
    if (err) {
      return router.createUrlTree(['/login'], { queryParams: { oauth_error: err } });
    }
    return router.createUrlTree(['/login']);
  }

  // First-time OAuth user needing to set initial career goals
  if (auth.needsGoals()) {
    return router.createUrlTree(['/register'], { queryParams: { step: 'goals' } });
  }

  return true;
};

/** Login/Register are for guests – logged-in users go straight to tracker,
 *  unless a first-time Google user is actively configuring career goals on /register?step=goals. */
export const guestGuard: CanActivateFn = async (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  await auth.ready;

  if (auth.isLoggedIn()) {
    // If the authenticated user still needs to complete career goals onboarding, allow /register?step=goals
    if (auth.needsGoals()) {
      if (route.queryParams?.['step'] === 'goals' || state.url.includes('step=goals')) {
        return true;
      }
      return router.createUrlTree(['/register'], { queryParams: { step: 'goals' } });
    }
    return router.createUrlTree(['/app/dashboard']);
  }

  return true;
};
