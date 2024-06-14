import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Task } from '../../../models/task.model';
import { TaskService } from '../../../_services/task.service';
import { EventService } from '../../../_services/event.service';
import { StorageService } from '../../../_services/storage.service';
import { ToastMessageService } from '../../../_services/toast-message.service';
import { CategoryService } from '../../../_services/category.service';
import { Category } from '../../../models/category.model';

@Component({
  selector: 'app-see-task',
  templateUrl: './see-task.component.html',
  styleUrl: './see-task.component.scss',
})
export class SeeTaskComponent {
  importancia: any;
  urgencia: any;
  task: Task = {} as Task;

  currentUser: any;
  isLoggedIn = false;

  UserCategorias: Category[] = [];
  TaskCategory: Category = {} as Category;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private taskService: TaskService,
    private eventService: EventService,
    private storageService: StorageService,
    private toastMessageService: ToastMessageService,
    private categoryService: CategoryService
  ) {}
  ngOnInit() {
    const selectedTaskId = this.route.snapshot.queryParams['selectedTaskId'];
    // console.log('Note ID: ' + selectedNoteId);

    this.isLoggedIn = this.storageService.isLoggedIn();
    if (!this.isLoggedIn) {
      this.storageService.clean();
      window.location.replace('/home');
    }
    if (this.isLoggedIn) {
      this.currentUser = this.storageService.getUser();

      // // Update the service call to retrieve a single note
      // this.notesService;

      this.taskService.getOneTask(selectedTaskId as number).subscribe({
        next: (task: Task) => {
          this.task = task;
          this.importancia = this.task.importance;
          this.urgencia = this.task.urgency;

          this.CrearEvento(task);
          this.categoryService
            .getCategories(this.currentUser.idUser)
            .subscribe({
              next: (categorias) => {
                for (const category of categorias) {
                  this.UserCategorias.push(category);
                }
                // console.log(this.task);

                let categoria = this.UserCategorias.find(
                  (category) => category.idCategory === this.task.categoryId
                );
                if (categoria) {
                  this.TaskCategory = categoria;
                  // console.log(this.TaskCategory);
                }
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
  CrearEvento(tarea: Task) {
    const idTarea = tarea.idTask;
    const tituloTarea = tarea.title;
    const descripcionTarea = tarea.description;

    const descripcion =
      'Se visualizo la tarea: ' +
      tituloTarea +
      '\nCon la Descripcion: ' +
      descripcionTarea;

    const nowInMilliseconds = Date.now();
    // Format the date string in ISO 8601 format
    const createdAt = new Date(nowInMilliseconds).toISOString();

    this.eventService.createEvents(idTarea, createdAt, descripcion).subscribe({
      next: () => {
        // 'Success' | 'Error' | 'Info' | 'Warning'
        // this.showToaster('¡Evento creado exitosamente!', 'Success'); // Set toast message
      },
      error: () => {
        // this.showToaster('¡Error al crear el evento!', 'Error');
      },
    });
  }
  CrearEventoFinalizarTarea(tarea: Task) {
    const idTarea = tarea.idTask;
    const tituloTarea = tarea.title;
    const descripcionTarea = tarea.description;

    const descripcion =
      'Se Finalizo la tarea: ' +
      tituloTarea +
      '\nCon la Descripcion: ' +
      descripcionTarea;

    const nowInMilliseconds = Date.now();
    // Format the date string in ISO 8601 format
    const createdAt = new Date(nowInMilliseconds).toISOString();

    this.eventService.createEvents(idTarea, createdAt, descripcion).subscribe();
  }

  Cancelar() {
    this.router.navigate(['tasks/eisenhower']);
  }

  showToaster(mensaje: string, tipo: string) {
    this.toastMessageService.showtoast(mensaje, tipo);
  }
  Finalizar() {
    if (this.task) {
      // console.log('Tarea seleccionada', this.selectedTask);
      const nuevatarea = this.task;
      nuevatarea.status = true;

      // Llamada al servicio para actualizar la tarea
      this.taskService.updateTask(nuevatarea).subscribe({
        next: () => {
          this.CrearEventoFinalizarTarea(this.task);
          this.showToaster('¡Tarea Finalizada exitosamente!', 'Success');
          // Actualizar las listas filtradas
          this.router.navigate(['tasks/eisenhower']);
        },
        error: (err) => {
          this.showToaster('¡Error al finalizar la Tarea!', 'Error');
        },
      });
    }
  }
  CancelarModal() {
    if (this.task) {
      // Get the checkbox element using ID
      const checkboxElement = document.getElementById(
        `task-checkbox-${this.task?.idTask}`
      ) as HTMLInputElement;

      // Reset the checkbox state
      if (checkboxElement) {
        checkboxElement.checked = false;
      } else {
        console.error(
          'Checkbox element not found:',
          `task-checkbox-${this.task?.idTask}`
        );
      }

      // console.log('task-checkbox' + this.selectedTask.id_tarea);
      // console.log('se cancelo el modal');
    }
  }
}
