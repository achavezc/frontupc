// user.routes.ts
import { Routes } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

export const incidenteRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./incidente-list/incidente-list').then(m => m.IncidenteListComponent),
    providers: [provideHttpClient()] // 👈 ¡esto es clave!
  }
];
