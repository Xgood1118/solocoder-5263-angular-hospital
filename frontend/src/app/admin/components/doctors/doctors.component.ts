import { Component, OnInit } from '@angular/core';
import { DoctorService, Doctor } from '../../../shared/services/doctor.service';
import { DepartmentService } from '../../../shared/services/department.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-admin-doctors',
  template: `
    <div class="container">
      <div class="flex-between mb-16">
        <h1 class="page-title">医生管理</h1>
        <button mat-raised-button color="primary" (click)="openAddDialog()">
          <mat-icon>add</mat-icon>
          添加医生
        </button>
      </div>

      <mat-card>
        <div class="filter-bar">
          <mat-form-field appearance="fill" class="filter-field">
            <mat-label>科室筛选</mat-label>
            <mat-select [(ngModel)]="selectedDepartmentId" (selectionChange)="filterDoctors()">
              <mat-option [value]="null">全部科室</mat-option>
              <mat-option *ngFor="let dept of departments" [value]="dept.id">
                {{ dept.name }}
              </mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <table mat-table [dataSource]="filteredDoctors" class="doctors-table">
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>姓名</th>
            <td mat-cell *matCellDef="let doctor">{{ doctor.name }}</td>
          </ng-container>

          <ng-container matColumnDef="title">
            <th mat-header-cell *matHeaderCellDef>职称</th>
            <td mat-cell *matCellDef="let doctor">{{ doctor.title }}</td>
          </ng-container>

          <ng-container matColumnDef="department">
            <th mat-header-cell *matHeaderCellDef>所属科室</th>
            <td mat-cell *matCellDef="let doctor">{{ doctor.departmentName }}</td>
          </ng-container>

          <ng-container matColumnDef="fee">
            <th mat-header-cell *matHeaderCellDef>挂号费</th>
            <td mat-cell *matCellDef="let doctor">¥{{ doctor.consultationFee }}</td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>操作</th>
            <td mat-cell *matCellDef="let doctor">
              <button mat-icon-button color="primary" (click)="editDoctor(doctor)">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button color="warn" (click)="deleteDoctor(doctor)">
                <mat-icon>delete</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
      </mat-card>
    </div>
  `,
  styles: [`
    .filter-bar {
      margin-bottom: 16px;
    }
    .filter-field {
      width: 200px;
    }
    .doctors-table {
      width: 100%;
    }
  `]
})
export class AdminDoctorsComponent implements OnInit {
  doctors: Doctor[] = [];
  filteredDoctors: Doctor[] = [];
  departments: any[] = [];
  selectedDepartmentId: number | null = null;
  displayedColumns = ['name', 'title', 'department', 'fee', 'actions'];

  constructor(
    private doctorService: DoctorService,
    private departmentService: DepartmentService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadDepartments();
    this.loadDoctors();
  }

  loadDepartments() {
    this.departmentService.getAllDepartments().subscribe(depts => {
      this.departments = depts;
    });
  }

  loadDoctors() {
    this.doctorService.getAllDoctors().subscribe(doctors => {
      this.doctors = doctors;
      this.filteredDoctors = doctors;
    });
  }

  filterDoctors() {
    if (this.selectedDepartmentId) {
      this.filteredDoctors = this.doctors.filter(
        d => d.departmentId === this.selectedDepartmentId
      );
    } else {
      this.filteredDoctors = this.doctors;
    }
  }

  openAddDialog() {
    this.snackBar.open('添加医生功能开发中', '关闭', { duration: 2000 });
  }

  editDoctor(doctor: Doctor) {
    this.snackBar.open('编辑医生功能开发中', '关闭', { duration: 2000 });
  }

  deleteDoctor(doctor: Doctor) {
    if (confirm(`确定删除医生 ${doctor.name} 吗？`)) {
      this.snackBar.open('删除功能开发中', '关闭', { duration: 2000 });
    }
  }
}
