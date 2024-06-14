import { Component } from '@angular/core';
import { StorageService } from './_services/storage.service';
import { AuthService } from './_services/auth.service';
import { DateTimeService } from './_services/datetime.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  formattedDate$!: Observable<string>;
  formattedTime$!: Observable<string>;

  isLoggedIn = false;
  nombre_usuario?: string;

  constructor(
    private storageService: StorageService,
    private authService: AuthService,
    private dateTimeService: DateTimeService
  ) {}

  ngOnInit(): void {
    this.formattedDate$ = this.dateTimeService.getCurrentDateTime().pipe(
      map((dateTime: Date) => {
        const diaSemana = [
          'Domingo',
          'Lunes',
          'Martes',
          'Miércoles',
          'Jueves',
          'Viernes',
          'Sábado',
        ];
        const mesAnyo = [
          'Enero',
          'Febrero',
          'Marzo',
          'Abril',
          'Mayo',
          'Junio',
          'Julio',
          'Agosto',
          'Septiembre',
          'Octubre',
          'Noviembre',
          'Diciembre',
        ];

        return `${diaSemana[dateTime.getDay()]}, ${dateTime.getDate()} de ${
          mesAnyo[dateTime.getMonth()]
        }, ${dateTime.getFullYear()}`;
      })
    );

    this.formattedTime$ = this.dateTimeService
      .getCurrentDateTime()
      .pipe(map((dateTime: Date) => dateTime.toLocaleTimeString()));

    this.isLoggedIn = this.storageService.isLoggedIn();

    if (this.isLoggedIn) {
      const user = this.storageService.getUser();
      this.nombre_usuario = user.username;
    }
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: (res) => {
        console.log(res);
        this.storageService.clean();

        window.location.reload();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
