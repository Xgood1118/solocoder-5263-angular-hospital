import { Component, OnInit } from '@angular/core';
import { AppointmentService } from '../../../shared/services/appointment.service';

@Component({
  selector: 'app-notifications',
  template: `
    <div class="container">
      <h1 class="page-title">消息通知</h1>

      <div class="notifications-list" *ngIf="notifications.length > 0; else empty">
        <mat-card
          *ngFor="let notification of notifications"
          class="notification-card"
          [class.unread]="notification.status === 'SENT' && isToday(notification.sentTime)"
        >
          <div class="notification-icon" [class]="'type-' + notification.type?.toLowerCase()">
            <mat-icon>{{ getIcon(notification.type) }}</mat-icon>
          </div>
          <div class="notification-content">
            <h3>{{ notification.title }}</h3>
            <p>{{ notification.content }}</p>
            <span class="time">{{ formatTime(notification.sentTime || notification.createdAt) }}</span>
          </div>
        </mat-card>
      </div>

      <ng-template #empty>
        <div class="empty-state">
          <mat-icon>notifications_none</mat-icon>
          <p>暂无通知消息</p>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .notifications-list {
      display: grid;
      gap: 12px;
    }
    .notification-card {
      display: flex;
      gap: 16px;
      padding: 16px;
      transition: box-shadow 0.2s;
    }
    .notification-card.unread {
      background: #f5f7ff;
      border-left: 4px solid #3f51b5;
    }
    .notification-icon {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .notification-icon mat-icon {
      color: white;
      font-size: 24px;
    }
    .type-in_app {
      background: #3f51b5;
    }
    .type-sms {
      background: #4caf50;
    }
    .type-email {
      background: #ff9800;
    }
    .notification-content {
      flex: 1;
    }
    .notification-content h3 {
      margin: 0 0 6px 0;
      font-size: 15px;
    }
    .notification-content p {
      margin: 0 0 8px 0;
      color: #666;
      font-size: 14px;
      line-height: 1.5;
    }
    .notification-content .time {
      font-size: 12px;
      color: #999;
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
export class NotificationsComponent implements OnInit {
  notifications: any[] = [];

  constructor(private appointmentService: AppointmentService) {}

  ngOnInit() {
    this.loadNotifications();
  }

  loadNotifications() {
    this.appointmentService.getNotifications().subscribe(notifications => {
      this.notifications = notifications.sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    });
  }

  getIcon(type: string): string {
    switch (type) {
      case 'SMS': return 'sms';
      case 'EMAIL': return 'email';
      default: return 'notifications';
    }
  }

  formatTime(timeStr: string): string {
    if (!timeStr) return '';
    const date = new Date(timeStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 1) {
      const minutes = Math.floor(diff / (1000 * 60));
      return `${minutes}分钟前`;
    } else if (hours < 24) {
      return `${hours}小时前`;
    } else {
      return timeStr.substring(0, 10);
    }
  }

  isToday(timeStr: string): boolean {
    if (!timeStr) return false;
    const date = new Date(timeStr);
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }
}
