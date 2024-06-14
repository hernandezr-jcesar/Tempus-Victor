import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Task } from '../../../models/task.model';
import { TaskService } from '../../../_services/task.service';
import { StorageService } from '../../../_services/storage.service';
import { ToastMessageService } from '../../../_services/toast-message.service';
import { CategoryService } from '../../../_services/category.service';
import { Category } from '../../../models/category.model';

@Component({
  selector: 'app-del-task',
  templateUrl: './del-task.component.html',
  styleUrl: './del-task.component.scss',
})
export class DelTaskComponent {
  importancia: any;
  urgencia: any;
  task: Task = {} as Task;

  currentUser: any;
  isLoggedIn = false;

  submitted = false;
  isSuccessful = false;
  errorMessage = '';

  UserCategorias: Category[] = [];
  TaskCategory: Category = {} as Category;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private taskService: TaskService,
    private storageService: StorageService,
    private toastMessageService: ToastMessageService,
    private categoryService: CategoryService
  ) {}
  ngOnInit() {
    const selectedTaskId = this.route.snapshot.queryParams['selectedTaskId'];
    // console.log('Note ID: ' + selectedTaskId);

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
          // console.log(this.task);
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
  onSubmit(): void {
    this.submitted = true; // Mark form as submitted for error handling
    // console.log(this.note.id_nota);
    // console.log(this.task.id_tarea);

    this.taskService.deleteTask(this.task.idTask).subscribe({
      next: () => {
        this.showToaster('Tarea Eliminada Correctamente', 'Success');
        this.isSuccessful = true;
        this.router.navigate(['tasks/eisenhower']);
      },
      error: (err) => {
        this.errorMessage = err.error.message;
        this.isSuccessful = false;
      },
    });
  }
  Cancelar() {
    this.showToaster('¡No se elimino la tarea!', 'Info');
    this.router.navigate(['tasks/eisenhower']);
  }
  showToaster(mensaje: string, tipo: string) {
    this.toastMessageService.showtoast(mensaje, tipo);
  }
}
