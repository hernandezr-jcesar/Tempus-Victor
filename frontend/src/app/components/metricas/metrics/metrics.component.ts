import {
  Component,
  OnInit,
  ChangeDetectorRef,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Chart, ChartType } from 'chart.js/auto';
import { Router } from '@angular/router';
import { ToastMessageService } from '../../../_services/toast-message.service';
import { TaskService } from '../../../_services/task.service';
import { PomodoroSessionService } from '../../../_services/pomodoroSession.service';
import { Task } from '../../../models/task.model';
import { PomodoroSession } from '../../../models/pomodoroSession.model';
import { StorageService } from '../../../_services/storage.service';

@Component({
  selector: 'app-metrics',
  templateUrl: './metrics.component.html',
  styleUrl: './metrics.component.scss',
})
export class MetricsComponent implements OnInit {
  @ViewChild('chartTareas')
  chartCanvas!: ElementRef;

  currentUser: any;
  isLoggedIn = false;

  alltasks: Task[] = [];
  allSessions: PomodoroSession[] = [];

  public chartTareas: any;
  public chartPomodoros: any;

  TareasTotales = 0;
  TareasCompletadas = 0;
  TareasSinCompletar = 0;

  SesionesTotales = 0;
  SesionesSinIniciar = 0;
  SesionesPausadas = 0;
  SesionesTerminadas = 0;
  SesionesAbandonadas = 0;

  constructor(
    private router: Router,
    private toastMessageService: ToastMessageService,
    private taskService: TaskService,
    private pomodoroSessionService: PomodoroSessionService,
    private storageService: StorageService,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
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
          console.log(this.alltasks);

          for (const task of this.alltasks) {
            if (task.pomodoroSession) {
              this.allSessions.push(task.pomodoroSession);
            }
          }

          console.log(this.allSessions);
          this.CalcularCantidades();
          let dataTareas = {
            labels: ['Tareas Completadas', 'Tareas Sin Completar'],
            datasets: [
              {
                label: 'Tareas',
                data: [this.TareasCompletadas, this.TareasSinCompletar],
                backgroundColor: ['rgb(255, 99, 132)', 'rgb(75, 192, 192)'],
              },
            ],
          };
          let dataPomodoros = {
            labels: [
              'Sesiones Sin Iniciar',
              'Sesiones Pausadas',
              'Sesiones Terminadas',
              'Sesiones Abandonadas',
            ],
            datasets: [
              {
                label: 'Sesiones Pomodoro',
                data: [
                  this.SesionesSinIniciar,
                  this.SesionesPausadas,
                  this.SesionesTerminadas,
                  this.SesionesAbandonadas,
                ],
                backgroundColor: [
                  'rgb(123, 231, 100)',
                  'rgb(100, 150, 200)',
                  'rgb(250, 100, 50)',
                  'rgb(240, 120, 240)',
                ],
              },
            ],
          };

          if (this.alltasks.length > 0) {
            // Creamos la gráfica de Tareas
            this.chartTareas = new Chart('chartTareas', {
              type: 'pie' as ChartType, // tipo de la gráfica
              data: dataTareas, // datos
            });
          }
          if (this.allSessions.length > 0) {
            // Creamos la gráfica sesiones Pomodoro
            this.chartPomodoros = new Chart('chartPomodoros', {
              type: 'pie' as ChartType, // tipo de la gráfica
              data: dataPomodoros, // datos
            });
          }

          this.changeDetector.detectChanges();
        });
    }
  }

  Regresar() {
    this.showToaster('!Salio De Metricas del Sistema!', 'Info');
    this.router.navigate(['tasks/eisenhower']);
  }

  showToaster(mensaje: string, tipo: string) {
    this.toastMessageService.showtoast(mensaje, tipo);
  }
  CancelarModal() {
    // console.log('Cancelar');
    // 'Success' | 'Error' | 'Info' | 'Warning'
    this.showToaster('¡Acción Cancelada!', 'Info'); // Set toast message
  }
  CalcularCantidades() {
    this.TareasTotales = this.alltasks.length;

    for (const task of this.alltasks) {
      if (task.status) {
        //true
        this.TareasCompletadas++;
      }
      if (!task.status) {
        //false
        this.TareasSinCompletar++;
      }
    }

    this.SesionesTotales = this.allSessions.length;
    for (const session of this.allSessions) {
      if (session.status == 'SinIniciar') {
        //true
        this.SesionesSinIniciar++;
      }
      if (session.status == 'Pausada') {
        //true
        this.SesionesPausadas++;
      }
      if (session.status == 'Terminada') {
        //true
        this.SesionesTerminadas++;
      }
      if (session.status == 'Abandonada') {
        //true
        this.SesionesAbandonadas++;
      }
    }
  }
}
