import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppointmentService } from '../../../shared/services/appointment.service';

@Component({
  selector: 'app-medical-record-detail',
  template: `
    <div class="container" *ngIf="record">
      <button mat-button routerLink="/patient/medical-records">
        <mat-icon>arrow_back</mat-icon>
        返回列表
      </button>

      <h1 class="page-title">病历详情</h1>

      <mat-card class="record-card">
        <div class="record-header">
          <div>
            <h2>{{ record.doctorName || '医生' }}</h2>
            <p class="dept">{{ record.departmentName || '科室' }}</p>
          </div>
          <span class="date">{{ formatDate(record.createdAt) }}</span>
        </div>

        <mat-divider></mat-divider>

        <div class="record-section">
          <h3>主诉</h3>
          <p>{{ record.chiefComplaint || '无' }}</p>
        </div>

        <div class="record-section">
          <h3>现病史</h3>
          <p>{{ record.presentIllness || '无' }}</p>
        </div>

        <div class="record-section">
          <h3>既往史</h3>
          <p>{{ record.pastHistory || '无' }}</p>
        </div>

        <div class="record-section">
          <h3>诊断</h3>
          <p class="diagnosis">{{ record.diagnosis || '无' }}</p>
        </div>

        <div class="record-section">
          <h3>治疗方案</h3>
          <p>{{ record.treatment || '无' }}</p>
        </div>

        <div class="record-section">
          <h3>处方</h3>
          <p>{{ record.prescription || '无' }}</p>
        </div>

        <div class="record-section">
          <h3>医嘱</h3>
          <p>{{ record.advice || '无' }}</p>
        </div>
      </mat-card>
    </div>
  `,
  styles: [`
    .record-card {
      padding: 24px;
    }
    .record-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 24px;
    }
    .record-header h2 {
      margin: 0 0 4px 0;
      font-size: 20px;
    }
    .record-header .dept {
      margin: 0;
      color: #666;
    }
    .date {
      color: #999;
      font-size: 14px;
    }
    .record-section {
      padding: 16px 0;
    }
    .record-section h3 {
      margin: 0 0 8px 0;
      font-size: 15px;
      color: #3f51b5;
    }
    .record-section p {
      margin: 0;
      color: #333;
      line-height: 1.8;
      white-space: pre-wrap;
    }
    .diagnosis {
      font-weight: 500;
      color: #d32f2f !important;
    }
  `]
})
export class MedicalRecordDetailComponent implements OnInit {
  record: any;

  constructor(
    private route: ActivatedRoute,
    private appointmentService: AppointmentService
  ) {}

  ngOnInit() {
    // Since getRecordById is not available in service, we'll use the list and find
    // For now, just load from list
    this.appointmentService.getMyMedicalRecords().subscribe(records => {
      const id = Number(this.route.snapshot.params['id']);
      this.record = records.find(r => r.id === id);
    });
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    return dateStr.substring(0, 10);
  }
}
