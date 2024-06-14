import {
  Component,
  ViewChild,
  TemplateRef,
  ChangeDetectorRef,
} from '@angular/core';
import { BsModalRef, BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { StorageService } from '../../../_services/storage.service';
import { Router } from '@angular/router';
import { ToastMessageService } from '../../../_services/toast-message.service';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { Task } from '../../../models/task.model';
import { Category } from '../../../models/category.model';
import { TaskService } from '../../../_services/task.service';
import { EventService } from '../../../_services/event.service';
import { CategoryService } from '../../../_services/category.service';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss',
})
export class AddTaskComponent {
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

  form: FormGroup = new FormGroup({
    categoria_id: new FormControl(''),
    titulo: new FormControl(''),
    descripcion: new FormControl(''),
    comentarios: new FormControl(''),
    fecha_limite: new FormControl(''),
    hora_limite: new FormControl(''),
    importancia: new FormControl(''),
    urgencia: new FormControl(''),
  });

  AgregarCategoriaForm: FormGroup = new FormGroup({
    AgregarCategoria: new FormControl(''),
  });

  submitted = false;
  submittedCategory = false;

  isSuccessful = false;
  errorMessage = '';
  isLoggedIn = false;
  persona_id?: number;

  deadline: Date | null = {} as Date;

  tarea_eventos: Task = {} as Task;

  currentUser: any;

  constructor(
    private storageService: StorageService,
    private taskService: TaskService,
    private eventService: EventService,
    private router: Router,
    private toastMessageService: ToastMessageService,
    private categoryService: CategoryService,
    private formBuilder: FormBuilder,
    private modalService: BsModalService,
    private changeDetector: ChangeDetectorRef
  ) {}

  UserCategorias: Category[] = [];

  selectedOption: string | null = null;

  onOptionChange(option: string) {
    this.selectedOption = option;
  }
  ngOnInit(): void {
    this.isLoggedIn = this.storageService.isLoggedIn();
    if (!this.isLoggedIn) {
      this.storageService.clean();
      window.location.replace('/home');
    }
    if (this.isLoggedIn) {
      const user = this.storageService.getUser();
      this.currentUser = user;
      // console.log(this.authorId);

      this.form = this.formBuilder.group({
        categoria_id: [''],
        titulo: ['', [Validators.required, Validators.minLength(4)]],
        descripcion: ['', [Validators.required, Validators.minLength(4)]],
        comentarios: [''],
        fecha_limite: [null],
        hora_limite: [null],
        importancia: [false],
        urgencia: [false],
      });

      this.AgregarCategoriaForm = this.formBuilder.group({
        AgregarCategoria: ['', [Validators.required]],
      });

      this.categoryService.getCategories(user.idUser).subscribe({
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
    }
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  onSubmit(): void {
    this.submitted = true; // Mark form as submitted for error handling

    if (this.form.valid) {
      // const tarea: Task = this.form.value;
      // console.log(tarea);

      const {
        categoria_id,
        titulo,
        descripcion,
        comentarios,
        fecha_limite,
        hora_limite,
        importancia,
        urgencia,
      } = this.form.value;
      console.log(this.form.value);

      const estado: boolean = false;

      // console.log(fecha_limite);
      // console.log(hora_limite);
      if (fecha_limite != null && hora_limite != null) {
        this.deadline = this.juntarDates(fecha_limite, hora_limite);
      } else {
        this.deadline = null;
      }

      // console.log(this.deadline);
      const pomodoroEstimacion = 0;
      this.taskService
        .createTask(
          this.currentUser.idUser,
          parseInt(categoria_id),
          titulo,
          descripcion,
          comentarios,
          this.deadline,
          importancia,
          urgencia,
          estado,
          pomodoroEstimacion
        )
        .subscribe({
          next: (tarea) => {
            this.isSuccessful = true;
            console.log(tarea);

            this.CrearEvento(tarea);
            // 'Success' | 'Error' | 'Info' | 'Warning'
            this.showToaster('¡Tarea creada exitosamente!', 'Success'); // Set toast message

            this.router.navigate(['tasks/eisenhower']);
          },
          error: (err) => {
            this.errorMessage = err.error.message;
            this.isSuccessful = false;
            this.showToaster('¡Error al crear la Tarea!', 'Error');
          },
        });
    }
  }
  juntarDates(fechaLimite: Date, horaLimite: Date): Date {
    // Create a new Date object from fechaLimite (copy to avoid modifying original)
    const combinedDate = new Date(fechaLimite.getTime());

    // Set the hour, minute, second, milliseconds (optional) from horaLimite
    combinedDate.setHours(
      horaLimite.getHours(),
      horaLimite.getMinutes(),
      horaLimite.getSeconds(),
      horaLimite.getMilliseconds()
    );

    // Return the combined date object
    return combinedDate;
  }
  CrearEvento(tarea: Task) {
    const idTarea = tarea.idTask;
    const tituloTarea = tarea.title;
    const descripcionTarea = tarea.description;
    const descripcion =
      'Se creo la tarea: ' +
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
    this.showToaster('!No se creo la Tarea!', 'Info');
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

  BotonAgregarCategoria() {
    this.showToaster('!Agregar Categoria!', 'Info');
    if (this.templateAddCategoryRef) {
      this.openModal(this.templateAddCategoryRef);
    }
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
