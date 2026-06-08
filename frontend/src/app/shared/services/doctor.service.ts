import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Doctor {
  id: number;
  userId: number;
  name: string;
  title: string;
  departmentId: number;
  departmentName: string;
  bio: string;
  specialties: string;
  consultationFee: number;
  avatar?: string;
}

export interface Review {
  id: number;
  appointmentId: number;
  patientId: number;
  doctorId: number;
  rating: number;
  comment: string;
  tags?: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  constructor(private http: HttpClient) {}

  getAllDoctors(departmentId?: number): Observable<Doctor[]> {
    const params = departmentId ? { departmentId: departmentId.toString() } : {};
    return this.http.get<Doctor[]>('/api/doctors', { params });
  }

  getDoctorById(id: number): Observable<Doctor> {
    return this.http.get<Doctor>(`/api/doctors/${id}`);
  }

  getDoctorRating(id: number): Observable<number> {
    return this.http.get<number>(`/api/doctors/${id}/rating`);
  }

  getDoctorReviews(id: number): Observable<Review[]> {
    return this.http.get<Review[]>(`/api/doctors/${id}/reviews`);
  }
}
