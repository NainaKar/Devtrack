import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../services/auth.service';

/** Layout for visitors (before login): marketing navbar + footer in Warm Ivory & Terracotta palette. */
@Component({
  selector: 'app-public-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <header class="nav">
      <div class="container">
        <a routerLink="/" class="logo">
          <span class="logo-mark">D</span>
          <span>DevTrack</span>
        </a>
        <nav class="nav-links">
          <a class="link" routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}">Home</a>
          <a class="link" routerLink="/about" routerLinkActive="active">About & Methodology</a>
          @if (auth.isLoggedIn()) {
            <a class="btn btn-primary btn-sm" routerLink="/app/dashboard">Open Workspace →</a>
          } @else {
            <a class="link" routerLink="/login" routerLinkActive="active">Log In</a>
            <a class="btn btn-primary btn-sm" routerLink="/register">Get Started Free</a>
          }
        </nav>
      </div>
    </header>

    <main>
      <router-outlet />
    </main>

    <footer class="footer">
      <div class="container grid g3">
        <div>
          <div class="logo" style="color:#FFF9F3">
            <span class="logo-mark" style="background:var(--color-primary)">D</span>
            <span>DevTrack</span>
          </div>
          <p class="small" style="margin-top:12px; color:#B5A499; line-height:1.6">
            Developer Career Intelligence & Competency Platform. Bridge the gap between learning and landing your dream engineering role.
          </p>
        </div>
        <div>
          <h4 style="color:#FFF9F3">Navigation</h4>
          <p class="small" style="line-height:2">
            <a routerLink="/about">Methodology & About</a><br>
            <a routerLink="/register">Create Free Account</a><br>
            <a routerLink="/login">Developer Sign In</a>
          </p>
        </div>
        <div>
          <h4 style="color:#FFF9F3">Architecture</h4>
          <p class="small" style="color:#B5A499; line-height:1.8">
            Built with Angular 19 · Signals · Standalone Components<br>
            Node.js & Express API · Bcrypt · JWT Bearer Auth<br>
            Design: Warm Ivory × Terracotta
          </p>
        </div>
      </div>
      <div class="container small" style="margin-top:28px; border-top:1px solid #48382F; padding-top:18px; color:#8B776B">
        © {{ year }} DevTrack — Developer Productivity & Career Intelligence Platform.
      </div>
    </footer>
  `,
})
export class PublicLayout {
  auth = inject(AuthService);
  year = new Date().getFullYear();
}
