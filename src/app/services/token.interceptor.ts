import { HttpInterceptorFn } from '@angular/common/http';

/** Adds the JWT to every /api request. */
export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  let token: string | null = null;
  try { token = localStorage.getItem('devtrack.token'); } catch { /* storage blocked */ }
  return token && req.url.startsWith('/api')
    ? next(req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }))
    : next(req);
};
