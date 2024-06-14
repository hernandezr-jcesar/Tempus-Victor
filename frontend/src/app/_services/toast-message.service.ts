import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class ToastMessageService {
  ToastConfig = {
    timeOut: 2000, // Define el tiempo de visualización (0 = eliminar al agregar uno nuevo)
    closeButton: true, // Muestra un botón de cierre
    progressBar: true, // Muestra una barra de progreso
    positionClass: 'toast-top-left', // Posición de los mensajes
  };

  constructor(private toastr: ToastrService) {}

  showtoast(message: string, title?: string) {
    switch (title) {
      case 'Success':
        this.toastr.success(message, title, this.ToastConfig);
        break;
      case 'Error':
        this.toastr.error(message, title, this.ToastConfig);
        break;
      case 'Warning':
        this.toastr.warning(message, title, this.ToastConfig);
        break;
      case 'Info':
        this.toastr.info(message, title, this.ToastConfig);
        break;
      default:
        break;
    }
  }
}
