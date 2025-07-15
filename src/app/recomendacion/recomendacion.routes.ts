// user.routes.ts
import { Routes } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

export const recomendacionRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./recomendacion-list/recomendacion-list').then(m => m.RecomendacionListComponent),
    providers: [provideHttpClient()] // 👈 ¡esto es clave!
  }
];
