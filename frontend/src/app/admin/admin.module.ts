import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

import { AdminDashboardComponent } from './components/dashboard/dashboard.component';
import { AdminDepartmentsComponent } from './components/departments/departments.component';
import { AdminDoctorsComponent } from './components/doctors/doctors.component';
import { AdminUsersComponent } from './components/users/users.component';
import { AdminScheduleComponent } from './components/schedule/schedule.component';

const routes: Routes = [
  { path: '', component: AdminDashboardComponent },
  { path: 'departments', component: AdminDepartmentsComponent },
  { path: 'doctors', component: AdminDoctorsComponent },
  { path: 'users', component: AdminUsersComponent },
  { path: 'schedule', component: AdminScheduleComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule
  ],
  declarations: [
    AdminDashboardComponent,
    AdminDepartmentsComponent,
    AdminDoctorsComponent,
    AdminUsersComponent,
    AdminScheduleComponent
  ]
})
export class AdminModule { }
