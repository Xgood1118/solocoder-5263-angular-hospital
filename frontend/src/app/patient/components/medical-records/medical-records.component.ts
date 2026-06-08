import { Component, OnInit } from '@angular/core';
import { AppointmentService } from '../../../shared/services/appointment.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-patient-medical-records',
  template: `
    <div class="container">
      <h1 class="page-title">我的病历</h1>

      <div class="records-list" *ngIf="records.length > 0; else empty">
        <mat-card *ngFor="let record of records" class="record-card" (click)="viewDetail(record.id)">
          <div class="record-header">
            <div class="doctor-info">
              <h3>{{ record.doctorName || '医生' }}</h3>
              <span class="dept">{{ record.departmentName || '科室' }}</span>
            </div>
            <span class="date">{{ formatDate(record.createdAt) }}</span>
          </div>
          <div class="record-content">
            <div class="record-item">
              <span class="label">主诉：</span>
              <span class="value">{{ record.chiefComplaint || '-' }}</span>
            </div>
            <div class="record-item">
              <span class="label">诊断：</span>
              <span class="value">{{ record.diagnosis || '-' }}</span>
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
      gap: 16px;
    }
    .record-card {
      cursor: pointer;
      padding: 16px;
      transition: box-shadow 0.2s;
    }
    .record-card:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    .record-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 12px;
    }
    .doctor-info h3 {
      margin: 0 0 4px 0;
      font-size: 16px;
    }
    .doctor-info .dept {
      color: #666;
      font-size: 13px;
    }
    .date {
      color: #999;
      font-size: 13px;
    }
    .record-content {
      padding-top: 12px;
      border-top: 1px solid #eee;
    }
    .record-item {
      display: flex;
      margin-bottom: 8px;
    }
    .record-item .label {
      width: 60px;
      color: #999;
      flex-shrink: 0;
    }
    .record-item .value {
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
export class PatientMedicalRecordsComponent implements OnInit {
  records: any[] = [];

  constructor(
    private appointmentService: AppointmentService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadRecords();
  }

  loadRecords() {
    this.appointmentService.getMyMedicalRecords().subscribe(records => {
      this.records = records;
    });
  }

  viewDetail(id: number) {
    this.router.navigate(['/patient/medical-records', id]);
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    return dateStr.substring(0, 10);
  }
}
