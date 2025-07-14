// user.routes.ts
import { Routes } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

export const userRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./user-list/user-list').then(m => m.UserListComponent),
    providers: [provideHttpClient()] // 👈 ¡esto es clave!
  },
  {
    path: 'form',
    loadComponent: () =>
      import('./user-form/user-form').then(m => m.UserFormComponent),
    providers: [provideHttpClient()]
  }
];
