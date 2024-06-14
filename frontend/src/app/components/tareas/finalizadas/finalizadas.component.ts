import { Component, ChangeDetectorRef } from '@angular/core';
import { Task } from '../../../models/task.model';
import { Router } from '@angular/router';
import { StorageService } from '../../../_services/storage.service';
import { ToastMessageService } from '../../../_services/toast-message.service';
import { TaskService } from '../../../_services/task.service';
import { EventService } from '../../../_services/event.service';

@Component({
  selector: 'app-finalizadas',
  templateUrl: './finalizadas.component.html',
  styleUrl: './finalizadas.component.scss',
})
export class FinalizadasComponent {
  task: Task = {} as Task;
  selectedTask: Task | null = null;

  tareas: Task[] = [];

  tareasFinalizadas: Task[] = [];
  FiltertareasFinalizadas: Task[] = [];

  currentUser: any;
  isLoggedIn = false;
  showButtons: boolean = false;

  constructor(
    private router: Router,
    private taskService: TaskService,
    private eventService: EventService,
    private storageService: StorageService,
    private toastMessageService: ToastMessageService,
    private changeDetector: ChangeDetectorRef
  ) {}
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
          this.tareas = data;
          // console.log(this.tareas);

          this.tareasFinalizadas = this.filterTareasFinalizadas();
          this.FiltertareasFinalizadas = this.tareasFinalizadas; //Filtrar tareas finalizadas
          // console.log(this.FiltertareasFinalizadas);
        });
    }
  }

  filterTareasFinalizadas(): Task[] {
    return this.tareas.filter((tarea) => tarea.status == true);
  }
  async onTaskClick(task: Task) {
    this.selectedTask = task;
    this.showButtons = true;
    // console.log('Tarea seleccionada', task);

    setTimeout(() => {
      this.onTaskDeselect();
    }, 30000); // Deseleccionar después de 10 segundos
  }

  async onTaskDeselect() {
    this.selectedTask = null;
    this.showButtons = false;
  }
  Cancelar() {
    this.router.navigate(['tasks/eisenhower']);
  }
  onCambiarEstadoClick() {
    console.log('Hola');
  }
  showToaster(mensaje: string, tipo: string) {
    this.toastMessageService.showtoast(mensaje, tipo);
  }
  onSearchChange(event: Event) {
    const inputElement = event.target as HTMLInputElement; // Cast to HTMLInputElement
    const searchText = inputElement.value.toLowerCase(); // Access the value property

    this.FiltertareasFinalizadas = this.tareasFinalizadas.filter((task) => {
      const lowerTitle = task.title.toLowerCase(); // Convert title to lowercase

      // Case-insensitive matching using includes
      return lowerTitle.includes(searchText);
    });
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
      '\nCambio su estado a tarea no completada.';

    const nowInMilliseconds = Date.now();
    // Format the date string in ISO 8601 format
    const createdAt = new Date(nowInMilliseconds).toISOString();
    this.eventService.createEvents(idTarea, createdAt, descripcion).subscribe();
  }
  Finalizar() {
    if (this.selectedTask) {
      // console.log('Tarea seleccionada', this.selectedTask);
      const nuevatarea = this.selectedTask;
      nuevatarea.status = false;

      // Llamada al servicio para actualizar la tarea
      this.taskService.updateTask(nuevatarea).subscribe({
        next: () => {
          this.CrearEventoFinalizarTarea(nuevatarea);
          this.showToaster('¡Estado cambiado exitosamente!', 'Success');
          // Actualizar las listas filtradas
          this.actualizarListasFiltradas();
          this.router.navigate(['finalizadas']);
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
        checkboxElement.checked = true;
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
    this.tareasFinalizadas = this.filterTareasFinalizadas(); //Filtrar tareas finalizadas

    this.FiltertareasFinalizadas = this.tareasFinalizadas;
    this.changeDetector.detectChanges();
  }
}
