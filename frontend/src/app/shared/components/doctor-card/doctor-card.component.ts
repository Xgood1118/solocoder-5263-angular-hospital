import { Component, Input } from '@angular/core';
import { Doctor } from '../../services/doctor.service';

@Component({
  selector: 'app-doctor-card',
  template: `
    <mat-card class="doctor-card" *ngIf="doctor">
      <div class="doctor-header">
        <div class="avatar" [style.background-color]="avatarColor">
          {{ doctor.name?.charAt(0) || '医' }}
        </div>
        <div class="doctor-info">
          <h3 class="doctor-name">{{ doctor.name }}</h3>
          <span class="doctor-title">{{ doctor.title }}</span>
          <span class="doctor-dept">{{ doctor.departmentName }}</span>
        </div>
      </div>
      <p class="doctor-bio">{{ doctor.bio }}</p>
      <div class="doctor-footer">
        <span class="fee">挂号费: ¥{{ doctor.consultationFee }}</span>
        <ng-content></ng-content>
      </div>
    </mat-card>
  `,
  styles: [`
    .doctor-card {
      margin-bottom: 16px;
      transition: box-shadow 0.3s;
    }
    .doctor-card:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
    .doctor-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 12px;
    }
    .avatar {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 24px;
      font-weight: 500;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    .doctor-info {
      flex: 1;
    }
    .doctor-name {
      margin: 0 0 4px 0;
      font-size: 18px;
      font-weight: 500;
    }
    .doctor-title {
      color: #3f51b5;
      font-size: 14px;
      margin-right: 8px;
    }
    .doctor-dept {
      color: #666;
      font-size: 14px;
    }
    .doctor-bio {
      color: #666;
      font-size: 14px;
      line-height: 1.6;
      margin: 0 0 12px 0;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .doctor-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 12px;
      border-top: 1px solid #eee;
    }
    .fee {
      color: #f44336;
      font-weight: 500;
    }
  `]
})
export class DoctorCardComponent {
  @Input() doctor!: Doctor;

  get avatarColor(): string {
    const colors = ['#667eea', '#f093fb', '#4facfe', '#43e97b', '#fa709a'];
    const index = (this.doctor?.id || 0) % colors.length;
    return colors[index];
  }
}
