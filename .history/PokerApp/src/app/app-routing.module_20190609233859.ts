import { LoginFormComponent } from './components/login-form/login-form.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { TableComponent } from './components/table/table.component';
import { AuthGuard } from './security/auth-guards';

const routes: Routes = [
    {
      path: '',
      // component: LoginFormComponent,
      redirectTo: 'login',
      pathMatch: 'full',
    },
    {
      path: 'login',
      component: LoginFormComponent
    },
    {
      path: 'logout',
      component: LoginFormComponent
    },
    {
      path: 'home',
      component: HomeComponent,
      //canActivate: [ AuthGuard ]
    },
    {
      path: 'tournament/:id',
      component: TableComponent,
      canActivate: [ AuthGuard ]
    },
    {
      path: '**', 
      redirectTo: '/home'
      }
  ];
    @NgModule({
        imports: [ RouterModule.forRoot(routes)],
        exports: [RouterModule]
      })
      export class AppRoutingModule {}