import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

import { DoctorAppointmentsComponent } from './components/appointments/appointments.component';
import { DoctorMedicalRecordsComponent } from './components/medical-records/medical-records.component';
import { MedicalRecordFormComponent } from './components/medical-record-form/medical-record-form.component';
import { DoctorFollowUpsComponent } from './components/follow-ups/follow-ups.component';
import { DoctorScheduleComponent } from './components/schedule/schedule.component';

const routes: Routes = [
  { path: '', redirectTo: 'appointments', pathMatch: 'full' },
  { path: 'appointments', component: DoctorAppointmentsComponent },
  { path: 'medical-records', component: DoctorMedicalRecordsComponent },
  { path: 'medical-records/new/:appointmentId', component: MedicalRecordFormComponent },
  { path: 'medical-records/edit/:id', component: MedicalRecordFormComponent },
  { path: 'follow-ups', component: DoctorFollowUpsComponent },
  { path: 'schedule', component: DoctorScheduleComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule
  ],
  declarations: [
    DoctorAppointmentsComponent,
    DoctorMedicalRecordsComponent,
    MedicalRecordFormComponent,
    DoctorFollowUpsComponent,
    DoctorScheduleComponent
  ]
})
export class DoctorModule { }
