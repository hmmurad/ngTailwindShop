import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './auth/auth.guard';
import { ViewProductComponent } from './dashboard/view-product/view-product.component';
import { AddProductComponent } from './dashboard/add-product/add-product.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  { path: 'auth', component: AuthComponent },
  { path: '', component: DashboardComponent, canActivate: [AuthGuard] },
  {
    path: 'product/add',
    component: AddProductComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'product/:id',
    component: ViewProductComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard],
  },
  { path: '', redirectTo: '/', pathMatch: 'full' },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
