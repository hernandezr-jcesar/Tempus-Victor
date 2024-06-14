import {
  Component,
  ViewChild,
  TemplateRef,
  ChangeDetectorRef,
  OnInit,
} from '@angular/core';
import { BsModalRef, BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { StorageService } from '../../../_services/storage.service';
import { AuthService } from '../../../_services/auth.service';
import { Router } from '@angular/router';
import { ToastMessageService } from '../../../_services/toast-message.service';
import { UserService } from '../../../_services/user.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-cuenta',
  templateUrl: './cuenta.component.html',
  styleUrl: './cuenta.component.scss',
})
export class CuentaComponent implements OnInit {
  // variables para los modales

  @ViewChild('templateCerrarSesion') templateCerrarSesionRef:
    | TemplateRef<any>
    | undefined; // Reference the template
  @ViewChild('templateCambiarContra') templateCambiarContraRef:
    | TemplateRef<any>
    | undefined; // Reference the template
  @ViewChild('templateEliminarCuenta') templateEliminarCuentaRef:
    | TemplateRef<any>
    | undefined; // Reference the template
  @ViewChild('templateConfirmarEliminarCuenta')
  templateConfirmarEliminarCuentaRef: TemplateRef<any> | undefined; // Reference the template

  modalRefMap = new Map<TemplateRef<any>, BsModalRef>(); // A map to store modal references
  modalRef!: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
  };

  CambiarContraseniaForm: any = {
    password: '',
    confirmPassword: '',
  };

  submittedPassword = false;

  isLoggedIn = false;
  nombre_usuario?: string;
  correo?: string;

  base64Image: string = {} as string;

  imgSrc = '../../../../../assets/profile/Profile.png';

  currentUser: User = {} as User;
  constructor(
    private storageService: StorageService,
    private authService: AuthService,
    private router: Router,
    private toastMessageService: ToastMessageService,
    private userService: UserService,
    private modalService: BsModalService
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.storageService.isLoggedIn();
    // console.log(this.isLoggedIn);
    if (!this.isLoggedIn) {
      this.storageService.clean();
      window.location.replace('/home');
    }
    if (this.isLoggedIn) {
      const user = this.storageService.getUser();

      this.userService.getOneUser(user.idUser).subscribe({
        next: (newUser) => {
          this.currentUser = newUser;
          console.log(newUser);
          this.nombre_usuario = this.currentUser.username;
          this.correo = this.currentUser.email;

          this.base64Image = `${this.currentUser.image}`;
          // this.base64Image = `data:image/png;base64,${this.currentUser.image}`;
        },
        error: (error) => {
          console.error('Error Buscando el Usuario:', error);
          // Handle errors
        },
      });

      // user.id_persona;
    }
  }
  showToaster(mensaje: string, tipo: string) {
    this.toastMessageService.showtoast(mensaje, tipo);
  }

  BotonCerrarSesion() {
    this.showToaster('!Cerrar Sesión!', 'Info');
    if (this.templateCerrarSesionRef) {
      this.openModal(this.templateCerrarSesionRef);
    }
  }
  EditCuenta() {
    // 'Success' | 'Error' | 'Info' | 'Warning'
    this.showToaster('¡Editar Cuenta!', 'Info'); // Set toast message
    this.router.navigate(['edit-user']);
  }
  BotonCambiarContrasenia() {
    this.showToaster('!Cambiar Contraseña!', 'Info');
    if (this.templateCambiarContraRef) {
      this.openModal(this.templateCambiarContraRef);
    }
  }
  BotonEliminarCuenta() {
    this.showToaster('!Eliminar Cuenta!', 'Info');
    if (this.templateEliminarCuentaRef) {
      this.openModal(this.templateEliminarCuentaRef);
    }
  }
  BotonUltimaConfirmacionEliminarCuenta() {
    setTimeout(() => {
      this.showToaster('!Confirma Eliminar Cuenta!', 'Warning');
      if (this.templateConfirmarEliminarCuentaRef) {
        this.openModal(this.templateConfirmarEliminarCuentaRef);
      }
    }, 500); // 1000 milliseconds = 1 second
  }
  CancelarModal() {
    // 'Success' | 'Error' | 'Info' | 'Warning'
    this.showToaster('¡Acción Cancelada!', 'Info'); // Set toast message
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
  CambiarContrasenia() {
    if (this.templateCambiarContraRef) {
      this.closeModal(this.templateCambiarContraRef);
    }

    const { password } = this.CambiarContraseniaForm;
    console.log(password);
    this.currentUser.password = password;
    this.userService.updatePassword(this.currentUser).subscribe({
      next: (newUser) => {
        // console.log(newUser);
        this.showToaster('!Se Cambio la Contraseña!', 'Success');
        this.logout();
      },
      error: (error) => {
        console.error('Error Cambiando la Contraseña', error);
        // Handle errors
      },
    });
  }
  logout(): void {
    this.authService.logout().subscribe({
      next: (res) => {
        console.log(res);
        this.storageService.clean();
        this.showToaster('!Cerraste Sesión Y saliste del Sistema!', 'Info');
        window.location.replace('/home');
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  EliminarCuenta() {
    this.showToaster('!Eliminaste Tu cuenta!', 'Success');
    this.userService.deleteUser(this.currentUser.idUser).subscribe({
      next: (newUser) => {
        // console.log(newUser);
        this.showToaster('!Se Elimino la Cuenta!', 'Success');
        this.logout();
      },
      error: (error) => {
        console.error('Error Eliminando la Cuenta', error);
        // Handle errors
      },
    });
  }
}
