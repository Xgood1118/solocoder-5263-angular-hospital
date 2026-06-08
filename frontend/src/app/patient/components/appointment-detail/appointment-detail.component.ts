import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppointmentService } from '../../../shared/services/appointment.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-appointment-detail',
  template: `
    <div class="container" *ngIf="appointment">
      <button mat-button routerLink="/patient/appointments">
        <mat-icon>arrow_back</mat-icon>
        返回列表
      </button>

      <h1 class="page-title">预约详情</h1>

      <mat-card class="detail-card">
        <div class="status-header">
          <h2>{{ appointment.doctorName }}</h2>
          <span class="status-badge" [class]="'status-' + appointment.status.toLowerCase()">
            {{ getStatusText(appointment.status) }}
          </span>
        </div>

        <div class="info-grid">
          <div class="info-item">
            <span class="label">科室</span>
            <span class="value">{{ appointment.departmentName }}</span>
          </div>
          <div class="info-item">
            <span class="label">医生职称</span>
            <span class="value">{{ appointment.doctorName }}</span>
          </div>
          <div class="info-item">
            <span class="label">预约日期</span>
            <span class="value">{{ appointment.appointmentDate }}</span>
          </div>
          <div class="info-item">
            <span class="label">预约时间</span>
            <span class="value">{{ formatTime(appointment.startTime) }} - {{ formatTime(appointment.endTime) }}</span>
          </div>
          <div class="info-item">
            <span class="label">预约号</span>
            <span class="value">{{ appointment.appointmentNo }}</span>
          </div>
          <div class="info-item">
            <span class="label">排队号</span>
            <span class="value">第 {{ appointment.queueNumber }} 号</span>
          </div>
        </div>

        <div class="symptoms-section" *ngIf="appointment.symptoms">
          <h4>症状描述</h4>
          <p>{{ appointment.symptoms }}</p>
        </div>

        <div class="actions">
          <button
            *ngIf="appointment.status === 'CONFIRMED'"
            mat-raised-button
            color="warn"
            (click)="cancelAppointment()"
          >
            取消预约
          </button>
          <button
            *ngIf="appointment.status === 'CONFIRMED'"
            mat-stroked-button
            color="primary"
            [routerLink]="['/patient/appointments/new']"
            [queryParams]="{ reschedule: appointment.id }"
          >
            改签预约
          </button>
          <button
            *ngIf="appointment.status === 'COMPLETED' && !hasReview"
            mat-raised-button
            color="primary"
            (click)="showReviewDialog = true"
          >
            评价医生
          </button>
          <button
            *ngIf="appointment.status === 'COMPLETED' && hasMedicalRecord"
            mat-stroked-button
            color="primary"
            [routerLink]="['/patient/medical-records', medicalRecordId]"
          >
            查看病历
          </button>
        </div>
      </mat-card>

      <div class="tips-card mat-elevation-z1" *ngIf="appointment.status === 'CONFIRMED'">
        <h4>就诊须知</h4>
        <ul>
          <li>请提前15分钟到达医院科室候诊</li>
          <li>请携带身份证、医保卡等有效证件</li>
          <li>就诊前24小时可免费取消预约</li>
          <li>如需改签，请先取消原预约再重新预约</li>
        </ul>
      </div>
    </div>
  `,
  styles: [`
    .detail-card {
      padding: 24px;
      margin-bottom: 24px;
    }
    .status-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 1px solid #eee;
    }
    .status-header h2 {
      margin: 0;
      font-size: 22px;
    }
    .status-badge {
      padding: 6px 16px;
      border-radius: 20px;
      font-size: 14px;
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
    .info-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
      margin-bottom: 24px;
    }
    .info-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .info-item .label {
      font-size: 13px;
      color: #999;
    }
    .info-item .value {
      font-size: 15px;
      font-weight: 500;
    }
    .symptoms-section {
      padding: 16px;
      background: #f9f9f9;
      border-radius: 8px;
      margin-bottom: 24px;
    }
    .symptoms-section h4 {
      margin: 0 0 8px 0;
      font-size: 14px;
      color: #666;
    }
    .symptoms-section p {
      margin: 0;
      color: #333;
      line-height: 1.6;
    }
    .actions {
      display: flex;
      gap: 12px;
      padding-top: 16px;
      border-top: 1px solid #eee;
    }
    .tips-card {
      padding: 20px;
      background: #fff8e1;
      border-radius: 8px;
    }
    .tips-card h4 {
      margin: 0 0 12px 0;
      color: #f57c00;
    }
    .tips-card ul {
      margin: 0;
      padding-left: 20px;
    }
    .tips-card li {
      margin: 6px 0;
      color: #666;
      font-size: 14px;
    }
  `]
})
export class AppointmentDetailComponent implements OnInit {
  appointment: any;
  hasReview = false;
  hasMedicalRecord = false;
  medicalRecordId?: number;
  showReviewDialog = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private appointmentService: AppointmentService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.params['id']);
    this.loadAppointment(id);
  }

  loadAppointment(id: number) {
    this.appointmentService.getAppointmentById(id).subscribe(apt => {
      this.appointment = apt;
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

  cancelAppointment() {
    if (!confirm('确定要取消这个预约吗？')) return;

    this.appointmentService.cancelAppointment(this.appointment.id).subscribe({
      next: () => {
        this.snackBar.open('预约取消成功', '关闭', { duration: 2000 });
        this.loadAppointment(this.appointment.id);
      },
      error: (err) => {
        this.snackBar.open(err.error?.detail || '取消失败', '关闭', { duration: 3000 });
      }
    });
  }
}
