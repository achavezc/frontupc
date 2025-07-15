// user.routes.ts
import { Routes } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

export const proyectoRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./proyecto-list/proyecto-list').then(m => m.ProyectoListComponent),
    providers: [provideHttpClient()] // 👈 ¡esto es clave!
  }
];
