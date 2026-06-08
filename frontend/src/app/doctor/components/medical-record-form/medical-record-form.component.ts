import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AppointmentService } from '../../../shared/services/appointment.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-medical-record-form',
  template: `
    <div class="container">
      <button mat-button (click)="goBack()">
        <mat-icon>arrow_back</mat-icon>
        返回
      </button>

      <h1 class="page-title">{{ isEdit ? '编辑病历' : '书写病历' }}</h1>

      <mat-card *ngIf="appointment" class="appointment-info">
        <h3>患者信息</h3>
        <div class="info-grid">
          <div class="info-item">
            <span class="label">患者姓名：</span>
            <span class="value">{{ appointment.patientName }}</span>
          </div>
          <div class="info-item">
            <span class="label">预约时间：</span>
            <span class="value">{{ appointment.appointmentDate }} {{ formatTime(appointment.startTime) }}</span>
          </div>
          <div class="info-item">
            <span class="label">预约号：</span>
            <span class="value">{{ appointment.appointmentNo }}</span>
          </div>
        </div>
        <div class="symptoms" *ngIf="appointment.symptoms">
          <span class="label">症状描述：</span>
          <span>{{ appointment.symptoms }}</span>
        </div>
      </mat-card>

      <form [formGroup]="recordForm" (ngSubmit)="onSubmit()">
        <mat-card class="form-card">
          <h3>病历内容</h3>

          <div class="form-row">
            <mat-form-field appearance="fill" class="full-width">
              <mat-label>主诉</mat-label>
              <textarea matInput formControlName="chiefComplaint" rows="2" placeholder="患者主要症状"></textarea>
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field appearance="fill" class="full-width">
              <mat-label>现病史</mat-label>
              <textarea matInput formControlName="presentIllness" rows="3" placeholder="详细描述病情"></textarea>
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field appearance="fill" class="full-width">
              <mat-label>既往史</mat-label>
              <textarea matInput formControlName="pastHistory" rows="2" placeholder="既往病史"></textarea>
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field appearance="fill" class="full-width">
              <mat-label>诊断</mat-label>
              <textarea matInput formControlName="diagnosis" rows="2" placeholder="诊断结果"></textarea>
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field appearance="fill" class="full-width">
              <mat-label>治疗方案</mat-label>
              <textarea matInput formControlName="treatment" rows="2" placeholder="治疗建议"></textarea>
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field appearance="fill" class="full-width">
              <mat-label>处方</mat-label>
              <textarea matInput formControlName="prescription" rows="3" placeholder="开具的药品"></textarea>
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field appearance="fill" class="full-width">
              <mat-label>医嘱</mat-label>
              <textarea matInput formControlName="advice" rows="2" placeholder="注意事项"></textarea>
            </mat-form-field>
          </div>

          <div class="form-row follow-up">
            <mat-checkbox formControlName="needFollowUp">需要回访</mat-checkbox>
            <span class="hint">系统将在3天后自动提醒您进行回访</span>
          </div>
        </mat-card>

        <div class="form-actions">
          <button mat-button type="button" (click)="goBack()">取消</button>
          <button
            mat-raised-button
            color="primary"
            type="submit"
            [disabled]="saving"
          >
            {{ saving ? '保存中...' : '保存病历' }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .appointment-info {
      padding: 20px;
      margin-bottom: 24px;
    }
    .appointment-info h3 {
      margin: 0 0 16px 0;
      font-size: 16px;
      color: #3f51b5;
    }
    .info-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      margin-bottom: 12px;
    }
    .info-item .label {
      color: #999;
      font-size: 13px;
    }
    .info-item .value {
      font-weight: 500;
    }
    .symptoms {
      padding: 12px;
      background: #f5f5f5;
      border-radius: 6px;
      font-size: 14px;
    }
    .symptoms .label {
      color: #666;
    }
    .form-card {
      padding: 24px;
    }
    .form-card h3 {
      margin: 0 0 20px 0;
      font-size: 16px;
      color: #3f51b5;
    }
    .form-row {
      margin-bottom: 16px;
    }
    .full-width {
      width: 100%;
    }
    .follow-up {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      background: #f9f9f9;
      border-radius: 8px;
    }
    .follow-up .hint {
      color: #999;
      font-size: 13px;
    }
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 24px;
    }
  `]
})
export class MedicalRecordFormComponent implements OnInit {
  recordForm: FormGroup;
  appointment: any;
  saving = false;
  isEdit = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private appointmentService: AppointmentService,
    private snackBar: MatSnackBar
  ) {
    this.recordForm = this.fb.group({
      appointmentId: [null],
      chiefComplaint: [''],
      presentIllness: [''],
      pastHistory: [''],
      diagnosis: [''],
      treatment: [''],
      prescription: [''],
      advice: [''],
      needFollowUp: [false]
    });
  }

  ngOnInit() {
    const appointmentId = this.route.snapshot.params['appointmentId'];
    if (appointmentId) {
      this.loadAppointment(Number(appointmentId));
      this.recordForm.patchValue({ appointmentId: Number(appointmentId) });
    }
  }

  loadAppointment(id: number) {
    this.appointmentService.getAppointmentById(id).subscribe(apt => {
      this.appointment = apt;
      if (apt.symptoms) {
        this.recordForm.patchValue({ chiefComplaint: apt.symptoms });
      }
    });
  }

  formatTime(time: string): string {
    if (!time) return '';
    return time.substring(0, 5);
  }

  goBack() {
    this.router.navigate(['/doctor/appointments']);
  }

  onSubmit() {
    if (this.recordForm.invalid) return;

    this.saving = true;
    const data = this.recordForm.value;

    this.appointmentService.createMedicalRecord(data).subscribe({
      next: () => {
        this.saving = false;
        this.snackBar.open('病历保存成功', '关闭', { duration: 2000 });
        this.appointmentService.completeAppointment(data.appointmentId).subscribe();
        this.router.navigate(['/doctor/appointments']);
      },
      error: (err) => {
        this.saving = false;
        this.snackBar.open(err.error?.detail || '保存失败', '关闭', { duration: 3000 });
      }
    });
  }
}
