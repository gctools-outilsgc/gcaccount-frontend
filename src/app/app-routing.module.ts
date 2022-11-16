import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './public/components/login/login.component';
import { HomeComponent } from './private/components/home/home.component';
import { SplashComponent } from './public/components/splash/splash.component';

import { AuthGuard } from './core/guards/auth.guard';
import { LoginGuard } from './core/guards/login.guard';

const routes: Routes = [
  {
    path: '',
    title: 'Home',
    component: HomeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'splash',
    title: 'Splash',
    component: SplashComponent,
    canActivate: [LoginGuard]
  },
  {
    path: 'login',
    title: 'Login',
    component: LoginComponent,
    canActivate: [LoginGuard]
  },
  {
    path: 'home',
    title: 'Home',
    component: HomeComponent,
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
