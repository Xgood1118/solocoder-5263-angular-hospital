import { Component, OnInit } from '@angular/core';
import { AppointmentService } from '../../../shared/services/appointment.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-patient-reviews',
  template: `
    <div class="container">
      <h1 class="page-title">我的评价</h1>

      <div class="reviews-list" *ngIf="reviews.length > 0; else empty">
        <mat-card *ngFor="let review of reviews" class="review-card">
          <div class="review-header">
            <div class="doctor-info">
              <h3>{{ review.doctorName || '医生' }}</h3>
            </div>
            <div class="rating">
              <mat-icon *ngFor="let i of [1,2,3,4,5]" [class.active]="i <= review.rating">
                star
              </mat-icon>
            </div>
          </div>
          <p class="comment" *ngIf="review.comment">{{ review.comment }}</p>
          <div class="review-footer">
            <span class="date">{{ formatDate(review.createdAt) }}</span>
            <span class="tags" *ngIf="review.tags">{{ review.tags }}</span>
          </div>
        </mat-card>
      </div>

      <ng-template #empty>
        <div class="empty-state">
          <mat-icon>rate_review</mat-icon>
          <p>暂无评价记录</p>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .reviews-list {
      display: grid;
      gap: 16px;
    }
    .review-card {
      padding: 16px;
    }
    .review-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }
    .doctor-info h3 {
      margin: 0;
      font-size: 16px;
    }
    .rating mat-icon {
      font-size: 20px;
      color: #ddd;
    }
    .rating mat-icon.active {
      color: #ffc107;
    }
    .comment {
      margin: 0 0 12px 0;
      color: #333;
      line-height: 1.6;
    }
    .review-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 12px;
      border-top: 1px solid #eee;
      font-size: 13px;
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
export class PatientReviewsComponent implements OnInit {
  reviews: any[] = [];

  constructor(
    private appointmentService: AppointmentService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadReviews();
  }

  loadReviews() {
    this.appointmentService.getMyReviews().subscribe(reviews => {
      this.reviews = reviews;
    });
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    return dateStr.substring(0, 10);
  }
}
