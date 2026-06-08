import { Component, OnInit } from '@angular/core';
import { AppointmentService } from '../../../shared/services/appointment.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-doctor-medical-records',
  template: `
    <div class="container">
      <h1 class="page-title">病历管理</h1>

      <div class="records-list" *ngIf="records.length > 0; else empty">
        <mat-card *ngFor="let record of records" class="record-card">
          <div class="record-header">
            <div>
              <h3>{{ record.patientName || '患者' }}</h3>
              <span class="date">{{ formatDate(record.createdAt) }}</span>
            </div>
            <button mat-button color="primary" (click)="editRecord(record)">
              查看/编辑
            </button>
          </div>
          <div class="record-info">
            <div class="info-item">
              <span class="label">诊断：</span>
              <span class="value">{{ record.diagnosis || '-' }}</span>
            </div>
            <div class="info-item">
              <span class="label">主诉：</span>
              <span class="value">{{ record.chiefComplaint || '-' }}</span>
            </div>
          </div>
        </mat-card>
      </div>

      <ng-template #empty>
        <div class="empty-state">
          <mat-icon>description</mat-icon>
          <p>暂无病历记录</p>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .records-list {
      display: grid;
      gap: 12px;
    }
    .record-card {
      padding: 16px;
    }
    .record-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }
    .record-header h3 {
      margin: 0 0 4px 0;
      font-size: 16px;
    }
    .record-header .date {
      color: #999;
      font-size: 13px;
    }
    .record-info {
      padding-top: 12px;
      border-top: 1px solid #eee;
    }
    .info-item {
      display: flex;
      margin-bottom: 6px;
    }
    .info-item .label {
      width: 60px;
      color: #999;
      flex-shrink: 0;
    }
    .info-item .value {
      flex: 1;
      color: #333;
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
export class DoctorMedicalRecordsComponent implements OnInit {
  records: any[] = [];

  constructor(
    private appointmentService: AppointmentService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadRecords();
  }

  loadRecords() {
    this.appointmentService.getDoctorMedicalRecords().subscribe(records => {
      this.records = records;
    });
  }

  editRecord(record: any) {
    // Navigate to edit
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    return dateStr.substring(0, 10);
  }
}
