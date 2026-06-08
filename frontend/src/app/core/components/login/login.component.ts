import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  template: `
    <div class="login-container">
      <mat-card class="login-card">
        <mat-card-header>
          <mat-card-title>登录</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="fill" class="full-width">
              <mat-label>用户名</mat-label>
              <input matInput formControlName="username" required>
              <mat-error *ngIf="loginForm.get('username')?.hasError('required')">
                请输入用户名
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="fill" class="full-width">
              <mat-label>密码</mat-label>
              <input matInput type="password" formControlName="password" required>
              <mat-error *ngIf="loginForm.get('password')?.hasError('required')">
                请输入密码
              </mat-error>
            </mat-form-field>

            <button mat-raised-button color="primary" type="submit"
                    class="full-width" [disabled]="loading || loginForm.invalid">
              {{ loading ? '登录中...' : '登录' }}
            </button>
          </form>

          <div class="demo-accounts">
            <p class="text-secondary">测试账号：</p>
            <ul>
              <li>管理员：admin / admin123</li>
              <li>医生：doctor1 / doctor123</li>
              <li>患者：patient1 / patient123</li>
            </ul>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 80vh;
      padding: 20px;
    }
    .login-card {
      width: 100%;
      max-width: 400px;
      padding: 24px;
    }
    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }
    .demo-accounts {
      margin-top: 24px;
      padding-top: 16px;
      border-top: 1px solid #eee;
      font-size: 13px;
    }
    .demo-accounts ul {
      margin: 8px 0;
      padding-left: 20px;
    }
    .demo-accounts li {
      margin: 4px 0;
      color: #666;
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  private returnUrl: string;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.loading = true;
    const { username, password } = this.loginForm.value;

    this.authService.login(username, password).subscribe({
      next: () => {
        this.loading = false;
        this.snackBar.open('登录成功', '关闭', { duration: 2000 });
        this.router.navigateByUrl(this.returnUrl);
      },
      error: (err) => {
        this.loading = false;
        this.snackBar.open(err.error?.detail || '登录失败，请检查用户名和密码', '关闭', { duration: 3000 });
      }
    });
  }
}
