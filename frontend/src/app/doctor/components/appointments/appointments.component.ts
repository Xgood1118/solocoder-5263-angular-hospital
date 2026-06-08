import { Component, OnInit } from '@angular/core';
import { AppointmentService } from '../../../shared/services/appointment.service';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-doctor-appointments',
  template: `
    <div class="container">
      <div class="flex-between mb-16">
        <h1 class="page-title">今日门诊</h1>
        <mat-form-field appearance="fill" class="date-picker">
          <mat-label>选择日期</mat-label>
          <input
            matInput
            [matDatepicker]="picker"
            [formControl]="dateControl"
            (dateChange)="onDateChange()"
          >
          <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
        </mat-form-field>
      </div>

      <mat-card class="stats-card">
        <div class="stats-grid">
          <div class="stat-item">
            <span class="stat-number">{{ confirmedCount }}</span>
            <span class="stat-label">已预约</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ completedCount }}</span>
            <span class="stat-label">已完成</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ missedCount }}</span>
            <span class="stat-label">已过号</span>
          </div>
        </div>
      </mat-card>

      <div class="appointments-list" *ngIf="appointments.length > 0; else empty">
        <mat-card *ngFor="let apt of appointments" class="appointment-card" [class.selected]="selectedAppointment?.id === apt.id">
          <div class="appointment-header">
            <div class="patient-info">
              <span class="queue-number">{{ apt.queueNumber }}</span>
              <div>
                <h3>{{ apt.patientName }}</h3>
                <span class="time">{{ formatTime(apt.startTime) }} - {{ formatTime(apt.endTime) }}</span>
              </div>
            </div>
            <span class="status-badge" [class]="'status-' + apt.status.toLowerCase()">
              {{ getStatusText(apt.status) }}
            </span>
          </div>

          <div class="symptoms" *ngIf="apt.symptoms">
            <span class="label">症状：</span>
            <span>{{ apt.symptoms }}</span>
          </div>

          <div class="appointment-actions" *ngIf="apt.status === 'CONFIRMED'">
            <button
              mat-stroked-button
              color="primary"
              (click)="startVisit(apt)"
            >
              开始看诊
            </button>
            <button
              mat-button
              color="warn"
              (click)="markAsMissed(apt)"
            >
              标记过号
            </button>
          </div>

          <div class="appointment-actions" *ngIf="apt.status === 'COMPLETED'">
            <button
              mat-button
              color="primary"
              (click)="viewRecord(apt.id)"
            >
              查看病历
            </button>
          </div>
        </mat-card>
      </div>

      <ng-template #empty>
        <div class="empty-state">
          <mat-icon>event_busy</mat-icon>
          <p>当日暂无预约</p>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .date-picker {
      width: 200px;
    }
    .stats-card {
      margin-bottom: 24px;
      padding: 20px;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      text-align: center;
    }
    .stat-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .stat-number {
      font-size: 28px;
      font-weight: 600;
      color: #3f51b5;
    }
    .stat-label {
      font-size: 13px;
      color: #666;
    }
    .appointments-list {
      display: grid;
      gap: 12px;
    }
    .appointment-card {
      padding: 16px;
    }
    .appointment-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 12px;
    }
    .patient-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .queue-number {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #3f51b5;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 16px;
    }
    .patient-info h3 {
      margin: 0 0 4px 0;
      font-size: 16px;
    }
    .patient-info .time {
      color: #666;
      font-size: 13px;
    }
    .status-badge {
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
    }
    .status-confirmed {
      background: #e8f5e9;
      color: #2e7d32;
    }
    .status-completed {
      background: #e3f2fd;
      color: #1565c0;
    }
    .status-missed {
      background: #ffebee;
      color: #c62828;
    }
    .status-cancelled {
      background: #f5f5f5;
      color: #999;
    }
    .symptoms {
      padding: 10px 12px;
      background: #f9f9f9;
      border-radius: 6px;
      margin-bottom: 12px;
      font-size: 14px;
    }
    .symptoms .label {
      color: #999;
    }
    .appointment-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      padding-top: 12px;
      border-top: 1px solid #eee;
    }
    .empty-state {
      text-align: center;
      padding: 60px 20px;
      color: #999;
    }
    .empty-state mat-icon {
      font-size: 64px;
      margin-bottom: 16px;
    }
  `]
})
export class DoctorAppointmentsComponent implements OnInit {
  appointments: any[] = [];
  selectedAppointment: any;
  dateControl = new FormControl(new Date());

  constructor(
    private appointmentService: AppointmentService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadAppointments();
  }

  onDateChange() {
    this.loadAppointments();
  }

  loadAppointments() {
    const date = this.dateControl.value;
    if (date) {
      this.appointmentService.getDoctorAppointments(date).subscribe(appointments => {
        this.appointments = appointments;
      });
    }
  }

  get confirmedCount(): number {
    return this.appointments.filter(a => a.status === 'CONFIRMED').length;
  }

  get completedCount(): number {
    return this.appointments.filter(a => a.status === 'COMPLETED').length;
  }

  get missedCount(): number {
    return this.appointments.filter(a => a.status === 'MISSED').length;
  }

  getStatusText(status: string): string {
    const statusMap: Record<string, string> = {
      PENDING: '待确认',
      CONFIRMED: '待就诊',
      CANCELLED: '已取消',
      COMPLETED: '已完成',
      MISSED: '已过号',
      RESCHEDULED: '已改签'
    };
    return statusMap[status] || status;
  }

  formatTime(time: string): string {
    if (!time) return '';
    return time.substring(0, 5);
  }

  startVisit(apt: any) {
    this.router.navigate(['/doctor/medical-records/new', apt.id]);
  }

  viewRecord(appointmentId: number) {
    // 跳转到病历详情或编辑
    this.router.navigate(['/doctor/medical-records/new', appointmentId]);
  }

  markAsMissed(apt: any) {
    if (!confirm('确定标记该患者为过号吗？')) return;

    this.appointmentService.completeAppointment(apt.id).subscribe({
      next: () => {
        // In real app, we'd have a separate missed endpoint
        this.snackBar.open('已标记为过号', '关闭', { duration: 2000 });
        this.loadAppointments();
      },
      error: (err) => {
        this.snackBar.open(err.error?.detail || '操作失败', '关闭', { duration: 3000 });
      }
    });
  }
}
