import { Component, OnInit } from '@angular/core';
import { DepartmentService, Department } from '../../../shared/services/department.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-admin-departments',
  template: `
    <div class="container">
      <div class="flex-between mb-16">
        <h1 class="page-title">科室管理</h1>
        <button mat-raised-button color="primary" (click)="openAddDialog()">
          <mat-icon>add</mat-icon>
          添加科室
        </button>
      </div>

      <mat-card>
        <div class="dept-tree">
          <div *ngFor="let dept of topDepartments" class="dept-item top">
            <div class="dept-header">
              <span class="dept-name">{{ dept.name }}</span>
              <span class="dept-desc">{{ dept.description }}</span>
              <div class="dept-actions">
                <button mat-icon-button color="primary">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn">
                  <mat-icon>delete</mat-icon>
                </button>
              </div>
            </div>
            <div class="sub-depts" *ngIf="getSubDepartments(dept.id).length > 0">
              <div *ngFor="let sub of getSubDepartments(dept.id)" class="dept-item sub">
                <span class="dept-name">{{ sub.name }}</span>
                <span class="dept-desc">{{ sub.description }}</span>
                <div class="dept-actions">
                  <button mat-icon-button color="primary">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button color="warn">
                    <mat-icon>delete</mat-icon>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </mat-card>
    </div>
  `,
  styles: [`
    .dept-tree {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .dept-item {
      padding: 12px 16px;
      border-radius: 8px;
    }
    .dept-item.top {
      background: #f5f7ff;
      margin-bottom: 8px;
    }
    .dept-item.sub {
      background: white;
      margin-left: 32px;
      border: 1px solid #eee;
    }
    .dept-header {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .dept-name {
      font-weight: 500;
      font-size: 15px;
      min-width: 120px;
    }
    .dept-desc {
      flex: 1;
      color: #666;
      font-size: 13px;
    }
    .dept-actions {
      display: flex;
      gap: 4px;
    }
    .sub-depts {
      margin-top: 8px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
  `]
})
export class AdminDepartmentsComponent implements OnInit {
  departments: Department[] = [];
  topDepartments: Department[] = [];

  constructor(
    private departmentService: DepartmentService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadDepartments();
  }

  loadDepartments() {
    this.departmentService.getAllDepartments().subscribe(depts => {
      this.departments = depts;
      this.topDepartments = depts.filter(d => d.level === 1);
    });
  }

  getSubDepartments(parentId: number): Department[] {
    return this.departments.filter(d => d.parentId === parentId);
  }

  openAddDialog() {
    this.snackBar.open('科室添加功能开发中', '关闭', { duration: 2000 });
  }
}
