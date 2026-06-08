import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-doctor-schedule',
  template: `
    <div class="container">
      <h1 class="page-title">排班管理</h1>

      <mat-card>
        <h3>我的排班</h3>
        <p class="hint">排班规则由管理员统一设置，如需调整请联系管理员</p>

        <div class="schedule-table">
          <table mat-table>
            <tr>
              <th>星期</th>
              <th>时段</th>
              <th>开始时间</th>
              <th>结束时间</th>
              <th>号源数</th>
            </tr>
            <tr *ngFor="let rule of scheduleRules">
              <td>{{ getDayName(rule.dayOfWeek) }}</td>
              <td>{{ rule.timeSlotType === 'MORNING' ? '上午' : '下午' }}</td>
              <td>{{ rule.startTime }}</td>
              <td>{{ rule.endTime }}</td>
              <td>{{ rule.totalSlots }}</td>
            </tr>
            <tr *ngIf="scheduleRules.length === 0">
              <td colspan="5" class="empty">暂无排班信息</td>
            </tr>
          </table>
        </div>

        <div class="action-section">
          <h4>停诊设置</h4>
          <p class="hint">如需临时停诊，请选择停诊日期范围（系统将自动通知已预约患者）</p>

          <div class="date-range">
            <mat-form-field appearance="fill">
              <mat-label>开始日期</mat-label>
              <input matInput [matDatepicker]="startPicker" [(ngModel)]="startDate">
              <mat-datepicker-toggle matSuffix [for]="startPicker"></mat-datepicker-toggle>
              <mat-datepicker #startPicker></mat-datepicker>
            </mat-form-field>
            <span class="to">至</span>
            <mat-form-field appearance="fill">
              <mat-label>结束日期</mat-label>
              <input matInput [matDatepicker]="endPicker" [(ngModel)]="endDate">
              <mat-datepicker-toggle matSuffix [for]="endPicker"></mat-datepicker-toggle>
              <mat-datepicker #endPicker></mat-datepicker>
            </mat-form-field>
          </div>

          <mat-form-field appearance="fill" class="full-width">
            <mat-label>停诊原因</mat-label>
            <input matInput [(ngModel)]="cancelReason" placeholder="请输入停诊原因">
          </mat-form-field>

          <button
            mat-raised-button
            color="warn"
            (click)="cancelSlots()"
            [disabled]="!startDate || !endDate || cancelling"
          >
            {{ cancelling ? '提交中...' : '确认停诊' }}
          </button>
        </div>
      </mat-card>
    </div>
  `,
  styles: [`
    h3 {
      margin: 0 0 8px 0;
      font-size: 18px;
    }
    .hint {
      color: #999;
      font-size: 13px;
      margin-bottom: 20px;
    }
    .schedule-table {
      margin-bottom: 32px;
    }
    .schedule-table table {
      width: 100%;
      border-collapse: collapse;
    }
    .schedule-table th,
    .schedule-table td {
      padding: 12px 16px;
      text-align: left;
      border-bottom: 1px solid #eee;
    }
    .schedule-table th {
      background: #f5f5f5;
      font-weight: 500;
      color: #666;
    }
    .schedule-table .empty {
      text-align: center;
      color: #999;
      padding: 40px;
    }
    .action-section {
      padding-top: 24px;
      border-top: 1px solid #eee;
    }
    .action-section h4 {
      margin: 0 0 8px 0;
      font-size: 16px;
      color: #f44336;
    }
    .date-range {
      display: flex;
      align-items: flex-end;
      gap: 16px;
      margin-bottom: 16px;
    }
    .date-range .to {
      color: #999;
      padding-bottom: 18px;
    }
    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }
  `]
})
export class DoctorScheduleComponent implements OnInit {
  scheduleRules: any[] = [];
  startDate: Date | null = null;
  endDate: Date | null = null;
  cancelReason = '';
  cancelling = false;

  constructor() {}

  ngOnInit() {
    this.loadScheduleRules();
  }

  loadScheduleRules() {
    // TODO: Load from service
    this.scheduleRules = [
      { dayOfWeek: 'MONDAY', timeSlotType: 'MORNING', startTime: '08:00', endTime: '12:00', totalSlots: 30 },
      { dayOfWeek: 'WEDNESDAY', timeSlotType: 'MORNING', startTime: '08:00', endTime: '12:00', totalSlots: 30 },
      { dayOfWeek: 'FRIDAY', timeSlotType: 'AFTERNOON', startTime: '14:00', endTime: '17:30', totalSlots: 20 }
    ];
  }

  getDayName(day: string): string {
    const dayMap: Record<string, string> = {
      MONDAY: '周一',
      TUESDAY: '周二',
      WEDNESDAY: '周三',
      THURSDAY: '周四',
      FRIDAY: '周五',
      SATURDAY: '周六',
      SUNDAY: '周日'
    };
    return dayMap[day] || day;
  }

  cancelSlots() {
    if (!this.startDate || !this.endDate) return;
    alert('停诊功能开发中...');
  }
}
