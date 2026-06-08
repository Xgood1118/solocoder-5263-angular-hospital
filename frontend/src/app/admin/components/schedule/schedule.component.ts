import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-schedule',
  template: `
    <div class="container">
      <div class="flex-between mb-16">
        <h1 class="page-title">排班管理</h1>
        <button mat-raised-button color="primary" (click)="addSchedule()">
          <mat-icon>add</mat-icon>
          添加排班
        </button>
      </div>

      <mat-card>
        <div class="filter-bar">
          <mat-form-field appearance="fill" class="filter-field">
            <mat-label>选择医生</mat-label>
            <mat-select [(ngModel)]="selectedDoctorId">
              <mat-option [value]="null">全部医生</mat-option>
              <mat-option *ngFor="let doctor of doctors" [value]="doctor.id">
                {{ doctor.name }} - {{ doctor.departmentName }}
              </mat-option>
            </mat-select>
          </mat-form-field>

          <button mat-stroked-button color="primary" (click)="generateSlots()">
            生成号源
          </button>
        </div>

        <div class="schedule-list">
          <div *ngFor="let rule of scheduleRules" class="schedule-item">
            <div class="schedule-info">
              <span class="doctor-name">{{ rule.doctorName }}</span>
              <span class="dept">{{ rule.departmentName }}</span>
              <span class="day">{{ getDayName(rule.dayOfWeek) }}</span>
              <span class="period">{{ rule.timeSlotType === 'MORNING' ? '上午' : '下午' }}</span>
              <span class="time">{{ rule.startTime }} - {{ rule.endTime }}</span>
              <span class="slots">{{ rule.totalSlots }} 个号源</span>
            </div>
            <div class="schedule-actions">
              <button mat-icon-button color="primary">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button color="warn">
                <mat-icon>delete</mat-icon>
              </button>
            </div>
          </div>
        </div>
      </mat-card>
    </div>
  `,
  styles: [`
    .filter-bar {
      display: flex;
      gap: 16px;
      align-items: flex-end;
      margin-bottom: 24px;
    }
    .filter-field {
      width: 300px;
    }
    .schedule-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .schedule-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      background: #f9f9f9;
      border-radius: 8px;
    }
    .schedule-info {
      display: flex;
      align-items: center;
      gap: 16px;
      flex-wrap: wrap;
    }
    .doctor-name {
      font-weight: 500;
      font-size: 15px;
    }
    .dept {
      color: #666;
      font-size: 13px;
    }
    .day {
      background: #3f51b5;
      color: white;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 13px;
    }
    .period {
      font-size: 14px;
    }
    .time {
      color: #666;
      font-size: 14px;
    }
    .slots {
      color: #4caf50;
      font-weight: 500;
      font-size: 14px;
    }
    .schedule-actions {
      display: flex;
      gap: 4px;
    }
  `]
})
export class AdminScheduleComponent implements OnInit {
  doctors: any[] = [];
  selectedDoctorId: number | null = null;
  scheduleRules: any[] = [];

  constructor() {}

  ngOnInit() {
    this.loadDoctors();
    this.loadScheduleRules();
  }

  loadDoctors() {
    this.doctors = [
      { id: 1, name: '张明', departmentName: '心血管内科' },
      { id: 2, name: '李华', departmentName: '消化内科' },
      { id: 3, name: '王丽', departmentName: '儿科' }
    ];
  }

  loadScheduleRules() {
    this.scheduleRules = [
      { id: 1, doctorId: 1, doctorName: '张明', departmentName: '心血管内科', dayOfWeek: 'MONDAY', timeSlotType: 'MORNING', startTime: '08:00', endTime: '12:00', totalSlots: 30 },
      { id: 2, doctorId: 1, doctorName: '张明', departmentName: '心血管内科', dayOfWeek: 'WEDNESDAY', timeSlotType: 'MORNING', startTime: '08:00', endTime: '12:00', totalSlots: 30 },
      { id: 3, doctorId: 1, doctorName: '张明', departmentName: '心血管内科', dayOfWeek: 'FRIDAY', timeSlotType: 'AFTERNOON', startTime: '14:00', endTime: '17:30', totalSlots: 20 },
      { id: 4, doctorId: 2, doctorName: '李华', departmentName: '消化内科', dayOfWeek: 'TUESDAY', timeSlotType: 'MORNING', startTime: '08:00', endTime: '12:00', totalSlots: 25 },
      { id: 5, doctorId: 2, doctorName: '李华', departmentName: '消化内科', dayOfWeek: 'THURSDAY', timeSlotType: 'AFTERNOON', startTime: '14:00', endTime: '17:30', totalSlots: 20 },
      { id: 6, doctorId: 3, doctorName: '王丽', departmentName: '儿科', dayOfWeek: 'MONDAY', timeSlotType: 'AFTERNOON', startTime: '14:00', endTime: '17:30', totalSlots: 25 },
      { id: 7, doctorId: 3, doctorName: '王丽', departmentName: '儿科', dayOfWeek: 'WEDNESDAY', timeSlotType: 'MORNING', startTime: '08:00', endTime: '12:00', totalSlots: 30 },
      { id: 8, doctorId: 3, doctorName: '王丽', departmentName: '儿科', dayOfWeek: 'FRIDAY', timeSlotType: 'MORNING', startTime: '08:00', endTime: '12:00', totalSlots: 30 }
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

  addSchedule() {
    alert('添加排班功能开发中');
  }

  generateSlots() {
    alert('号源生成功能开发中');
  }
}
