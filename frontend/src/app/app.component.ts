import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  template: `
    <mat-toolbar color="primary" class="toolbar">
      <span class="title" (click)="goHome()">医院预约挂号系统</span>
      <span class="spacer"></span>
      <ng-container *ngIf="authService.isLoggedIn()">
        <button mat-button routerLink="/patient/appointments" *ngIf="authService.hasRole('PATIENT')">
          患者中心
        </button>
        <button mat-button routerLink="/doctor/appointments" *ngIf="authService.hasRole('DOCTOR')">
          医生工作台
        </button>
        <button mat-button routerLink="/admin" *ngIf="authService.hasRole('ADMIN')">
          管理后台
        </button>
        <span class="user-name">{{ authService.getCurrentUserName() }}</span>
        <button mat-button (click)="logout()">退出</button>
      </ng-container>
      <ng-container *ngIf="!authService.isLoggedIn()">
        <button mat-button routerLink="/login">登录</button>
      </ng-container>
    </mat-toolbar>
    <router-outlet></router-outlet>
  `,
  styles: [`
    .toolbar {
      position: sticky;
      top: 0;
      z-index: 1000;
    }
    .title {
      cursor: pointer;
      font-size: 20px;
      font-weight: 500;
    }
    .spacer {
      flex: 1 1 auto;
    }
    .user-name {
      margin: 0 16px;
      font-size: 14px;
    }
  `]
})
export class AppComponent {
  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  goHome() {
    this.router.navigate(['/']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
