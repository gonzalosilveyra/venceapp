import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Dashboard } from './pages/dashboard/dashboard';
import { VencimientoForm } from './pages/vencimiento-form/vencimiento-form';
import { Profile } from './pages/profile/profile';
import { authGuard } from './core/guards/auth-guard';

const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'registro', component: Register },
  {
    path: '',
    component: Dashboard,
    canActivate: [authGuard]
  },
  {
    path: 'dashboard',
    redirectTo: '',
    pathMatch: 'full'
  },
  {
    path: 'crear',
    component: VencimientoForm,
    canActivate: [authGuard]
  },
  {
    path: 'editar/:id',
    component: VencimientoForm,
    canActivate: [authGuard]
  },
  {
    path: 'perfil',
    component: Profile,
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
