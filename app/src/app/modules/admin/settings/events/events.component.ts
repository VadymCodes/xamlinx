import { Component, OnInit } from '@angular/core';

import { SettingService } from '@/services';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
})
export class EventsComponent implements OnInit {
  events: any[] = [];
  page = 1;
  pageSize = 5;
  collectionSize = 0;
  loading = false; // Whether loading data for the first time

  constructor(private settingService: SettingService) {}

  ngOnInit(): void {
    this.loading = true;
    this.settingService.getEvents().subscribe({
      next: (events) => {
        this.events = events;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }
}
