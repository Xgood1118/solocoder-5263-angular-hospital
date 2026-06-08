import { Component, OnInit } from '@angular/core';
import { AppointmentService } from '../../../shared/services/appointment.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-patient-appointments',
  template: `
    <div class="container">
      <div class="flex-between mb-16">
        <h1 class="page-title">我的预约</h1>
        <button mat-raised-button color="primary" routerLink="/patient/appointments/new">
          <mat-icon>add</mat-icon>
          预约挂号
        </button>
      </div>

      <mat-tab-group>
        <mat-tab label="全部预约">
          <div class="appointment-list" *ngIf="appointments.length > 0; else empty">
            <mat-card *ngFor="let apt of appointments" class="appointment-card">
              <div class="appointment-header">
                <div class="doctor-info">
                  <h3>{{ apt.doctorName }}</h3>
                  <span class="title">{{ apt.departmentName }}</span>
                </div>
                <div class="status-badge" [class]="'status-' + apt.status.toLowerCase()">
                  {{ getStatusText(apt.status) }}
                </div>
              </div>
              <div class="appointment-info">
                <div class="info-item">
                  <mat-icon>date_range</mat-icon>
                  <span>{{ apt.appointmentDate }}</span>
                </div>
                <div class="info-item">
                  <mat-icon>access_time</mat-icon>
                  <span>{{ formatTime(apt.startTime) }} - {{ formatTime(apt.endTime) }}</span>
                </div>
                <div class="info-item">
                  <mat-icon>confirmation_number</mat-icon>
                  <span>{{ apt.appointmentNo }}</span>
                </div>
              </div>
              <div class="appointment-actions">
                <button mat-button (click)="viewDetail(apt.id)">查看详情</button>
                <button
                  *ngIf="apt.status === 'CONFIRMED'"
                  mat-button color="warn"
                  (click)="cancelAppointment(apt)"
                >
                  取消预约
                </button>
              </div>
            </mat-card>
          </div>
        </mat-tab>
        <mat-tab label="待就诊">
          <div class="appointment-list" *ngIf="upcomingAppointments.length > 0; else emptyUpcoming">
            <mat-card *ngFor="let apt of upcomingAppointments" class="appointment-card">
              <div class="appointment-header">
                <div class="doctor-info">
                  <h3>{{ apt.doctorName }}</h3>
                  <span class="title">{{ apt.departmentName }}</span>
                </div>
                <div class="status-badge status-confirmed">已确认</div>
              </div>
              <div class="appointment-info">
                <div class="info-item">
                  <mat-icon>date_range</mat-icon>
                  <span>{{ apt.appointmentDate }}</span>
                </div>
                <div class="info-item">
                  <mat-icon>access_time</mat-icon>
                  <span>{{ formatTime(apt.startTime) }} - {{ formatTime(apt.endTime) }}</span>
                </div>
                <div class="info-item">
                  <mat-icon>queue</mat-icon>
                  <span>第 {{ apt.queueNumber }} 号</span>
                </div>
              </div>
              <div class="appointment-actions">
                <button mat-raised-button color="primary" (click)="viewDetail(apt.id)">
                  查看详情
                </button>
              </div>
            </mat-card>
          </div>
        </mat-tab>
      </mat-tab-group>

      <ng-template #empty>
        <div class="empty-state">
          <mat-icon>event_busy</mat-icon>
          <p>暂无预约记录</p>
          <button mat-raised-button color="primary" routerLink="/patient/appointments/new">
            立即预约
          </button>
        </div>
      </ng-template>

      <ng-template #emptyUpcoming>
        <div class="empty-state">
          <mat-icon>event_available</mat-icon>
          <p>暂无待就诊预约</p>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .appointment-list {
      display: grid;
      gap: 16px;
    }
    .appointment-card {
      padding: 16px;
    }
    .appointment-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 16px;
    }
    .doctor-info h3 {
      margin: 0 0 4px 0;
      font-size: 18px;
    }
    .doctor-info .title {
      color: #666;
      font-size: 14px;
    }
    .status-badge {
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 500;
    }
    .status-confirmed {
      background: #e8f5e9;
      color: #2e7d32;
    }
    .status-cancelled {
      background: #ffebee;
      color: #c62828;
    }
    .status-completed {
      background: #e3f2fd;
      color: #1565c0;
    }
    .status-missed {
      background: #fff3e0;
      color: #e65100;
    }
    .appointment-info {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      padding: 12px 0;
      border-top: 1px solid #eee;
      border-bottom: 1px solid #eee;
      margin-bottom: 12px;
    }
    .info-item {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #666;
      font-size: 14px;
    }
    .info-item mat-icon {
      font-size: 20px;
      color: #999;
    }
    .appointment-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
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
export class PatientAppointmentsComponent implements OnInit {
  appointments: any[] = [];
  upcomingAppointments: any[] = [];

  constructor(
    private appointmentService: AppointmentService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadAppointments();
  }

  loadAppointments() {
    this.appointmentService.getMyAppointments().subscribe(appointments => {
      this.appointments = appointments;
    });

    this.appointmentService.getUpcomingAppointments().subscribe(appointments => {
      this.upcomingAppointments = appointments;
    });
  }

  getStatusText(status: string): string {
    const statusMap: Record<string, string> = {
      PENDING: '待确认',
      CONFIRMED: '已确认',
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

  viewDetail(id: number) {
    this.router.navigate(['/patient/appointments', id]);
  }

  cancelAppointment(apt: any) {
    if (!confirm(`确定要取消 ${apt.doctorName} 医生的预约吗？`)) {
      return;
    }

    this.appointmentService.cancelAppointment(apt.id).subscribe({
      next: () => {
        this.snackBar.open('预约取消成功', '关闭', { duration: 2000 });
        this.loadAppointments();
      },
      error: (err) => {
        this.snackBar.open(err.error?.detail || '取消失败', '关闭', { duration: 3000 });
      }
    });
  }
}
