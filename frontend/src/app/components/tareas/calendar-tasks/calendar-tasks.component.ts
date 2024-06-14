import { Task } from '../../../models/task.model';
import { Router } from '@angular/router';
import { StorageService } from '../../../_services/storage.service';
import { ToastMessageService } from '../../../_services/toast-message.service';
import { TaskService } from '../../../_services/task.service';
import { EventService } from '../../../_services/event.service';

import {
  ChangeDetectorRef,
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
} from '@angular/core';
import { isSameMonth } from 'date-fns';
import { Subject } from 'rxjs';

import {
  CalendarEvent,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from 'angular-calendar';
import { EventColor } from 'calendar-utils';

const colors: Record<string, EventColor> = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};

@Component({
  selector: 'app-calendar-tasks',
  templateUrl: './calendar-tasks.component.html',
  styleUrl: './calendar-tasks.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarTasksComponent {
  alltasks: Task[] = [];
  tasks: Task[] = [];
  toSendTask: Task = {} as Task;

  selectedTask: Task | null = null;
  TareaEvento: Task = {} as Task;

  tareas_del_dia: Task[] = [];
  otras_tareas: Task[] = [];

  filter_tareas_del_dia: Task[] = [];
  filter_otras_tareas: Task[] = [];

  showButtons: boolean = false;
  currentUser: any;
  isLoggedIn = false;
  isSingleSelected = false;

  constructor(
    private router: Router,
    private taskService: TaskService,
    private eventService: EventService,
    private storageService: StorageService,
    private toastMessageService: ToastMessageService,
    private changeDetector: ChangeDetectorRef
  ) {}

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  modalData:
    | {
        action: string;
        event: CalendarEvent;
      }
    | undefined;

  refresh = new Subject<void>();

  events: CalendarEvent[] = [];

  activeDayIsOpen: boolean = false;
  ////////////////////////////////////

  async ngOnInit() {
    this.isLoggedIn = this.storageService.isLoggedIn();
    if (!this.isLoggedIn) {
      this.storageService.clean();
      window.location.replace('/home');
    }
    if (this.isLoggedIn) {
      this.currentUser = this.storageService.getUser();

      this.taskService
        .getTasks(this.currentUser.idUser)
        .subscribe((data: Task[]) => {
          this.alltasks = data;

          this.tasks = this.filterTareasNoFinalizadas();

          this.convertir_tareas_eventos(this.tasks);
          this.otras_tareas = this.filter_otras_tareas_();

          this.filter_tareas_del_dia = this.tareas_del_dia;
          this.filter_otras_tareas = this.otras_tareas;

          this.selectedTask = null;
          this.showButtons = false;

          this.changeDetector.detectChanges();
        });
    }
  }
  filterTareasNoFinalizadas(): Task[] {
    return this.alltasks.filter((task) => task.status == false);
  }

  showToaster(mensaje: string, tipo: string) {
    this.toastMessageService.showtoast(mensaje, tipo);
  }
  filter_tareas_dia_(): Task[] {
    return this.tasks.filter(
      (task) => task.importance === false && task.urgency === false
    );
  }
  filter_otras_tareas_(): Task[] {
    return this.tasks.filter(
      (task) => task.deadline == null && task.deadline == null
    );
  }

  onTaskClick(task: Task) {
    this.selectedTask = task;
    this.toSendTask = task;
    this.showButtons = true;
    // console.log(note);
    setTimeout(() => {
      this.onTaskDeselect();
    }, 20000); // Deseleccionar después de 10 segundos
  }

  onTaskDeselect() {
    this.selectedTask = null;
    this.showButtons = false;
  }

  onEisenhowerClick() {
    this.router.navigate(['tasks/eisenhower']);
  }
  onFinalizadasClick() {
    this.router.navigate(['finalizadas']);
  }
  onAddTaskClick() {
    this.router.navigate(['add-task']);
  }
  onSeeTaskClick() {
    this.router.navigate(['see-task'], {
      queryParams: { selectedTaskId: this.toSendTask?.idTask },
    });
  }
  onEditTaskClick() {
    this.router.navigate(['edit-task'], {
      queryParams: { selectedTaskId: this.toSendTask?.idTask },
    });
  }
  onDeleteTaskClick() {
    this.router.navigate(['del-task'], {
      queryParams: { selectedTaskId: this.toSendTask?.idTask },
    });
  }
  onPomodoroClick() {
    this.router.navigate(['estimacion-pomodoros'], {
      queryParams: { selectedTaskId: this.toSendTask?.idTask },
    });
  }
  Ir_A_Historial() {
    this.router.navigate(['events'], {
      queryParams: { selectedTaskId: this.toSendTask?.idTask },
    });
  }

  //////// ANGULAR CALENDAR /////////
  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      // if (isSameDay(this.viewDate, date) || events.length === 0) {
      //   // this.activeDayIsOpen = false;
      // } else {
      //   // this.activeDayIsOpen = true;
      // }
      this.convertir_eventos_tareas(events);
      this.viewDate = date;
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    console.log('Nuevo start', newStart);
    this.handleEvent('Dropped', event, newStart);
  }

  handleEvent(action: string, event: CalendarEvent, newStart: Date): void {
    // console.log(action, event);
    if (action == 'Dropped') {
      // this.showToaster('¡Se movio la tarea exitosamente!', 'Success');
      // console.log(event);

      this.convertir_evento_tarea(event);
      this.CambiarFecha(this.TareaEvento, newStart);

      // this.CambiarFecha()
    } else if (action == 'Clicked') {
      this.showToaster('¡Se dio click!', 'Success');
    }
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  convertir_tareas_eventos(tasks: Task[]) {
    this.events = [];
    for (let i = 0; i < tasks.length; i++) {
      const tarea = tasks[i];
      if (tarea.title) {
        if (tarea.deadline) {
          const nuevafecha = this.combinarFechas(tarea);
          if (nuevafecha) {
            this.events = this.events.concat({
              id: tarea.idTask,
              title: tarea.title,
              start: new Date(nuevafecha),
              color: colors['blue'],
              draggable: true,
            });
          }
        }
      }
      // console.log(tasks[i]);
    }
  }
  convertir_eventos_tareas(events: CalendarEvent<any>[]) {
    this.filter_tareas_del_dia = [];
    for (let i = 0; i < events.length; i++) {
      const evento = events[i];
      const identificadorTAREA = evento.id;

      if (identificadorTAREA) {
        const id = Number(identificadorTAREA);
        const tarea = this.getTaskById(this.tasks, id);
        if (tarea) {
          this.filter_tareas_del_dia.push(tarea);
        }
      }
    }
  }
  convertir_evento_tarea(evento: CalendarEvent<any>) {
    const identificadorTAREA = evento.id;
    if (identificadorTAREA) {
      const id = Number(identificadorTAREA);
      const tarea = this.getTaskById(this.tasks, id);
      if (tarea) {
        this.TareaEvento = tarea;
      }
    }
  }

  getTaskById(tasks: Task[], taskId: number): Task | undefined {
    for (const task of tasks) {
      if (task.idTask === taskId) {
        return task;
      }
    }
    return undefined;
  }

  combinarFechas(tarea: Task): Date | undefined {
    if (tarea.deadline && tarea.deadline) {
      const fecha = new Date(tarea.deadline);

      const hora = new Date(tarea.deadline);

      const fechaCombinada = new Date(
        fecha.getFullYear(),
        fecha.getMonth(),
        fecha.getDate(),
        hora.getHours(),
        hora.getMinutes(),
        hora.getSeconds()
      );
      return fechaCombinada;
    }

    // If either is missing, return undefined
    return undefined;
  }
  CambiarFecha(task: Task, nueva_fecha_limite: Date) {
    task.deadline = nueva_fecha_limite;

    this.taskService.updateTask(task).subscribe({
      next: () => {
        this.CrearEvento(task, nueva_fecha_limite);

        this.showToaster(
          '¡Se actualizo la fecha limite de la tarea correctamente!',
          'Success'
        ); //
      },
      error: (err) => {
        this.showToaster('¡Error al actualizar la Tarea!', 'Error');
      },
    });
  }
  CrearEvento(tarea: Task, nueva_fecha_limite: Date) {
    const idTarea = tarea.idTask;
    const tituloTarea = tarea.title;
    const fecha_limite = nueva_fecha_limite;
    const descripcion =
      'La tarea: ' +
      tituloTarea +
      '\nCambio su fecha_limite al: ' +
      fecha_limite;
    const nowInMilliseconds = Date.now();
    // Format the date string in ISO 8601 format
    const createdAt = new Date(nowInMilliseconds).toISOString();

    this.eventService.createEvents(idTarea, createdAt, descripcion).subscribe();
  }
  CrearEventoFinalizarTarea(tarea: Task) {
    const idTarea = tarea.idTask;
    const tituloTarea = tarea.title;
    const descripcionTarea = tarea.description;

    const descripcion =
      'La tarea: ' +
      tituloTarea +
      '\nCon la Descripcion: ' +
      descripcionTarea +
      '\nCambio su estado a tarea completada.';

    const nowInMilliseconds = Date.now();
    // Format the date string in ISO 8601 format
    const createdAt = new Date(nowInMilliseconds).toISOString();

    this.eventService.createEvents(idTarea, createdAt, descripcion).subscribe();
  }

  Finalizar() {
    if (this.selectedTask) {
      // console.log('Tarea seleccionada', this.selectedTask);
      const nuevatarea = this.selectedTask;
      nuevatarea.status = true;

      // Llamada al servicio para actualizar la tarea
      this.taskService.updateTask(nuevatarea).subscribe({
        next: () => {
          this.CrearEventoFinalizarTarea(nuevatarea);
          this.showToaster('¡Tarea Finalizada exitosamente!', 'Success');
          // Actualizar las listas filtradas
          this.actualizarListasFiltradas();
        },
        error: (err) => {
          this.showToaster('¡Error al finalizar la Tarea!', 'Error');
        },
      });
    }
  }
  CancelarModal() {
    if (this.selectedTask) {
      // Get the checkbox element using ID
      const checkboxElement = document.getElementById(
        `task-checkbox-${this.selectedTask?.idTask}`
      ) as HTMLInputElement;

      // Reset the checkbox state
      if (checkboxElement) {
        checkboxElement.checked = false;
      } else {
        console.error(
          'Checkbox element not found:',
          `task-checkbox-${this.selectedTask?.idTask}`
        );
      }

      // console.log('task-checkbox' + this.selectedTask.id_tarea);
      // console.log('se cancelo el modal');
    }
  }
  actualizarListasFiltradas() {
    this.tasks = this.filterTareasNoFinalizadas();
    this.otras_tareas = this.filter_otras_tareas_();

    this.convertir_tareas_eventos(this.tasks);

    this.filter_tareas_del_dia = this.tareas_del_dia;
    this.filter_otras_tareas = this.otras_tareas;

    this.changeDetector.detectChanges();
  }
  range(n: number): Array<number> {
    return Array(n)
      .fill(0)
      .map((x, i) => i);
  }
}
