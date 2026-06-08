import { Component, OnInit } from '@angular/core';
import { DepartmentService, Department } from '../../services/department.service';
import { DoctorService, Doctor } from '../../services/doctor.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  template: `
    <div class="home-page">
      <div class="hero-section">
        <div class="hero-content container">
          <h1>便捷就医，从预约开始</h1>
          <p>在线预约三甲医院专家号，省时省力</p>
        </div>
      </div>

      <div class="container content-section">
        <section class="departments-section">
          <h2 class="section-title">科室导航</h2>
          <div class="departments-grid">
            <mat-card
              *ngFor="let dept of topDepartments"
              class="dept-card"
              (click)="selectDepartment(dept)"
            >
              <div class="dept-icon">🏥</div>
              <h3>{{ dept.name }}</h3>
              <p>{{ dept.description }}</p>
              <button mat-button color="primary">查看医生</button>
            </mat-card>
          </div>
        </section>

        <section class="doctors-section" *ngIf="selectedDepartment">
          <h2 class="section-title">
            {{ selectedDepartment.name }} - 医生列表
          </h2>
          <div class="doctors-list">
            <app-doctor-card
              *ngFor="let doctor of doctors"
              [doctor]="doctor"
            >
              <button
                mat-raised-button
                color="primary"
                (click)="goToBooking(doctor)"
              >
                立即预约
              </button>
            </app-doctor-card>
          </div>
        </section>

        <section class="doctors-section" *ngIf="!selectedDepartment">
          <h2 class="section-title">推荐医生</h2>
          <div class="doctors-list">
            <app-doctor-card
              *ngFor="let doctor of featuredDoctors"
              [doctor]="doctor"
            >
              <button
                mat-raised-button
                color="primary"
                (click)="goToBooking(doctor)"
              >
                立即预约
              </button>
            </app-doctor-card>
          </div>
        </section>
      </div>
    </div>
  `,
  styles: [`
    .home-page {
      min-height: calc(100vh - 64px);
    }
    .hero-section {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 60px 0;
      text-align: center;
    }
    .hero-content h1 {
      font-size: 36px;
      margin: 0 0 16px 0;
      font-weight: 500;
    }
    .hero-content p {
      font-size: 18px;
      margin: 0;
      opacity: 0.9;
    }
    .content-section {
      padding: 40px 16px;
    }
    .section-title {
      font-size: 22px;
      font-weight: 500;
      margin: 0 0 24px 0;
      color: #333;
    }
    .departments-section {
      margin-bottom: 48px;
    }
    .departments-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 16px;
    }
    .dept-card {
      text-align: center;
      cursor: pointer;
      transition: all 0.3s;
      padding: 24px 16px;
    }
    .dept-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    }
    .dept-icon {
      font-size: 48px;
      margin-bottom: 12px;
    }
    .dept-card h3 {
      margin: 0 0 8px 0;
      font-size: 18px;
    }
    .dept-card p {
      margin: 0 0 16px 0;
      font-size: 13px;
      color: #666;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .doctors-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 16px;
    }
  `]
})
export class HomeComponent implements OnInit {
  topDepartments: Department[] = [];
  doctors: Doctor[] = [];
  featuredDoctors: Doctor[] = [];
  selectedDepartment?: Department;

  constructor(
    private departmentService: DepartmentService,
    private doctorService: DoctorService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadDepartments();
    this.loadFeaturedDoctors();
  }

  loadDepartments() {
    this.departmentService.getTopLevelDepartments().subscribe(depts => {
      this.topDepartments = depts;
    });
  }

  loadFeaturedDoctors() {
    this.doctorService.getAllDoctors().subscribe(doctors => {
      this.featuredDoctors = doctors.slice(0, 6);
    });
  }

  selectDepartment(dept: Department) {
    this.selectedDepartment = dept;
    this.doctorService.getAllDoctors(dept.id).subscribe(doctors => {
      this.doctors = doctors;
    });
  }

  goToBooking(doctor: Doctor) {
    this.router.navigate(['/patient/appointments/new'], {
      queryParams: { doctorId: doctor.id }
    });
  }
}
