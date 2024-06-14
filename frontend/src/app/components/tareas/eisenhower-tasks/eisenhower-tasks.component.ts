import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';
import { Task } from '../../../models/task.model';
import { Router } from '@angular/router';
import { StorageService } from '../../../_services/storage.service';
import { ToastMessageService } from '../../../_services/toast-message.service';
import { TaskService } from '../../../_services/task.service';
import { EventService } from '../../../_services/event.service';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag,
  CdkDropList,
} from '@angular/cdk/drag-drop';
import { CategoryService } from '../../../_services/category.service';
import { Category } from '../../../models/category.model';

@Component({
  selector: 'app-eisenhower-tasks',
  templateUrl: './eisenhower-tasks.component.html',
  styleUrl: './eisenhower-tasks.component.scss',
})
export class EisenhowerTasksComponent {
  alltasks: Task[] = [];
  tasks: Task[] = [];
  searchText: string = '';

  hacer: Task[] = [];
  planear: Task[] = [];
  delegar: Task[] = [];
  eliminar: Task[] = [];

  filterhacer: Task[] = [];
  filterplanear: Task[] = [];
  filterdelegar: Task[] = [];
  filtereliminar: Task[] = [];

  toSendTask: Task = {} as Task;
  selectedTask: Task | null = null;

  showButtons: boolean = false;
  currentUser: any;
  isLoggedIn = false;
  isSingleSelected = false;

  UserCategorias: Category[] = [];
  SelectedCategoryId: any;

  constructor(
    private router: Router,
    private taskService: TaskService,
    private eventService: EventService,
    private storageService: StorageService,
    private toastMessageService: ToastMessageService,
    private changeDetector: ChangeDetectorRef,
    private categoryService: CategoryService
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
          this.alltasks = data;

          this.tasks = this.filterTareasNoFinalizadas(); //Filtrar tareas no finalizadas

          this.hacer = this.filterHacer();
          this.planear = this.filterPlanear();
          this.delegar = this.filterDelegar();
          this.eliminar = this.filterEliminar();

          this.filterhacer = this.hacer;
          this.filterplanear = this.planear;
          this.filterdelegar = this.delegar;
          this.filtereliminar = this.eliminar;

          this.selectedTask = null;
          this.showButtons = false;

          this.categoryService
            .getCategories(this.currentUser.idUser)
            .subscribe({
              next: (categorias) => {
                for (const category of categorias) {
                  this.UserCategorias.push(category);
                }
              },
              error: (error) => {
                console.error('Error obteniendo la tarea:', error);
                // Handle errors
              },
            });

          this.changeDetector.detectChanges();

          // console.log('Notas:');
          // console.log(this.notes);
        });
    }
  }

  filterTareasNoFinalizadas(): Task[] {
    return this.alltasks.filter((task) => task.status == false);
  }

  filterHacer(): Task[] {
    return this.tasks.filter(
      (task) => task.importance === true && task.urgency === true
    );
  }
  filterPlanear(): Task[] {
    return this.tasks.filter(
      (task) => task.importance === true && task.urgency === false
    );
  }
  filterDelegar(): Task[] {
    return this.tasks.filter(
      (task) => task.importance === false && task.urgency === true
    );
  }
  filterEliminar(): Task[] {
    return this.tasks.filter(
      (task) => task.importance === false && task.urgency === false
    );
  }

  async onTaskClick(task: Task) {
    this.selectedTask = task;
    this.toSendTask = task;
    this.showButtons = true;
    // console.log('Tarea seleccionada', task);

    setTimeout(() => {
      this.onTaskDeselect();
    }, 20000); // Deseleccionar después de 10 segundos
  }

  async onTaskDeselect() {
    this.selectedTask = null;
    this.showButtons = false;
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
    if (this.toSendTask.pomodoroEstimacion == 0) {
      // console.log(this.toSendTask.pomodoroEstimacion);

      this.router.navigate(['estimacion-pomodoros'], {
        queryParams: { selectedTaskId: this.toSendTask?.idTask },
      });
    } else {
      // console.log(this.toSendTask.pomodoroEstimacion);
      this.router.navigate(['pomodoro'], {
        queryParams: { selectedTaskId: this.toSendTask?.idTask },
      });
    }
  }
  Ir_A_Historial() {
    this.router.navigate(['events'], {
      queryParams: { selectedTaskId: this.toSendTask?.idTask },
    });
  }

  onCalendarioClick() {
    this.router.navigate(['tasks/calendar']);
  }
  showToaster(mensaje: string, tipo: string) {
    this.toastMessageService.showtoast(mensaje, tipo);
  }

  onSearchChange(event: Event) {
    const inputElement = event.target as HTMLInputElement; // Cast to HTMLInputElement
    const searchText = inputElement.value.toLowerCase(); // Access the value property

    this.filterhacer = this.hacer.filter((task) => {
      const lowerTitle = task.title.toLowerCase(); // Convert title to lowercase

      // Case-insensitive matching using includes
      return lowerTitle.includes(searchText);
    });

    this.filterplanear = this.planear.filter((task) => {
      const lowerTitle = task.title.toLowerCase(); // Convert title to lowercase

      // Case-insensitive matching using includes
      return lowerTitle.includes(searchText);
    });

    this.filterdelegar = this.delegar.filter((task) => {
      const lowerTitle = task.title.toLowerCase(); // Convert title to lowercase

      // Case-insensitive matching using includes
      return lowerTitle.includes(searchText);
    });

    this.filtereliminar = this.eliminar.filter((task) => {
      const lowerTitle = task.title.toLowerCase(); // Convert title to lowercase

      // Case-insensitive matching using includes
      return lowerTitle.includes(searchText);
    });
    // console.log(this.filteredNotes);
  }

  drop(event: CdkDragDrop<Task[]>) {
    // console.log(event);

    if (event.previousContainer === event.container) {
      const previousListIndex = event.previousIndex;
      const currentListIndex = event.currentIndex;

      const Tarea = event.container.data.at(currentListIndex);


      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      const previousListIndex = event.previousIndex;
      const currentListIndex = event.currentIndex;

      const Tarea = event.previousContainer.data.at(previousListIndex);

      switch (event.container.id) {
        case 'hacer-list':
          // console.log('Se cambio a la lista de Hacer');
          if (Tarea) {
            this.CrearEvento(Tarea, 'Hacer');
            this.change_importancia_urgencia(Tarea, true, true);
          } else {
            console.log('Tarea is undefined');
          }

          break;
        case 'delegar-list':
          // console.log('Se cambio a la lista de delegar');
          if (Tarea) {
            this.CrearEvento(Tarea, 'Delegar');
            this.change_importancia_urgencia(Tarea, false, true);
          } else {
            console.log('Tarea is undefined');
          }
          break;
        case 'planear-list':
          // console.log('Se cambio a la lista de planear');
          if (Tarea) {
            this.CrearEvento(Tarea, 'Planear');
            this.change_importancia_urgencia(Tarea, true, false);
          } else {
            console.log('Tarea is undefined');
          }
          break;
        case 'eliminar-list':
          // console.log('Se cambio a la lista de eliminar');
          if (Tarea) {
            this.CrearEvento(Tarea, 'Eliminar');
            this.change_importancia_urgencia(Tarea, false, false);
          } else {
            console.log('Tarea is undefined');
          }
          break;
        // ... more cases
        default:
        // Code to execute if no case matches
      }
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }
  change_importancia_urgencia(
    task: Task,
    nuevaimportancia: boolean,
    nuevaurgencia: boolean
  ) {
    task.importance = nuevaimportancia;
    task.urgency = nuevaurgencia;

    this.taskService.updateTask(task).subscribe({
      next: () => {
        this.showToaster('¡Se actualizo la tarea correctamente!', 'Success'); //
      },
      error: (err) => {
        this.showToaster('¡Error al actualizar la Tarea!', 'Error');
      },
    });
  }
  CrearEvento(tarea: Task, cuadrante: string) {
    const idTask = tarea.idTask;
    const tituloTarea = tarea.title;
    const descripcionTarea = tarea.description;
    const description =
      'La tarea: ' +
      tituloTarea +
      '\nCambio su importancia y urgencia al cuadrante: ' +
      cuadrante;

    const nowInMilliseconds = Date.now();
    // Format the date string in ISO 8601 format
    const createdAt = new Date(nowInMilliseconds).toISOString();

    this.eventService.createEvents(idTask, createdAt, description).subscribe();
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
          this.showToaster('¡Tarea Completada exitosamente!', 'Success');
          // Actualizar las listas filtradas
          this.actualizarListasFiltradas();
          this.router.navigate(['tasks/eisenhower']);
        },
        error: (err) => {
          this.showToaster('¡Error al Completar la Tarea!', 'Error');
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
    // Filtrar nuevamente las tareas no finalizadas
    this.tasks = this.alltasks.filter((task) => task.status == false);

    // Volver a filtrar por importancia y urgencia en cada lista
    this.hacer = this.filterHacer();
    this.planear = this.filterPlanear();
    this.delegar = this.filterDelegar();
    this.eliminar = this.filterEliminar();

    // Actualizar las listas filtradas con los nuevos valores
    this.filterhacer = this.hacer;
    this.filterplanear = this.planear;
    this.filterdelegar = this.delegar;
    this.filtereliminar = this.eliminar;

    // Opcional: puedes utilizar el detector de cambios para notificar a Angular
    // de las modificaciones en las listas filtradas
    this.changeDetector.detectChanges();
  }
  range(n: number): Array<number> {
    return Array(n)
      .fill(0)
      .map((x, i) => i);
  }
  onCategoriaChange(event: Event) {
    const inputElement = event.target as HTMLSelectElement; // Cast to HTMLSelectElement
    this.SelectedCategoryId = Number(inputElement.value); // Get the selected value and convert to number
    this.FiltrarTareasCategoria(); // Call the filtering method
  }
  FiltrarTareasCategoria() {
    // Filter tasks based on selectedCategoryId
    this.filterhacer = this.hacer.filter((task) => {
      if (this.SelectedCategoryId) {
        // Check if a category is selected
        return task.categoryId === this.SelectedCategoryId; // Filter by categoria_id
      } else {
        return task; // Return all tasks if no category is selected
      }
    });

    this.filterplanear = this.planear.filter((task) => {
      if (this.SelectedCategoryId) {
        // Check if a category is selected
        return task.categoryId === this.SelectedCategoryId; // Filter by categoria_id
      } else {
        return task; // Return all tasks if no category is selected
      }
    });

    this.filterdelegar = this.delegar.filter((task) => {
      if (this.SelectedCategoryId) {
        // Check if a category is selected
        return task.categoryId === this.SelectedCategoryId; // Filter by categoria_id
      } else {
        return task; // Return all tasks if no category is selected
      }
    });

    this.filtereliminar = this.eliminar.filter((task) => {
      if (this.SelectedCategoryId) {
        // Check if a category is selected
        return task.categoryId === this.SelectedCategoryId; // Filter by categoria_id
      } else {
        return task; // Return all tasks if no category is selected
      }
    });
  }
}
