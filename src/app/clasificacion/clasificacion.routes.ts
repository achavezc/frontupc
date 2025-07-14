// user.routes.ts
import { Routes } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

export const clasificacionRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./clasificacion-list/clasificacion-list').then(m => m.ClasificacionListComponent),
    providers: [provideHttpClient()] // 👈 ¡esto es clave!
  }
];
