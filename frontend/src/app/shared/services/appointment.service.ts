import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { formatDate } from '@angular/common';

export interface TimeSlot {
  id: number;
  doctorId: number;
  scheduleRuleId: number;
  date: string;
  timeSlotType: string;
  startTime: string;
  endTime: string;
  totalSlots: number;
  remainingSlots: number;
  version: number;
  available: boolean;
  cancelled: boolean;
}

export interface ScheduleRule {
  id: number;
  doctorId: number;
  dayOfWeek: string;
  timeSlotType: string;
  startTime: string;
  endTime: string;
  totalSlots: number;
  appointmentDuration: number;
  active: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  constructor(private http: HttpClient) {}

  getTimeSlots(doctorId: number, date: Date): Observable<TimeSlot[]> {
    const params = new HttpParams()
      .set('doctorId', doctorId.toString())
      .set('date', formatDate(date, 'yyyy-MM-dd', 'en-US'));
    return this.http.get<TimeSlot[]>('/api/time-slots', { params });
  }

  getAvailableTimeSlots(doctorId: number, date: Date, timeSlotType?: string): Observable<TimeSlot[]> {
    let params = new HttpParams()
      .set('doctorId', doctorId.toString())
      .set('date', formatDate(date, 'yyyy-MM-dd', 'en-US'));
    if (timeSlotType) {
      params = params.set('timeSlotType', timeSlotType);
    }
    return this.http.get<TimeSlot[]>('/api/time-slots/available', { params });
  }

  createAppointment(timeSlotId: number, symptoms?: string): Observable<any> {
    return this.http.post('/api/patient/appointments', {
      timeSlotId,
      symptoms
    });
  }

  getMyAppointments(): Observable<any[]> {
    return this.http.get<any[]>('/api/patient/appointments');
  }

  getUpcomingAppointments(): Observable<any[]> {
    return this.http.get<any[]>('/api/patient/appointments/upcoming');
  }

  getAppointmentById(id: number): Observable<any> {
    return this.http.get(`/api/patient/appointments/${id}`);
  }

  cancelAppointment(id: number): Observable<any> {
    return this.http.post(`/api/patient/appointments/${id}/cancel`, {});
  }

  rescheduleAppointment(originalId: number, newTimeSlotId: number): Observable<any> {
    return this.http.post('/api/patient/appointments/reschedule', {
      originalAppointmentId: originalId,
      newTimeSlotId
    });
  }

  createReview(appointmentId: number, rating: number, comment?: string): Observable<any> {
    return this.http.post('/api/patient/reviews', {
      appointmentId,
      rating,
      comment
    });
  }

  getMyReviews(): Observable<any[]> {
    return this.http.get<any[]>('/api/patient/reviews');
  }

  getDoctorAppointments(date?: Date): Observable<any[]> {
    let params: any = {};
    if (date) {
      params.date = formatDate(date, 'yyyy-MM-dd', 'en-US');
    }
    return this.http.get<any[]>('/api/doctor/appointments', { params });
  }

  getTodayDoctorAppointments(): Observable<any[]> {
    return this.http.get<any[]>('/api/doctor/appointments/today');
  }

  completeAppointment(id: number): Observable<any> {
    return this.http.post(`/api/doctor/appointments/${id}/complete`, {});
  }

  createMedicalRecord(data: any): Observable<any> {
    return this.http.post('/api/doctor/medical-records', data);
  }

  getMyMedicalRecords(): Observable<any[]> {
    return this.http.get<any[]>('/api/patient/medical-records');
  }

  getDoctorMedicalRecords(): Observable<any[]> {
    return this.http.get<any[]>('/api/doctor/medical-records');
  }

  getFollowUps(completed = false): Observable<any[]> {
    return this.http.get<any[]>('/api/doctor/follow-ups', { params: { completed } });
  }

  completeFollowUp(id: number, notes?: string): Observable<any> {
    const params = notes ? { notes } : {};
    return this.http.post(`/api/doctor/follow-ups/${id}/complete`, {}, { params });
  }

  getNotifications(): Observable<any[]> {
    return this.http.get<any[]>('/api/patient/notifications');
  }

  getUnreadNotificationCount(): Observable<number> {
    return this.http.get<number>('/api/patient/notifications/unread-count');
  }
}
