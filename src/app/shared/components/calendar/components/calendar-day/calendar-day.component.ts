import { Component, Input, OnInit, Output, EventEmitter, IterableDiffers, IterableDiffer, DoCheck, ChangeDetectionStrategy, SimpleChanges, OnChanges } from '@angular/core';
import { isSameDay, isWithinInterval, startOfDay, endOfDay } from 'date-fns';
import { ICalendarDate } from '../../interfaces/calendar-date.interface';
import { ICalendarEvent } from '../../interfaces/calendar-event.interface';
import { Router } from '@angular/router';
import { CoreRoutes } from 'src/app/core/constants/routes.constants';

@Component({
  selector: 'app-calendar-day',
  templateUrl: './calendar-day.component.html',
  styleUrls: ['./calendar-day.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarDayComponent implements OnInit, DoCheck, OnChanges {
  @Input({required: true}) calendarDate: ICalendarDate = { date: new Date(), events: [] };
  @Input() outsideOfMonth: boolean = false;
  @Input() active: boolean = false;
  @Input() loading: boolean = false;

  @Output() dayClick: EventEmitter<ICalendarDate> = new EventEmitter<ICalendarDate>();

  currentDay: boolean = false;

  private iterableDifferEvents: IterableDiffer<ICalendarEvent>;

  constructor(private iterableDiffers: IterableDiffers, 
              private router: Router) {
    this.iterableDifferEvents = iterableDiffers.find(this.calendarDate.events).create();
  }

  ngOnInit() {
    this.setCurrentDate();
  }

  ngDoCheck() {
    if (this.iterableDifferEvents.diff(this.calendarDate.events)) {
      this.sortEvents();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['view']) {
      this.setCurrentDate();
    }
  }

  interact(event: MouseEvent | KeyboardEvent, day: ICalendarDate): void {
    if (event.type === 'click' || (event instanceof KeyboardEvent && (event.code === 'Enter' || event.code === 'NumpadEnter' || event.code === 'Space'))) {
      this.dayClick.emit(day);
    }
  }

  routeToEvent(eventId: string, event: MouseEvent | KeyboardEvent) {
    if (eventId && (event.type === 'click' || (event instanceof KeyboardEvent && (event.code === 'Enter' || event.code === 'NumpadEnter' || event.code === 'Space')))) 
      this.router.navigateByUrl(CoreRoutes.Events + '/' + eventId);
  }

  private sortEvents(): void {
    // Sort events by the start date
    this.calendarDate.events.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

    // Move any events that start and end today to the back of the list (so events spanning days line up)
    for (let i = this.calendarDate.events.length - 1; i >= 0; i--) {
      if (isWithinInterval(this.calendarDate.events[i].startDate, {start: startOfDay(this.calendarDate.date), end: endOfDay(this.calendarDate.date)}) && 
          isWithinInterval(this.calendarDate.events[i].endDate, {start: startOfDay(this.calendarDate.date), end: endOfDay(this.calendarDate.date)})) {
          this.calendarDate.events.push(this.calendarDate.events.splice(i, 1)[0]);
      }
    }
  }

  private setCurrentDate(): void {
    this.currentDay = isSameDay(this.calendarDate.date, new Date());
  }
}