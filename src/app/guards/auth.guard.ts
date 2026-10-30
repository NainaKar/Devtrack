import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

// NOTE: inject() only works synchronously, so services are grabbed BEFORE the first `await`.

/** Protects /app/** – waits for session restore, then sends anonymous visitors to /login. */
export const authGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  await auth.ready;
  return auth.isLoggedIn() ? true : router.createUrlTree(['/login']);
};

/** Login/Register are only for guests – logged-in users go straight to their tracker. */
export const guestGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  await auth.ready;
  return auth.isLoggedIn() ? router.createUrlTree(['/app/dashboard']) : true;
};
