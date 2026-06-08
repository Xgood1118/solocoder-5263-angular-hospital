import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { TimeSlot } from '../../services/appointment.service';

@Component({
  selector: 'app-time-slot-picker',
  template: `
    <div class="time-slot-picker">
      <div class="time-slot-group" *ngIf="morningSlots.length > 0">
        <h4 class="group-title">
          <span class="icon">🌅</span>
          上午
        </h4>
        <div class="slots-grid">
          <button
            *ngFor="let slot of morningSlots"
            class="slot-btn"
            [class.selected]="selectedSlotId === slot.id"
            [class.disabled]="slot.remainingSlots <= 0 || slot.cancelled"
            [disabled]="slot.remainingSlots <= 0 || slot.cancelled"
            (click)="selectSlot(slot)"
          >
            <span class="time">{{ formatTime(slot.startTime) }}</span>
            <span class="remaining" [class.few]="slot.remainingSlots <= 5">
              剩余 {{ slot.remainingSlots }} 号
            </span>
          </button>
        </div>
      </div>

      <div class="time-slot-group" *ngIf="afternoonSlots.length > 0">
        <h4 class="group-title">
          <span class="icon">🌆</span>
          下午
        </h4>
        <div class="slots-grid">
          <button
            *ngFor="let slot of afternoonSlots"
            class="slot-btn"
            [class.selected]="selectedSlotId === slot.id"
            [class.disabled]="slot.remainingSlots <= 0 || slot.cancelled"
            [disabled]="slot.remainingSlots <= 0 || slot.cancelled"
            (click)="selectSlot(slot)"
          >
            <span class="time">{{ formatTime(slot.startTime) }}</span>
            <span class="remaining" [class.few]="slot.remainingSlots <= 5">
              剩余 {{ slot.remainingSlots }} 号
            </span>
          </button>
        </div>
      </div>

      <div class="empty-state" *ngIf="timeSlots.length === 0">
        <p>暂无可用号源</p>
      </div>
    </div>
  `,
  styles: [`
    .time-slot-picker {
      padding: 16px 0;
    }
    .time-slot-group {
      margin-bottom: 24px;
    }
    .group-title {
      margin: 0 0 12px 0;
      font-size: 15px;
      font-weight: 500;
      color: #333;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .group-title .icon {
      font-size: 18px;
    }
    .slots-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
    }
    .slot-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      padding: 12px 8px;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      background: white;
      cursor: pointer;
      transition: all 0.2s;
    }
    .slot-btn:hover:not(:disabled) {
      border-color: #3f51b5;
      background: #f5f7ff;
    }
    .slot-btn.selected {
      border-color: #3f51b5;
      background: #3f51b5;
      color: white;
    }
    .slot-btn.selected .remaining {
      color: rgba(255, 255, 255, 0.8);
    }
    .slot-btn.selected .remaining.few {
      color: #ffeb3b;
    }
    .slot-btn:disabled {
      cursor: not-allowed;
      opacity: 0.5;
      background: #f5f5f5;
    }
    .time {
      font-size: 16px;
      font-weight: 500;
    }
    .remaining {
      font-size: 12px;
      color: #666;
    }
    .remaining.few {
      color: #f44336;
    }
    .empty-state {
      text-align: center;
      padding: 40px 0;
      color: #999;
    }
  `]
})
export class TimeSlotPickerComponent implements OnChanges {
  @Input() timeSlots: TimeSlot[] = [];
  @Input() selectedSlotId?: number;
  @Output() selectedSlotChange = new EventEmitter<TimeSlot>();

  morningSlots: TimeSlot[] = [];
  afternoonSlots: TimeSlot[] = [];

  ngOnChanges(changes: SimpleChanges) {
    if (changes['timeSlots']) {
      this.morningSlots = this.timeSlots.filter(s => s.timeSlotType === 'MORNING');
      this.afternoonSlots = this.timeSlots.filter(s => s.timeSlotType === 'AFTERNOON');
    }
  }

  formatTime(time: string): string {
    if (!time) return '';
    return time.substring(0, 5);
  }

  selectSlot(slot: TimeSlot) {
    if (slot.remainingSlots <= 0 || slot.cancelled) return;
    this.selectedSlotId = slot.id;
    this.selectedSlotChange.emit(slot);
  }
}
