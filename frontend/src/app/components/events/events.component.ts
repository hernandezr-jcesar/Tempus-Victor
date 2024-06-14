import { Component, OnInit } from '@angular/core';
import { Task } from '../../models/task.model';
import { Event } from '../../models/event.model';
import { PomodoroSession } from '../../models/pomodoroSession.model';
import { PomodoroEvent } from '../../models/pomodoroEvent.model';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { StorageService } from '../../_services/storage.service';

import { TaskService } from '../../_services/task.service';
import { EventService } from '../../_services/event.service';
import { PomodoroEventService } from '../../_services/pomodoro-event.service';
import { PomodoroSessionService } from '../../_services/pomodoroSession.service';
@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrl: './events.component.scss',
})
export class EventsComponent {
  task: Task = {} as Task;
  eventos: Event[] = [];
  pomodoroEvents: PomodoroEvent[] = [];

  currentUser: any;
  isLoggedIn = false;

  toSendTask: Task = {} as Task;
  selectedTask: Task | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private taskService: TaskService,
    private eventService: EventService,
    private storageService: StorageService,
    private pomodoroEventService: PomodoroEventService,
    private pomodoroSessionService: PomodoroSessionService
  ) {}
  ngOnInit() {
    const selectedTaskId = this.route.snapshot.queryParams['selectedTaskId'];
    // console.log('Note ID: ' + selectedNoteId);

    this.isLoggedIn = this.storageService.isLoggedIn();

    if (this.isLoggedIn) {
      this.currentUser = this.storageService.getUser();

      this.taskService.getOneTask(selectedTaskId as number).subscribe({
        next: (task: Task) => {
          this.task = task;
          this.toSendTask = this.task;
          this.eventService
            .getEvents(selectedTaskId as number)
            .subscribe((data: Event[]) => {
              this.eventos = data;
            });

          this.pomodoroSessionService
            .getOneSession(this.task.idTask)
            .subscribe({
              next: (session: PomodoroSession) => {
                this.pomodoroEventService
                  .getPomodoroEvents(session.idPomodoro)
                  .subscribe((data: PomodoroEvent[]) => {
                    this.pomodoroEvents = data;
                  });
              },
              error: (error) => {
                console.error('Error obteniendo la tarea:', error);
                // Handle errors
              },
            });
        },
        error: (error) => {
          console.error('Error obteniendo la tarea:', error);
          // Handle errors
        },
        complete: () => {
          // Handle completion if needed
        },
      });
    }
  }

  Cancelar() {
    this.router.navigate(['tasks/eisenhower']);
  }
}
