import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  template: `
    <div class="container">
      <h1 class="page-title">管理后台</h1>

      <div class="dashboard-grid">
        <mat-card class="dashboard-card" (click)="navigateTo('/admin/departments')">
          <div class="card-icon dept">
            <mat-icon>apartment</mat-icon>
          </div>
          <div class="card-content">
            <h3>科室管理</h3>
            <p>管理一级、二级科室信息</p>
          </div>
        </mat-card>

        <mat-card class="dashboard-card" (click)="navigateTo('/admin/doctors')">
          <div class="card-icon doctor">
            <mat-icon>medical_services</mat-icon>
          </div>
          <div class="card-content">
            <h3>医生管理</h3>
            <p>管理医生信息和出诊安排</p>
          </div>
        </mat-card>

        <mat-card class="dashboard-card" (click)="navigateTo('/admin/users')">
          <div class="card-icon user">
            <mat-icon>people</mat-icon>
          </div>
          <div class="card-content">
            <h3>用户管理</h3>
            <p>管理系统用户和权限</p>
          </div>
        </mat-card>

        <mat-card class="dashboard-card" (click)="navigateTo('/admin/schedule')">
          <div class="card-icon schedule">
            <mat-icon>calendar_month</mat-icon>
          </div>
          <div class="card-content">
            <h3>排班管理</h3>
            <p>设置医生排班和号源</p>
          </div>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 24px;
    }
    .dashboard-card {
      display: flex;
      align-items: center;
      gap: 20px;
      padding: 24px;
      cursor: pointer;
      transition: all 0.3s;
    }
    .dashboard-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    }
    .card-icon {
      width: 64px;
      height: 64px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .card-icon mat-icon {
      font-size: 32px;
      color: white;
    }
    .card-icon.dept {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    .card-icon.doctor {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    }
    .card-icon.user {
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    }
    .card-icon.schedule {
      background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
    }
    .card-content h3 {
      margin: 0 0 6px 0;
      font-size: 18px;
    }
    .card-content p {
      margin: 0;
      color: #666;
      font-size: 13px;
    }
  `]
})
export class AdminDashboardComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit() {}

  navigateTo(path: string) {
    this.router.navigate([path]);
  }
}
