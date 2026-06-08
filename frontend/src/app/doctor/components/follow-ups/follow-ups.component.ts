import { Component, OnInit } from '@angular/core';
import { AppointmentService } from '../../../shared/services/appointment.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-doctor-follow-ups',
  template: `
    <div class="container">
      <h1 class="page-title">回访管理</h1>

      <mat-tab-group>
        <mat-tab label="待回访">
          <div class="follow-up-list" *ngIf="pendingFollowUps.length > 0; else emptyPending">
            <mat-card *ngFor="let fu of pendingFollowUps" class="follow-up-card">
              <div class="follow-up-header">
                <div>
                  <h3>{{ fu.patientName }}</h3>
                  <span class="date">回访日期：{{ formatDate(fu.followUpDate) }}</span>
                </div>
                <span class="status-badge status-pending">待回访</span>
              </div>
              <div class="follow-up-actions">
                <button
                  mat-raised-button
                  color="primary"
                  (click)="completeFollowUp(fu)"
                >
                  完成回访
                </button>
              </div>
            </mat-card>
          </div>
          <ng-template #emptyPending>
            <div class="empty-state">
              <mat-icon>check_circle</mat-icon>
              <p>暂无待回访患者</p>
            </div>
          </ng-template>
        </mat-tab>

        <mat-tab label="已完成">
          <div class="follow-up-list" *ngIf="completedFollowUps.length > 0; else emptyCompleted">
            <mat-card *ngFor="let fu of completedFollowUps" class="follow-up-card completed">
              <div class="follow-up-header">
                <div>
                  <h3>{{ fu.patientName }}</h3>
                  <span class="date">回访日期：{{ formatDate(fu.followUpDate) }}</span>
                </div>
                <span class="status-badge status-completed">已完成</span>
              </div>
              <div class="notes" *ngIf="fu.notes">
                <span class="label">备注：</span>
                <span>{{ fu.notes }}</span>
              </div>
            </mat-card>
          </div>
          <ng-template #emptyCompleted>
            <div class="empty-state">
              <mat-icon>history</mat-icon>
              <p>暂无已完成回访</p>
            </div>
          </ng-template>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    .follow-up-list {
      display: grid;
      gap: 12px;
      padding-top: 16px;
    }
    .follow-up-card {
      padding: 16px;
    }
    .follow-up-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 12px;
    }
    .follow-up-header h3 {
      margin: 0 0 4px 0;
      font-size: 16px;
    }
    .follow-up-header .date {
      color: #666;
      font-size: 13px;
    }
    .status-badge {
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
    }
    .status-pending {
      background: #fff3e0;
      color: #e65100;
    }
    .status-completed {
      background: #e8f5e9;
      color: #2e7d32;
    }
    .follow-up-actions {
      display: flex;
      justify-content: flex-end;
      padding-top: 12px;
      border-top: 1px solid #eee;
    }
    .notes {
      padding: 10px 12px;
      background: #f9f9f9;
      border-radius: 6px;
      font-size: 14px;
    }
    .notes .label {
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
export class DoctorFollowUpsComponent implements OnInit {
  pendingFollowUps: any[] = [];
  completedFollowUps: any[] = [];

  constructor(
    private appointmentService: AppointmentService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadFollowUps();
  }

  loadFollowUps() {
    this.appointmentService.getFollowUps(false).subscribe(followUps => {
      this.pendingFollowUps = followUps;
    });

    this.appointmentService.getFollowUps(true).subscribe(followUps => {
      this.completedFollowUps = followUps;
    });
  }

  completeFollowUp(fu: any) {
    const notes = prompt('请输入回访备注：');
    if (notes === null) return;

    this.appointmentService.completeFollowUp(fu.id, notes || undefined).subscribe({
      next: () => {
        this.snackBar.open('回访完成', '关闭', { duration: 2000 });
        this.loadFollowUps();
      },
      error: (err) => {
        this.snackBar.open(err.error?.detail || '操作失败', '关闭', { duration: 3000 });
      }
    });
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    return dateStr.substring(0, 10);
  }
}
