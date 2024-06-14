import { Component, OnInit, ViewChild } from '@angular/core';
import { StorageService } from '../../../_services/storage.service';
import { Router } from '@angular/router';
import { ToastMessageService } from '../../../_services/toast-message.service';
import { UserService } from '../../../_services/user.service';
import { User } from '../../../models/user.model';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  FormControl,
  ReactiveFormsModule,
  AbstractControl,
} from '@angular/forms';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.scss',
})
export class EditUserComponent {
  formCuenta: FormGroup = new FormGroup({
    UserName: new FormControl(''),
    ConfirmUserName: new FormControl(''),
  });

  // Assuming your button has ID 'imageButton' in the template
  currentUser: User = {} as User;
  isLoggedIn = false;
  errorMessage = '';
  submitted = false;

  username = '';
  // Define nuevaImagen state property with union type
  nuevaImagen!: File | { data: Blob; contentType: string };

  imagenSuperiorSrc: string = '../../../../../assets/profile/ChangeImage.png';
  base64Image: any;

  constructor(
    private storageService: StorageService,
    private router: Router,
    private toastMessageService: ToastMessageService,
    private userService: UserService,
    private formBuilder: FormBuilder
  ) {}

  async ngOnInit() {
    this.isLoggedIn = this.storageService.isLoggedIn();
    if (!this.isLoggedIn) {
      this.storageService.clean();
      window.location.replace('/home');
    }
    if (this.isLoggedIn) {
      this.currentUser = this.storageService.getUser();

      this.userService.getOneUser(this.currentUser.idUser).subscribe({
        next: (newUser) => {
          this.currentUser = newUser;
          // console.log(newUser);
          this.username = this.currentUser.username;
          this.base64Image = `${this.currentUser.image}`;

          this.formCuenta = this.formBuilder.group({
            UserName: [
              this.username,
              [Validators.required, Validators.minLength(4)],
            ],
            ConfirmUserName: [
              '',
              [Validators.required, Validators.minLength(4)],
            ],
          });
        },
        error: (error) => {
          console.error('Error Buscando el Usuario:', error);
          // Handle errors
        },
      });
    }
  }
  get f(): { [key: string]: AbstractControl } {
    return this.formCuenta.controls;
  }
  showToaster(mensaje: string, tipo: string) {
    this.toastMessageService.showtoast(mensaje, tipo);
  }

  Cancelar() {
    this.showToaster('!No se actualizo la Cuenta', 'Info');
    this.router.navigate(['profile']);
  }
  SaveChanges() {
    this.submitted = true;
    if (this.formCuenta.valid) {
      this.showToaster('!Se actualizo la Cuenta!', 'Info');

      // console.log(this.base64Image);

      const { UserName } = this.formCuenta.value;

      this.currentUser.username = UserName;
      this.currentUser.image = this.base64Image;

      this.userService.updateUser(this.currentUser).subscribe({
        next: (newUser) => {
          // console.log(newUser);
          this.router.navigate(['profile']);
        },
        error: (error) => {
          console.error('Error Actualizando el Usuario:', error);
          // Handle errors
        },
      });
    }
  }
  openFileDialog() {
    document.getElementById('fileInput')?.click();
  }

  onFileChange(event: any) {
    if (event.target.files && event.target.files.length) {
      const file: any = event.target.files[0];
      const reader: any = new FileReader();

      reader.onload = (e: any) => {
        this.base64Image = reader.result;
        this.imagenSuperiorSrc = e.target.result as string;

        // Resetear el valor del input file
        event.target.value = ''; // Esto vacía el input file para evitar el error
      };
      reader.readAsDataURL(file);
    }
  }
}
