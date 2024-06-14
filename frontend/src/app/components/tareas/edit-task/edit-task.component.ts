import {
  Component,
  ViewChild,
  TemplateRef,
  ChangeDetectorRef,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Task } from '../../../models/task.model';
import { TaskService } from '../../../_services/task.service';
import { EventService } from '../../../_services/event.service';
import { StorageService } from '../../../_services/storage.service';
import { ToastMessageService } from '../../../_services/toast-message.service';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';

import { AbstractControl } from '@angular/forms';
import { BsModalRef, BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { Category } from '../../../models/category.model';
import { CategoryService } from '../../../_services/category.service';

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrl: './edit-task.component.scss',
})
export class EditTaskComponent {
  // variables para los modales
  @ViewChild('templateAddCategory') templateAddCategoryRef:
    | TemplateRef<any>
    | undefined; // Reference the template
  modalRefMap = new Map<TemplateRef<any>, BsModalRef>(); // A map to store modal references
  modalRef!: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
  };

  task: Task = {} as Task;

  estado: boolean = false;

  habilitarFechaHora = true; // Initial state for checkbox (optional)
  form: FormGroup = new FormGroup({
    categoria_id: new FormControl(''),
    titulo: new FormControl(''),
    descripcion: new FormControl(''),
    comentarios: new FormControl(''),
    fecha_limite: new FormControl(''),
    hora_limite: new FormControl(''),
    recordatorios: new FormControl(''),
    categoria: new FormControl(''),
    importancia: new FormControl(''),
    urgencia: new FormControl(''),
    estado: new FormControl(''),
  });

  AgregarCategoriaForm: FormGroup = new FormGroup({
    AgregarCategoria: new FormControl(''),
  });

  currentUser: any;
  isLoggedIn = false;

  submitted = false;
  submittedCategory = false;

  isSuccessful = false;
  errorMessage = '';

  UserCategorias: Category[] = [];
  TaskCategory: Category = {} as Category;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private taskService: TaskService,
    private eventService: EventService,
    private storageService: StorageService,
    private toastMessageService: ToastMessageService,
    private formBuilder: FormBuilder,
    private categoryService: CategoryService,
    private modalService: BsModalService
  ) {}
  selectedOption: string | null = null;

  onOptionChange(option: string) {
    this.selectedOption = option;
  }

  ngOnInit() {
    const selectedTaskId = this.route.snapshot.queryParams['selectedTaskId'];
    // console.log('Tarea ID: ' + selectedTaskId);

    this.isLoggedIn = this.storageService.isLoggedIn();
    if (!this.isLoggedIn) {
      this.storageService.clean();
      window.location.replace('/home');
    }
    if (this.isLoggedIn) {
      this.currentUser = this.storageService.getUser();
      // console.log(this.task);

      // // Update the service call to retrieve a single note
      // this.notesService;

      this.taskService.getOneTask(selectedTaskId as number).subscribe({
        next: (task: Task) => {
          this.task = task;
          if (task.status == true) {
            this.estado = true;
          } else if (task.status == false) {
            this.estado = false;
          }
          this.form = this.formBuilder.group({
            categoria_id: [''],
            titulo: [
              this.task.title,
              [Validators.required, Validators.minLength(4)],
            ],
            descripcion: [
              this.task.description,
              [Validators.required, Validators.minLength(4)],
            ],
            comentarios: [this.task.comments],
            fecha_limite: [this.task.deadline],
            hora_limite: [null],
            recordatorios: [''],
            categoria: [''],
            importancia: [this.task.importance],
            urgencia: [this.task.urgency],
            estado: [],
          });

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

                this.form.patchValue({
                  categoria_id: this.task.categoryId,
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
  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  onSubmit(): void {
    this.submitted = true; // Mark form as submitted for error handling

    if (this.form.valid) {
      // console.log('Antes:', this.task);

      this.task.categoryId = parseInt(this.form.value.categoria_id);
      this.task.title = this.form.value.titulo;
      this.task.description = this.form.value.descripcion;
      this.task.comments = this.form.value.comentarios;
      this.task.deadline = this.form.value.fecha_limite;
      this.task.deadline = this.form.value.hora_limite;
      this.task.importance = this.form.value.importancia;
      this.task.urgency = this.form.value.urgencia;
      this.task.status = false;
      // console.log('importancia', this.form.value.importancia);
      // console.log('urgencia', this.form.value.urgencia);

      // this.task.categoria_id = this.form.value.categoria;

      // console.log('Despues:', this.task);

      this.taskService.updateTask(this.task).subscribe({
        next: (tarea) => {
          this.isSuccessful = true;

          this.CrearEvento(tarea);

          // 'Success' | 'Error' | 'Info' | 'Warning'
          this.showToaster('¡Tarea actualizada exitosamente!', 'Success'); // Set toast message

          this.router.navigate(['tasks/eisenhower']);
        },
        error: (err) => {
          this.errorMessage = err.error.message;
          this.isSuccessful = false;
          this.showToaster('¡Error al actualizar la Tarea!', 'Error');
        },
      });
    }
  }
  CrearEvento(tarea: Task) {
    const idTarea = tarea.idTask;
    const tituloTarea = tarea.title;
    const descripcionTarea = tarea.description;
    const descripcion =
      'Se edito la tarea: ' +
      tituloTarea +
      '\nCon la Descripcion: ' +
      descripcionTarea;

    const nowInMilliseconds = Date.now();
    // Format the date string in ISO 8601 format
    const createdAt = new Date(nowInMilliseconds).toISOString();

    this.eventService.createEvents(idTarea, createdAt, descripcion).subscribe({
      next: () => {
        this.isSuccessful = true;
        // 'Success' | 'Error' | 'Info' | 'Warning'
        // this.showToaster('¡Evento creado exitosamente!', 'Success'); // Set toast message
      },
      error: (err) => {
        this.errorMessage = err.error.message;
        this.isSuccessful = false;
        // this.showToaster('¡Error al crear el evento!', 'Error');
      },
    });
  }

  Cancelar() {
    this.showToaster('!No se actulizo la Tarea!', 'Info');
    this.router.navigate(['tasks/eisenhower']);
  }
  showToaster(mensaje: string, tipo: string) {
    this.toastMessageService.showtoast(mensaje, tipo);
  }
  openModal(template: TemplateRef<any>) {
    const modalRef = this.modalService.show(template, this.config);
    this.modalRef = modalRef;
    this.modalRefMap.set(template, modalRef); // Store the modal reference
  }
  closeModal(template: TemplateRef<any>) {
    const modalRef = this.modalRefMap.get(template);
    if (modalRef) {
      modalRef.hide(); // Close the modal using the reference
      this.modalRefMap.delete(template); // Remove the reference from the map
    }
  }

  CancelarModal() {
    // 'Success' | 'Error' | 'Info' | 'Warning'
    this.showToaster('¡Acción Cancelada!', 'Info'); // Set toast message
  }

  BotonAgregarRecordatorio() {
    this.showToaster('!Agregar Recordatorio!', 'Info');
  }
  BotonEliminarRecordatorio() {
    this.showToaster('¡Eliminar Recordatorio!', 'Info'); // Set toast message
  }
  BotonAgregarCategoria() {
    this.showToaster('!Agregar Categoria!', 'Info');
    if (this.templateAddCategoryRef) {
      this.openModal(this.templateAddCategoryRef);
    }
  }
  BotonEliminarCategoria() {
    this.showToaster('¡Eliminar Categoria!', 'Info'); // Set toast message
  }
  AgregarCategoria() {
    this.submittedCategory = true;
    // console.log(this.submittedCategory);

    if (this.AgregarCategoriaForm.valid) {
      if (this.templateAddCategoryRef) {
        this.closeModal(this.templateAddCategoryRef);
      }
      this.showToaster('!Se agrego una nueva categoria!', 'Success');

      console.log(this.AgregarCategoriaForm.value);
      let nombre = this.AgregarCategoriaForm.value.AgregarCategoria;

      console.log(nombre);

      this.categoryService
        .postCategory(this.currentUser.idUser, nombre, true)
        .subscribe({
          next: (newcategoria) => {
            this.UserCategorias.push(newcategoria);
            // console.log(newcategoria);
          },
          error: (error) => {
            console.error('Error creando la categoria:', error);
            // Handle errors
          },
        });
    }
  }
}
