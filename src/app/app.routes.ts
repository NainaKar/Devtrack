import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './guards/auth.guard';

export const routes: Routes = [
  // ---------- AUTH PAGES: dedicated full-screen layout ----------
  { path: 'login', title: 'Log in – DevTrack', canActivate: [guestGuard], loadComponent: () => import('./pages/login').then(m => m.Login) },
  { path: 'register', title: 'Create account – DevTrack', canActivate: [guestGuard], loadComponent: () => import('./pages/register').then(m => m.Register) },

  // ---------- BEFORE LOGIN: marketing site ----------
  {
    path: '',
    loadComponent: () => import('./layouts/public-layout').then(m => m.PublicLayout),
    children: [
      { path: '', pathMatch: 'full', title: 'DevTrack – Track skills. Land your dream role.', loadComponent: () => import('./pages/home').then(m => m.Home) },
      { path: 'about', title: 'About – DevTrack', loadComponent: () => import('./pages/about').then(m => m.About) },
    ],
  },
  // ---------- AFTER LOGIN: personal tracker ----------
  {
    path: 'app',
    canActivate: [authGuard],
    loadComponent: () => import('./layouts/app-layout').then(m => m.AppLayout),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'dashboard', title: 'Dashboard – DevTrack', loadComponent: () => import('./pages/dashboard').then(m => m.Dashboard) },
      { path: 'skills', title: 'Skills & Assessments – DevTrack', loadComponent: () => import('./pages/skills').then(m => m.Skills) },
      { path: 'skills/:id', title: 'Skill – DevTrack', loadComponent: () => import('./pages/skill-detail').then(m => m.SkillDetail) },
      { path: 'roadmap', title: 'Career Roadmap – DevTrack', loadComponent: () => import('./pages/roadmap').then(m => m.Roadmap) },
      { path: 'jobs', title: 'Target Companies & Jobs – DevTrack', loadComponent: () => import('./pages/jobs').then(m => m.JobsPage) },
      { path: 'projects', title: 'Projects – DevTrack', loadComponent: () => import('./pages/projects').then(m => m.Projects) },
      { path: 'calculator', title: 'Readiness Calculator – DevTrack', loadComponent: () => import('./pages/calculator').then(m => m.Calculator) },
      { path: 'chat', title: 'AI Mentor & Prep – DevTrack', loadComponent: () => import('./pages/chat').then(m => m.Chat) },
      { path: 'activity', title: 'Activity Log – DevTrack', loadComponent: () => import('./pages/activity').then(m => m.ActivityPage) },
      { path: 'profile', title: 'My Profile & Goals – DevTrack', loadComponent: () => import('./pages/profile').then(m => m.Profile) },
    ],
  },
  { path: '**', redirectTo: '' },
];
