import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-users',
  template: `
    <div class="container">
      <div class="flex-between mb-16">
        <h1 class="page-title">用户管理</h1>
        <button mat-raised-button color="primary" (click)="addUser()">
          <mat-icon>add</mat-icon>
          添加用户
        </button>
      </div>

      <mat-card>
        <table mat-table [dataSource]="users" class="users-table">
          <ng-container matColumnDef="username">
            <th mat-header-cell *matHeaderCellDef>用户名</th>
            <td mat-cell *matCellDef="let user">{{ user.username }}</td>
          </ng-container>

          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>姓名</th>
            <td mat-cell *matCellDef="let user">{{ user.name }}</td>
          </ng-container>

          <ng-container matColumnDef="phone">
            <th mat-header-cell *matHeaderCellDef>手机号</th>
            <td mat-cell *matCellDef="let user">{{ user.phone || '-' }}</td>
          </ng-container>

          <ng-container matColumnDef="roles">
            <th mat-header-cell *matHeaderCellDef>角色</th>
            <td mat-cell *matCellDef="let user">
              <span class="role-tags">
                <span class="role-tag" *ngFor="let role of user.roles">{{ getRoleName(role) }}</span>
              </span>
            </td>
          </ng-container>

          <ng-container matColumnDef="enabled">
            <th mat-header-cell *matHeaderCellDef>状态</th>
            <td mat-cell *matCellDef="let user">
              <span [class.enabled]="user.enabled" [class.disabled]="!user.enabled">
                {{ user.enabled ? '启用' : '禁用' }}
              </span>
            </td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>操作</th>
            <td mat-cell *matCellDef="let user">
              <button mat-icon-button color="primary">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button color="warn">
                <mat-icon>delete</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
      </mat-card>
    </div>
  `,
  styles: [`
    .users-table {
      width: 100%;
    }
    .enabled {
      color: #2e7d32;
    }
    .disabled {
      color: #c62828;
    }
    .role-tags {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
    }
    .role-tag {
      display: inline-block;
      padding: 2px 10px;
      border-radius: 12px;
      background: #e3f2fd;
      color: #1565c0;
      font-size: 12px;
    }
  `]
})
export class AdminUsersComponent implements OnInit {
  users: any[] = [];
  displayedColumns = ['username', 'name', 'phone', 'roles', 'enabled', 'actions'];

  constructor() {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.users = [
      { id: 1, username: 'admin', name: '系统管理员', phone: '13800000000', roles: ['ADMIN'], enabled: true },
      { id: 2, username: 'doctor1', name: '张明', phone: '13800000001', roles: ['DOCTOR'], enabled: true },
      { id: 3, username: 'doctor2', name: '李华', phone: '13800000002', roles: ['DOCTOR'], enabled: true },
      { id: 4, username: 'patient1', name: '患者小明', phone: '13900000001', roles: ['PATIENT'], enabled: true },
      { id: 5, username: 'patient2', name: '患者小红', phone: '13900000002', roles: ['PATIENT'], enabled: true }
    ];
  }

  getRoleName(role: string): string {
    const roleMap: Record<string, string> = {
      ADMIN: '管理员',
      DOCTOR: '医生',
      PATIENT: '患者'
    };
    return roleMap[role] || role;
  }

  addUser() {
    alert('添加用户功能开发中');
  }
}
