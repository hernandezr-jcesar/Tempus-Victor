import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Task } from '../../../models/task.model';
import { PomodoroSession } from '../../../models/pomodoroSession.model';
import { TaskService } from '../../../_services/task.service';
import { PomodoroSessionService } from '../../../_services/pomodoroSession.service';
import { StorageService } from '../../../_services/storage.service';
import { ToastMessageService } from '../../../_services/toast-message.service';
import { PomodoroEventService } from '../../../_services/pomodoro-event.service';

@Component({
  selector: 'app-estimacion-pomodoros',
  templateUrl: './estimacion-pomodoros.component.html',
  styleUrl: './estimacion-pomodoros.component.scss',
})
export class EstimacionPomodorosComponent {
  isSuccessful = false;
  errorMessage = '';

  @ViewChild('progressBar', { static: true })
  progressBarElement: ElementRef | null = null;

  pomodoros: number = 0;
  tiempotrabajo: number = 0;
  duraciontrabajo: { hours: number; minutes: number } =
    this.convertMinutesToHoursAndMinutes(0);

  descansos: number = 0;
  tiempodescanso: number = 0;
  duraciondescanso: { hours: number; minutes: number } =
    this.convertMinutesToHoursAndMinutes(0);

  tiempototal: { hours: number; minutes: number } =
    this.convertMinutesToHoursAndMinutes(0);

  importancia: any;
  urgencia: any;
  task: Task = {} as Task;

  newTask: Task = {} as Task;
  currentUser: any;
  isLoggedIn = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private taskService: TaskService,
    private pomodoroSessionService: PomodoroSessionService,
    private storageService: StorageService,
    private toastMessageService: ToastMessageService,
    private pomodoroEventService: PomodoroEventService
  ) {}
  ngOnInit() {
    this.isLoggedIn = this.storageService.isLoggedIn();
    if (!this.isLoggedIn) {
      this.storageService.clean();
      window.location.replace('/home');
    }
    if (this.isLoggedIn) {
      const selectedTaskId = this.route.snapshot.queryParams['selectedTaskId'];
      const currentSession = this.route.snapshot.queryParams['currentSession'];
      // console.log('Note ID: ' + selectedNoteId);
      this.currentUser = this.storageService.getUser();

      // // Update the service call to retrieve a single note
      // this.notesService;

      this.taskService.getOneTask(selectedTaskId as number).subscribe({
        next: (task: Task) => {
          this.task = task;
          this.importancia = this.task.importance;
          this.urgencia = this.task.urgency;
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
  EmpezarSesion() {
    if (this.pomodoros >= 1) {
      this.pomodoroSessionService
        .createSession(
          this.task.idTask,
          'SinIniciar', // Status
          0, // completedPomodoros
          null, // startTime
          null, // endTime
          this.pomodoros, // estimate
          0, // totalTimeElapsed
          0, // woekTimeElapsed
          0, // breakTimeElapsed
          0, // remaininigWorkTime
          0, // remainingBreakTime
          0, // currentWorkTime
          0, // currentBreakTime
          false,
          false
        )
        .subscribe({
          next: (sesioncreada: PomodoroSession) => {
            // 'Success' | 'Error' | 'Info' | 'Warning'
            this.showToaster('¡Sesion Creada exitosamente!', 'Success'); // Set toast message

            this.CrearPomodoroEvento(this.task, sesioncreada);
            this.CrearPomodoroEventoEstimacion(this.task, sesioncreada);
            this.task.pomodoroEstimacion = this.pomodoros;
            // console.log(this.task);
            this.taskService.updateTask(this.task).subscribe({
              next: () => {
                // this.taskService.updateTask().subscribe();

                this.router.navigate(['pomodoro'], {
                  queryParams: { selectedTaskId: this.task?.idTask },
                });
              },
              error: (err) => {
                this.showToaster('¡Error al actualizar la tarea!', 'Error');
              },
            });
          },
          error: (err) => {
            this.showToaster('¡Error al Crear la Sesion!', 'Error');
          },
        });
    } else {
      this.showToaster('¡Primero Estima los pomodoros!', 'Warning');
    }
  }

  showToaster(mensaje: string, tipo: string) {
    this.toastMessageService.showtoast(mensaje, tipo);
  }
  addPomodoro() {
    if (this.pomodoros < 4) {
      this.pomodoros++;
      this.tiempotrabajo = this.tiempotrabajo + 25;

      this.descansos++;
      if (this.descansos != 4) {
        this.tiempodescanso = this.tiempodescanso + 5;
      } else {
        this.tiempodescanso = this.tiempodescanso + 15;
      }
      this.duraciontrabajo = this.convertMinutesToHoursAndMinutes(
        this.tiempotrabajo
      );
      this.duraciondescanso = this.convertMinutesToHoursAndMinutes(
        this.tiempodescanso
      );

      this.tiempototal = this.convertMinutesToHoursAndMinutes(
        this.tiempotrabajo + this.tiempodescanso
      );
    } else {
      this.showToaster(
        '!La tarea parece ser grande. Considere dividirla en tareas más pequeñas.!',
        'Error'
      );
    }
  }
  removePomodoro() {
    if (this.pomodoros > 0) {
      this.pomodoros--;
      this.tiempotrabajo = this.tiempotrabajo - 25;
      this.duraciontrabajo = this.convertMinutesToHoursAndMinutes(
        this.tiempotrabajo
      );

      this.descansos--;
      if (this.descansos == 3) {
        this.tiempodescanso = this.tiempodescanso - 15;
      } else {
        this.tiempodescanso = this.tiempodescanso - 5;
      }
      this.duraciondescanso = this.convertMinutesToHoursAndMinutes(
        this.tiempodescanso
      );

      this.tiempototal = this.convertMinutesToHoursAndMinutes(
        this.tiempotrabajo + this.tiempodescanso
      );
    }
  }
  range(n: number): Array<number> {
    return Array(n)
      .fill(0)
      .map((x, i) => i);
  }

  convertMinutesToHoursAndMinutes(totalMinutes: number): {
    hours: number;
    minutes: number;
  } {
    // Calculate the total hours by dividing the total minutes by 60
    const hours = Math.floor(totalMinutes / 60);

    // Calculate the remaining minutes after subtracting the full hours from the total minutes
    const remainingMinutes = Math.round(totalMinutes % 60);

    // Return an object with the calculated hours and minutes
    return { hours, minutes: remainingMinutes };
  }

  CrearPomodoroEvento(tarea: Task, sesion: PomodoroSession) {
    const tituloTarea = tarea.title;
    const descripcion =
      'Se creo la sesion pomodoro con id:' +
      sesion.idPomodoro +
      '\npara la tarea: ' +
      tituloTarea;

    // Format the date string in ISO 8601 format
    const nowInMilliseconds = Date.now();
    const createdAt = new Date(nowInMilliseconds).toISOString();

    this.pomodoroEventService
      .postPomodoroEvent(sesion.idPomodoro, createdAt, descripcion)
      .subscribe();
  }
  CrearPomodoroEventoEstimacion(tarea: Task, sesion: PomodoroSession) {
    const tituloTarea = tarea.title;
    const descripcion =
      'Se estimaron ' +
      this.pomodoros +
      ' pomodoros' +
      '\npara completar la tarea: ' +
      tituloTarea;

    // Format the date string in ISO 8601 format
    const nowInMilliseconds = Date.now();
    const createdAt = new Date(nowInMilliseconds).toISOString();

    this.pomodoroEventService
      .postPomodoroEvent(sesion.idPomodoro, createdAt, descripcion)
      .subscribe();
  }
}
