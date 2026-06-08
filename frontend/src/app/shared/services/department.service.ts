import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

export interface Department {
  id: number;
  name: string;
  code: string;
  description: string;
  parentId?: number;
  level: number;
  sortOrder: number;
}

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  private departmentsSubject = new BehaviorSubject<Department[]>([]);
  public departments$ = this.departmentsSubject.asObservable().pipe(distinctUntilChanged());

  constructor(private http: HttpClient) {}

  getAllDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>('/api/departments').pipe(
      map(depts => {
        this.departmentsSubject.next(depts);
        return depts;
      })
    );
  }

  getTopLevelDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>('/api/departments/top-level');
  }

  getSubDepartments(parentId: number): Observable<Department[]> {
    return this.http.get<Department[]>(`/api/departments/${parentId}/sub-departments`);
  }

  getDepartmentById(id: number): Observable<Department> {
    return this.http.get<Department>(`/api/departments/${id}`);
  }
}
