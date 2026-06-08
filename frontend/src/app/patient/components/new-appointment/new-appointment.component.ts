import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DepartmentService, Department } from '../../../shared/services/department.service';
import { DoctorService, Doctor } from '../../../shared/services/doctor.service';
import { AppointmentService, TimeSlot } from '../../../shared/services/appointment.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { addDays } from 'date-fns';

@Component({
  selector: 'app-new-appointment',
  template: `
    <div class="container booking-page">
      <h1 class="page-title">预约挂号</h1>

      <mat-stepper [linear]="true" #stepper>
        <mat-step label="选择科室">
          <div class="step-content">
            <div class="departments-grid">
              <mat-card
                *ngFor="let dept of departments"
                class="dept-card"
                [class.selected]="selectedDepartment?.id === dept.id"
                (click)="selectDepartment(dept)"
              >
                <h3>{{ dept.name }}</h3>
                <p>{{ dept.description }}</p>
              </mat-card>
            </div>

            <div *ngIf="selectedDepartment && subDepartments.length > 0" class="sub-depts">
              <h3>下级科室</h3>
              <div class="departments-grid sub">
                <mat-card
                  *ngFor="let dept of subDepartments"
                  class="dept-card"
                  [class.selected]="selectedSubDepartment?.id === dept.id"
                  (click)="selectSubDepartment(dept)"
                >
                  <h4>{{ dept.name }}</h4>
                </mat-card>
              </div>
            </div>

            <div class="step-actions">
              <button
                mat-raised-button
                color="primary"
                matStepperNext
                [disabled]="!selectedDepartment"
              >
                下一步
              </button>
            </div>
          </div>
        </mat-step>

        <mat-step label="选择医生">
          <div class="step-content">
            <div class="doctors-list">
              <app-doctor-card
                *ngFor="let doctor of doctors"
                [doctor]="doctor"
                [class.selected]="selectedDoctor?.id === doctor.id"
                (click)="selectDoctor(doctor)"
                style="cursor: pointer;"
              >
                <button
                  *ngIf="selectedDoctor?.id === doctor.id"
                  mat-raised-button
                  color="primary"
                  (click)="$event.stopPropagation(); selectDoctor(doctor)"
                >
                  已选择
                </button>
                <button
                  *ngIf="selectedDoctor?.id !== doctor.id"
                  mat-stroked-button
                  color="primary"
                  (click)="$event.stopPropagation(); selectDoctor(doctor)"
                >
                  选择该医生
                </button>
              </app-doctor-card>
            </div>

            <div class="step-actions">
              <button mat-button matStepperPrevious>上一步</button>
              <button
                mat-raised-button
                color="primary"
                matStepperNext
                [disabled]="!selectedDoctor"
              >
                下一步
              </button>
            </div>
          </div>
        </mat-step>

        <mat-step label="选择时间">
          <div class="step-content time-step">
            <div class="calendar-section">
              <app-calendar
                [selectedDate]="selectedDate"
                (selectedDateChange)="onDateChange($event)"
                [minDate]="minDate"
                [maxDate]="maxDate"
              ></app-calendar>
            </div>

            <div class="slots-section">
              <h3>{{ selectedDateStr }} 号源</h3>
              <div *ngIf="loadingSlots" class="loading">
                <mat-spinner diameter="32"></mat-spinner>
                <span>加载中...</span>
              </div>
              <app-time-slot-picker
                *ngIf="!loadingSlots"
                [timeSlots]="timeSlots"
                [selectedSlotId]="selectedSlot?.id"
                (selectedSlotChange)="selectSlot($event)"
              ></app-time-slot-picker>
            </div>

            <div class="step-actions">
              <button mat-button matStepperPrevious>上一步</button>
              <button
                mat-raised-button
                color="primary"
                matStepperNext
                [disabled]="!selectedSlot"
              >
                下一步
              </button>
            </div>
          </div>
        </mat-step>

        <mat-step label="确认预约">
          <div class="step-content">
            <mat-card class="confirm-card">
              <h3>预约信息确认</h3>
              <div class="confirm-item">
                <span class="label">科室：</span>
                <span class="value">{{ selectedDepartment?.name }}</span>
              </div>
              <div class="confirm-item">
                <span class="label">医生：</span>
                <span class="value">{{ selectedDoctor?.name }} {{ selectedDoctor?.title }}</span>
              </div>
              <div class="confirm-item">
                <span class="label">日期：</span>
                <span class="value">{{ selectedDateStr }}</span>
              </div>
              <div class="confirm-item">
                <span class="label">时间：</span>
                <span class="value">
                  {{ selectedSlot ? formatTime(selectedSlot.startTime) : '' }} -
                  {{ selectedSlot ? formatTime(selectedSlot.endTime) : '' }}
                </span>
              </div>
              <div class="confirm-item">
                <span class="label">挂号费：</span>
                <span class="value fee">¥{{ selectedDoctor?.consultationFee }}</span>
              </div>

              <div class="symptoms-section">
                <mat-form-field appearance="fill" class="full-width">
                  <mat-label>症状描述（选填）</mat-label>
                  <textarea
                    matInput
                    [(ngModel)]="symptoms"
                    rows="3"
                    placeholder="请简要描述您的症状..."
                  ></textarea>
                </mat-form-field>
              </div>
            </mat-card>

            <div class="step-actions">
              <button mat-button matStepperPrevious>上一步</button>
              <button
                mat-raised-button
                color="primary"
                (click)="submitBooking()"
                [disabled]="booking"
              >
                {{ booking ? '提交中...' : '确认预约' }}
              </button>
            </div>
          </div>
        </mat-step>
      </mat-stepper>
    </div>
  `,
  styles: [`
    .booking-page {
      max-width: 900px;
      margin: 0 auto;
      padding: 20px;
    }
    .step-content {
      padding: 24px 0;
    }
    .departments-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }
    .departments-grid.sub {
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    }
    .dept-card {
      cursor: pointer;
      transition: all 0.2s;
      padding: 16px;
    }
    .dept-card:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    .dept-card.selected {
      border: 2px solid #3f51b5;
      background: #f5f7ff;
    }
    .dept-card h3 {
      margin: 0 0 8px 0;
      font-size: 16px;
    }
    .dept-card h4 {
      margin: 0;
      font-size: 14px;
    }
    .dept-card p {
      margin: 0;
      font-size: 13px;
      color: #666;
    }
    .sub-depts {
      margin-top: 24px;
      padding-top: 24px;
      border-top: 1px solid #eee;
    }
    .sub-depts h3 {
      margin: 0 0 16px 0;
      font-size: 16px;
    }
    .doctors-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 16px;
    }
    .time-step {
      display: grid;
      grid-template-columns: 320px 1fr;
      gap: 32px;
    }
    .slots-section h3 {
      margin: 0 0 16px 0;
      font-size: 18px;
    }
    .loading {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 40px 0;
      color: #666;
    }
    .step-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 24px;
      padding-top: 24px;
      border-top: 1px solid #eee;
    }
    .confirm-card {
      padding: 24px;
    }
    .confirm-card h3 {
      margin: 0 0 20px 0;
      font-size: 18px;
    }
    .confirm-item {
      display: flex;
      padding: 12px 0;
      border-bottom: 1px solid #f0f0f0;
    }
    .confirm-item .label {
      width: 100px;
      color: #666;
    }
    .confirm-item .value {
      flex: 1;
      font-weight: 500;
    }
    .confirm-item .fee {
      color: #f44336;
      font-size: 18px;
    }
    .symptoms-section {
      margin-top: 24px;
    }
    .full-width {
      width: 100%;
    }
  `]
})
export class NewAppointmentComponent implements OnInit {
  departments: Department[] = [];
  subDepartments: Department[] = [];
  doctors: Doctor[] = [];
  timeSlots: TimeSlot[] = [];

  selectedDepartment?: Department;
  selectedSubDepartment?: Department;
  selectedDoctor?: Doctor;
  selectedDate: Date = new Date();
  selectedSlot?: TimeSlot;
  symptoms = '';

  loadingSlots = false;
  booking = false;

  minDate = new Date();
  maxDate = addDays(new Date(), 7);

  constructor(
    private departmentService: DepartmentService,
    private doctorService: DoctorService,
    private appointmentService: AppointmentService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadDepartments();

    const doctorId = this.route.snapshot.queryParams['doctorId'];
    if (doctorId) {
      this.doctorService.getDoctorById(doctorId).subscribe(doctor => {
        this.selectedDoctor = doctor;
        this.departmentService.getDepartmentById(doctor.departmentId).subscribe(dept => {
          this.selectedDepartment = dept;
        });
      });
    }
  }

  loadDepartments() {
    this.departmentService.getTopLevelDepartments().subscribe(depts => {
      this.departments = depts;
    });
  }

  selectDepartment(dept: Department) {
    this.selectedDepartment = dept;
    this.selectedSubDepartment = undefined;
    this.selectedDoctor = undefined;

    if (dept.level === 1) {
      this.departmentService.getSubDepartments(dept.id).subscribe(subDepts => {
        this.subDepartments = subDepts;
        if (subDepts.length === 0) {
          this.loadDoctors(dept.id);
        }
      });
    } else {
      this.subDepartments = [];
      this.loadDoctors(dept.id);
    }
  }

  selectSubDepartment(dept: Department) {
    this.selectedSubDepartment = dept;
    this.selectedDoctor = undefined;
    this.loadDoctors(dept.id);
  }

  loadDoctors(departmentId: number) {
    this.doctorService.getAllDoctors(departmentId).subscribe(doctors => {
      this.doctors = doctors;
    });
  }

  selectDoctor(doctor: Doctor) {
    this.selectedDoctor = doctor;
  }

  onDateChange(date: Date) {
    this.selectedDate = date;
    this.selectedSlot = undefined;
    this.loadTimeSlots();
  }

  loadTimeSlots() {
    if (!this.selectedDoctor) return;

    this.loadingSlots = true;
    this.timeSlots = [];

    this.appointmentService.getAvailableTimeSlots(
      this.selectedDoctor.id,
      this.selectedDate
    ).subscribe({
      next: slots => {
        this.timeSlots = slots;
        this.loadingSlots = false;
      },
      error: () => {
        this.loadingSlots = false;
      }
    });
  }

  selectSlot(slot: TimeSlot) {
    this.selectedSlot = slot;
  }

  get selectedDateStr(): string {
    const d = this.selectedDate;
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  formatTime(time: string): string {
    if (!time) return '';
    return time.substring(0, 5);
  }

  submitBooking() {
    if (!this.selectedSlot) return;

    this.booking = true;
    this.appointmentService.createAppointment(this.selectedSlot.id, this.symptoms).subscribe({
      next: (appointment) => {
        this.booking = false;
        this.snackBar.open('预约成功！', '关闭', { duration: 3000 });
        this.router.navigate(['/patient/appointments', appointment.id]);
      },
      error: (err) => {
        this.booking = false;
        this.snackBar.open(err.error?.detail || '预约失败，请重试', '关闭', { duration: 3000 });
      }
    });
  }
}
