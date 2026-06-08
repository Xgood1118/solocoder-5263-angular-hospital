import { Component, Output, EventEmitter, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isToday, isBefore, startOfDay } from 'date-fns';

@Component({
  selector: 'app-calendar',
  template: `
    <div class="calendar">
      <div class="calendar-header">
        <button mat-icon-button (click)="prevMonth()">
          <mat-icon>chevron_left</mat-icon>
        </button>
        <span class="month-title">{{ monthTitle }}</span>
        <button mat-icon-button (click)="nextMonth()">
          <mat-icon>chevron_right</mat-icon>
        </button>
      </div>
      <div class="calendar-weekdays">
        <span *ngFor="let day of weekdays">{{ day }}</span>
      </div>
      <div class="calendar-days">
        <button
          *ngFor="let day of days"
          class="day-btn"
          [class.other-month]="!isSameMonth(day, currentMonth)"
          [class.selected]="isSameDay(day, selectedDate)"
          [class.today]="isToday(day)"
          [class.disabled]="isDayDisabled(day)"
          [disabled]="isDayDisabled(day)"
          (click)="selectDate(day)"
        >
          {{ day.getDate() }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .calendar {
      background: white;
      border-radius: 8px;
      padding: 16px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    .calendar-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
    }
    .month-title {
      font-size: 16px;
      font-weight: 500;
    }
    .calendar-weekdays {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 4px;
      margin-bottom: 8px;
    }
    .calendar-weekdays span {
      text-align: center;
      font-size: 13px;
      color: #666;
      padding: 8px 0;
    }
    .calendar-days {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 4px;
    }
    .day-btn {
      aspect-ratio: 1;
      border: none;
      background: transparent;
      cursor: pointer;
      border-radius: 8px;
      font-size: 14px;
      transition: all 0.2s;
    }
    .day-btn:hover:not(:disabled) {
      background: #e3f2fd;
    }
    .day-btn.other-month {
      color: #ccc;
    }
    .day-btn.selected {
      background: #3f51b5;
      color: white;
    }
    .day-btn.today {
      border: 2px solid #3f51b5;
    }
    .day-btn.selected.today {
      border: 2px solid #3f51b5;
    }
    .day-btn:disabled {
      cursor: not-allowed;
      color: #ddd;
    }
  `]
})
export class CalendarComponent {
  @Input() selectedDate: Date = new Date();
  @Output() selectedDateChange = new EventEmitter<Date>();
  @Input() minDate?: Date;
  @Input() maxDate?: Date;

  currentMonth: Date = new Date();
  weekdays = ['日', '一', '二', '三', '四', '五', '六'];

  get monthTitle(): string {
    return `${this.currentMonth.getFullYear()}年${this.currentMonth.getMonth() + 1}月`;
  }

  get days(): Date[] {
    const start = startOfMonth(this.currentMonth);
    const end = endOfMonth(this.currentMonth);
    const allDays = eachDayOfInterval({ start, end });

    const firstDayOfWeek = start.getDay();
    const prevMonthDays: Date[] = [];
    for (let i = 0; i < firstDayOfWeek; i++) {
      prevMonthDays.unshift(new Date(start.getFullYear(), start.getMonth(), -i));
    }

    const remaining = 42 - (prevMonthDays.length + allDays.length);
    const nextMonthDays: Date[] = [];
    for (let i = 1; i <= remaining; i++) {
      nextMonthDays.push(new Date(end.getFullYear(), end.getMonth() + 1, i));
    }

    return [...prevMonthDays, ...allDays, ...nextMonthDays];
  }

  isSameMonth(day: Date, month: Date): boolean {
    return isSameMonth(day, month);
  }

  isSameDay(day: Date, selected: Date): boolean {
    return isSameDay(day, selected);
  }

  isToday(day: Date): boolean {
    return isToday(day);
  }

  isDayDisabled(day: Date): boolean {
    if (this.minDate && isBefore(day, startOfDay(this.minDate))) {
      return true;
    }
    if (this.maxDate && !isBefore(day, startOfDay(this.maxDate))) {
      return true;
    }
    return false;
  }

  selectDate(day: Date) {
    if (this.isDayDisabled(day)) return;
    this.selectedDate = day;
    this.selectedDateChange.emit(day);
  }

  prevMonth() {
    this.currentMonth = subMonths(this.currentMonth, 1);
  }

  nextMonth() {
    this.currentMonth = addMonths(this.currentMonth, 1);
  }
}
