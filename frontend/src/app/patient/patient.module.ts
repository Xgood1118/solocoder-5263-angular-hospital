import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

import { PatientAppointmentsComponent } from './components/appointments/appointments.component';
import { NewAppointmentComponent } from './components/new-appointment/new-appointment.component';
import { AppointmentDetailComponent } from './components/appointment-detail/appointment-detail.component';
import { PatientMedicalRecordsComponent } from './components/medical-records/medical-records.component';
import { MedicalRecordDetailComponent } from './components/medical-record-detail/medical-record-detail.component';
import { PatientReviewsComponent } from './components/reviews/reviews.component';
import { NotificationsComponent } from './components/notifications/notifications.component';

const routes: Routes = [
  { path: '', redirectTo: 'appointments', pathMatch: 'full' },
  { path: 'appointments', component: PatientAppointmentsComponent },
  { path: 'appointments/new', component: NewAppointmentComponent },
  { path: 'appointments/:id', component: AppointmentDetailComponent },
  { path: 'medical-records', component: PatientMedicalRecordsComponent },
  { path: 'medical-records/:id', component: MedicalRecordDetailComponent },
  { path: 'reviews', component: PatientReviewsComponent },
  { path: 'notifications', component: NotificationsComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule
  ],
  declarations: [
    PatientAppointmentsComponent,
    NewAppointmentComponent,
    AppointmentDetailComponent,
    PatientMedicalRecordsComponent,
    MedicalRecordDetailComponent,
    PatientReviewsComponent,
    NotificationsComponent
  ]
})
export class PatientModule { }
