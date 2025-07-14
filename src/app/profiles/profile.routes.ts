import { Routes } from '@angular/router';
import { ProfileList } from './profile-list/profile-list';
import { ProfileForm } from './profile-form/profile-form';

export const PROFILE_ROUTES: Routes = [
  { path: '', component: ProfileList },
  { path: 'new', component: ProfileForm },
  { path: 'edit/:id', component: ProfileForm }
];
