import { Routes } from '@angular/router';
import { provideRouter } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: 'users',
    loadChildren: () => import('./users/user.routes').then(m => m.userRoutes)
  },
  {
    path: 'incidente',
    loadChildren: () => import('./incidente/incidente.routes').then(m => m.incidenteRoutes)
  },
  {
    path: 'recomendacion',
    loadChildren: () => import('./recomendacion/recomendacion.routes').then(m => m.recomendacionRoutes)
  },
  {
    path: 'proyecto',
    loadChildren: () => import('./proyecto/proyecto.routes').then(m => m.proyectoRoutes)
  },
  {
    path: 'clasificacion',
    loadChildren: () => import('./clasificacion/clasificacion.routes').then(m => m.clasificacionRoutes)
  },
  {
    path: 'profiles',
    loadChildren: () => import('./profiles/profile.routes').then(m => m.PROFILE_ROUTES)
  },
   { path: 'dashboard', component: Dashboard },
  { path: '**', redirectTo: 'auth/login' } // fallback
];

export const APP_ROUTES = provideRouter(routes);