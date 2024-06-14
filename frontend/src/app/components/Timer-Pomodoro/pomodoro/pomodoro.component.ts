import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
  TemplateRef,
  ChangeDetectorRef,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Task } from '../../../models/task.model';
import { TaskService } from '../../../_services/task.service';
import { PomodoroSessionService } from '../../../_services/pomodoroSession.service';
import { StorageService } from '../../../_services/storage.service';
import { ToastMessageService } from '../../../_services/toast-message.service';
import { PomodoroSession } from '../../../models/pomodoroSession.model';
import { AudioService } from '../../../_services/audio.service';
import { PomodoroEventService } from '../../../_services/pomodoro-event.service';
import { EventService } from '../../../_services/event.service';
import { SettingService } from '../../../_services/setting.service';
import { Setting } from '../../../models/setting.model';

import { BsModalRef, BsModalService, ModalModule } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-pomodoro',
  templateUrl: './pomodoro.component.html',
  styleUrl: './pomodoro.component.scss',
})
export class PomodoroComponent implements OnInit {
  imagenesAbandonado: { image: string; text?: string }[] = [
    { image: '../../../assets/GIF/Abandonado_1.gif' },
    { image: '../../../assets/GIF/Abandonado_2.gif' },
    { image: '../../../assets/GIF/Abandonado_3.gif' },
    { image: '../../../assets/GIF/Abandonado_4.gif' },
    { image: '../../../assets/GIF/Abandonado_5.gif' },
    { image: '../../../assets/GIF/Abandonado_6.gif' },
    { image: '../../../assets/GIF/Abandonado_7.gif' },
    { image: '../../../assets/GIF/Abandonado_8.gif' },
    { image: '../../../assets/GIF/Abandonado_9.gif' },
    { image: '../../../assets/GIF/Abandonado_10.gif' },
  ];
  imagenesTrabajo: { image: string; text?: string }[] = [
    { image: '../../../assets/GIF/Trabajando_1.gif' },
    { image: '../../../assets/GIF/Trabajando_2.gif' },
    { image: '../../../assets/GIF/Trabajando_3.gif' },
    { image: '../../../assets/GIF/Trabajando_4.gif' },
    { image: '../../../assets/GIF/Trabajando_5.gif' },
    { image: '../../../assets/GIF/Trabajando_6.gif' },
    { image: '../../../assets/GIF/Trabajando_7.gif' },
    { image: '../../../assets/GIF/Trabajando_8.gif' },
    { image: '../../../assets/GIF/Trabajando_9.gif' },
    { image: '../../../assets/GIF/Trabajando_10.gif' },
  ];
  imagenesDescanso: { image: string; text?: string }[] = [
    { image: '../../../assets/GIF/Descansando_1.gif' },
    { image: '../../../assets/GIF/Descansando_2.gif' },
    { image: '../../../assets/GIF/Descansando_3.gif' },
    { image: '../../../assets/GIF/Descansando_4.gif' },
    { image: '../../../assets/GIF/Descansando_5.gif' },
    { image: '../../../assets/GIF/Descansando_6.gif' },
    { image: '../../../assets/GIF/Descansando_7.gif' },
    { image: '../../../assets/GIF/Descansando_8.gif' },
    { image: '../../../assets/GIF/Descansando_9.gif' },
    { image: '../../../assets/GIF/Descansando_10.gif' },
  ];
  selectedImageAbandonado: any;
  selectedImageTrabajo: any;
  selectedImageDescanso: any;

  Alarmsounds: { value: string; src: string }[] = [
    {
      value: 'Cocina',
      src: '../../../assets/Sounds/AudiosRecortados/AlarmaRelojCocina.mp3',
    },
    {
      value: 'Digital',
      src: '../../../assets/Sounds/AudiosRecortados/AlarmaRelojDigital.mp3',
    },
    {
      value: 'Feliz',
      src: '../../../assets/Sounds/AudiosRecortados/AlarmaSonido.mp3',
    },
    {
      value: 'Celular',
      src: '../../../assets/Sounds/AudiosRecortados/AlarmaTelefonoVibrando.mp3',
    },
  ];
  TicTacsounds: { value: string; src: string }[] = [
    {
      value: 'Sonido1',
      src: '../../../assets/Sounds/SonidoTicTac_1.mp3',
    },
    {
      value: 'Sonido2',
      src: '../../../assets/Sounds/SonidoTicTac_2.mp3',
    },
    {
      value: 'Sonido3',
      src: '../../../assets/Sounds/SonidoTicTac_3.mp3',
    },
    {
      value: 'Sonido4',
      src: '../../../assets/Sounds/SonidoTicTac_4.mp3',
    },
  ];
  selectedAlarmSound: any;
  selectedTicTacSound: any;

  UserSetting: Setting = {} as Setting;

  tiempoTotalEstimacion: { horas: number; minutos: number } =
    this.convertSecondsToHours_Minutes_Seconds(0);

  /// variables para los modales
  @ViewChild('templateTrabajo') templateTrabajoRef:
    | TemplateRef<any>
    | undefined; // Reference the template
  @ViewChild('templateDescanso') templateDescansoRef:
    | TemplateRef<any>
    | undefined; // Reference the template
  @ViewChild('templateSesionAbandonada') templateSesionAbandonadaRef:
    | TemplateRef<any>
    | undefined; // Reference the template
  @ViewChild('templateSesionTerminada') templateSesionTerminadaRef:
    | TemplateRef<any>
    | undefined; // Reference the template
  @ViewChild('templateSesionPausada') templateSesionPausadaRef:
    | TemplateRef<any>
    | undefined; // Reference the template
  @ViewChild('templateCompletarTarea') templateCompletarTareaRef:
    | TemplateRef<any>
    | undefined; // Reference the template

  modalRefMap = new Map<TemplateRef<any>, BsModalRef>(); // A map to store modal references

  modalRef!: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
  };

  /// VARIABLES PARA SONIDOS
  SonidoAlarma = 'clock-alarm'; // Replace with your sound file name (without extension)
  SonidoReloj = 'SonidoDeTicTac'; // Replace with your sound file name (without extension)
  AlarmaURL = '../../../../assets/Sounds/clock-alarm.mp3';
  RelojURL = '../../../../assets/Sounds/SonidoDeTicTac.mp3';
  AlarmaisPlaying: boolean = false;
  RelojisPlaying: boolean = false;

  ///// VARIABLES DEL SISTEMA /////
  suspendedSessionLimit: number = 3 * 60; // 3 minutos in seconds
  trabajando: boolean = false;
  descansando: boolean = false;
  pomodorosActuales: number = 1;

  TiempoTotalTimerId: any;
  trabajoTimerId: any;
  descansoTimerId: any;
  otroTiempoId: any;
  guardarTiemposCadaMinutoId: any;

  task: Task = {} as Task;
  sesionpomodoroactual: PomodoroSession = {} as PomodoroSession;
  pomodorosessionID: number = 0;
  currentUser: any;
  isLoggedIn: boolean = false;

  trabajoWidth: number = 0; // Initial progress width (0%)
  descansoWidth: number = 0; // progressWidth: string = '0%';
  // OTRO TIEMPO, para rastrear sesion desatendida
  otroTiemposeg: number = 0;

  ///// VARIABLES DEL USUARIO /////
  pomodorosCompletados: number = 0;
  // trabajoDuration: number = 25 * 60; // 25 minutes in seconds
  // descansoDuration: number = 5 * 60; // 5 minutes in seconds
  trabajoDuration: number = 0; // 25 minutes in seconds
  descansoDuration: number = 0; // 5 minutes in seconds
  descansoLargo: number = 0;

  // TIEMPO TOTAL
  tiempoTotalseg: number = 0;
  tiempoTotalCompleto: { horas: number; minutos: number; segundos: number } = {
    horas: 0,
    minutos: 0,
    segundos: 0,
  };

  // TIEMPOS TOTALES TRABAJO Y DESCANSO
  tiempoTrabajoTotalseg: number = 0;
  tiempoTrabajoTotal: { horas: number; minutos: number; segundos: number } = {
    horas: 0,
    minutos: 0,
    segundos: 0,
  };

  tiempoDescansoTotalseg: number = 0;
  tiempoDescansoTotal: { horas: number; minutos: number; segundos: number } = {
    horas: 0,
    minutos: 0,
    segundos: 0,
  };

  // TIEMPOS RESTANTES DEL POMODORO
  tiemporestanteTrabajoseg: number = this.trabajoDuration;
  tiemporestanteTrabajo: { minutos: number; segundos: number } = {
    minutos: 0,
    segundos: 0,
  };

  tiemporestanteDescansoseg: number = this.descansoDuration;
  tiemporestanteDescanso: { minutos: number; segundos: number } = {
    minutos: 0,
    segundos: 0,
  };

  //TIEMPOS PARA LA BARRA DE PROGRESO
  currentTimeTrabajoseg: number = 0;
  currentTimeTrabajo: { minutos: number; segundos: number } = {
    minutos: 0,
    segundos: 0,
  };

  currentTimeDescansoseg: number = 0;
  currentTimeDescanso: { minutos: number; segundos: number } = {
    minutos: 0,
    segundos: 0,
  };
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private taskService: TaskService,
    private pomodoroSessionService: PomodoroSessionService,
    private storageService: StorageService,
    private toastMessageService: ToastMessageService,
    private modalService: BsModalService,
    private changeDetector: ChangeDetectorRef,
    private audioService: AudioService,
    private pomodoroEventService: PomodoroEventService,
    private eventService: EventService,
    private settingService: SettingService
  ) {}

  ngOnInit() {
    this.isLoggedIn = this.storageService.isLoggedIn();
    if (!this.isLoggedIn) {
      this.storageService.clean();
      window.location.replace('/home');
    }
    if (this.isLoggedIn) {
      this.tiemporestanteTrabajo = this.convertSecondsToHours_Minutes_Seconds(
        this.trabajoDuration
      );
      this.tiemporestanteDescanso = this.convertSecondsToHours_Minutes_Seconds(
        this.descansoDuration
      );

      const selectedTaskId = this.route.snapshot.queryParams['selectedTaskId'];

      this.currentUser = this.storageService.getUser();

      // // Update the service call to retrieve a single note
      // this.notesService;

      this.taskService.getOneTask(selectedTaskId as number).subscribe({
        next: (task: Task) => {
          this.task = task;

          this.pomodoroSessionService
            .getOneSession(this.task.idTask)
            .subscribe({
              next: (session: PomodoroSession) => {
                this.sesionpomodoroactual = session;
                this.calcularTiempoEstimacion();
                // console.log(this.sesionpomodoroactual);
                this.showToaster('Bienvenido a la sesion de pomodoro', 'Info');

                this.settingService
                  .getSetting(this.currentUser.idUser)
                  .subscribe({
                    next: (currentSetting: Setting) => {
                      this.UserSetting = currentSetting;
                      this.trabajoDuration =
                        currentSetting.pomodoroWorkDuration;
                      this.descansoDuration = currentSetting.shortBreakDuration;
                      this.descansoLargo = currentSetting.longBreakDuration;
                      this.selectedImageAbandonado =
                        currentSetting.neglectedImg;
                      this.selectedImageTrabajo = currentSetting.workImg;
                      this.selectedImageDescanso = currentSetting.breakImg;
                      this.selectedAlarmSound = currentSetting.alarmSound;
                      this.selectedTicTacSound = currentSetting.tictacSound;

                      this.SonidoAlarma =
                        this.Alarmsounds[this.selectedAlarmSound].value;
                      this.AlarmaURL =
                        this.Alarmsounds[this.selectedAlarmSound].src;

                      this.SonidoReloj =
                        this.TicTacsounds[this.selectedTicTacSound].value;
                      this.RelojURL =
                        this.TicTacsounds[this.selectedTicTacSound].src;

                      this.audioService.loadSound(
                        this.SonidoAlarma,
                        this.AlarmaURL
                      );
                      this.audioService.loadSound(
                        this.SonidoReloj,
                        this.RelojURL
                      );
                      console.log(this.UserSetting);

                      this.evaluarValoresTiemposDependiendoEstadoSesion();
                      this.changeDetector.detectChanges();
                    },
                    error: (error) => {
                      console.error(
                        'Error obteniendo la configuracón del usuario:',
                        error
                      );
                      // Handle errors
                    },
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
      });
    }
  }
  evaluarValoresTiemposDependiendoEstadoSesion() {
    const estadoActual = this.sesionpomodoroactual.status;
    if (estadoActual == 'SinIniciar') {
      console.log('Accediste a una sesion sin Iniciar');
      console.log(this.sesionpomodoroactual);
      clearInterval(this.TiempoTotalTimerId);
      clearInterval(this.trabajoTimerId);
      clearInterval(this.descansoTimerId);
      clearInterval(this.otroTiempoId);
      clearInterval(this.guardarTiemposCadaMinutoId);

      this.trabajando = false;
      this.descansando = false;

      this.pomodorosCompletados = 0;

      // this.descansoDuration = this.descansoDuration;
      // this.trabajoDuration = this.trabajoDuration;

      this.tiemporestanteTrabajoseg = this.trabajoDuration;
      this.tiemporestanteTrabajo = this.convertSecondsToHours_Minutes_Seconds(
        this.tiemporestanteTrabajoseg
      );
      this.tiemporestanteDescansoseg = this.descansoDuration;
      this.tiemporestanteDescanso = this.convertSecondsToHours_Minutes_Seconds(
        this.tiemporestanteDescansoseg
      );

      this.tiempoTrabajoTotalseg = 0;
      this.tiempoTrabajoTotal = this.convertSecondsToHours_Minutes_Seconds(
        this.tiempoTrabajoTotalseg
      );

      this.tiempoDescansoTotalseg = 0;
      this.tiempoDescansoTotal = this.convertSecondsToHours_Minutes_Seconds(
        this.tiempoDescansoTotalseg
      );

      this.otroTiemposeg = 0;

      this.tiempoTotalseg = 0;
      this.tiempoTotalCompleto = this.convertSecondsToHours_Minutes_Seconds(
        this.tiempoTotalseg
      );
      // Resetear la barra de progreso
      this.currentTimeTrabajoseg = 0;
      this.currentTimeTrabajo = this.convertSecondsToHours_Minutes_Seconds(
        this.currentTimeTrabajoseg
      );
      this.currentTimeDescansoseg = 0;
      this.currentTimeDescanso = this.convertSecondsToHours_Minutes_Seconds(
        this.currentTimeDescansoseg
      );

      this.updateTrabajoBar();
      this.updateDescansoBar();
      this.actualizarTiemposSesion();
      this.actualizarCantPomodorosSesion();
      this.actualizartrabajodescansoSesion();
      this.actualizarInicioSesion(null);
      this.actualizarFinSesion(null);
      this.actualizarEstadoSesion('SinIniciar');
      this.changeDetector.detectChanges();
    } else if (estadoActual == 'Pausada') {
      console.log('Accediste a una sesion pausada');
      console.log(this.sesionpomodoroactual);

      this.cargarValoresGuardadosSesion();

      this.pausedSessionStart();
    } else if (estadoActual == 'Abandonada') {
      console.log('Accediste a una sesion abandonada');
      console.log(this.sesionpomodoroactual);

      this.cargarValoresGuardadosSesion();

      this.suspendedSessionStart();
    } else if (estadoActual == 'Terminada') {
      console.log('Accediste a una sesion terminada');
      console.log(this.sesionpomodoroactual);

      this.cargarValoresGuardadosSesion();

      if (this.templateSesionTerminadaRef) {
        this.openModal(this.templateSesionTerminadaRef);
      }
    }
  }
  cargarValoresGuardadosSesion() {
    // Iniciar los valores con los datos guardados en la sesion

    this.trabajoDuration = this.trabajoDuration;
    this.descansoDuration = this.descansoDuration;
    this.trabajando = this.sesionpomodoroactual.working;
    this.descansando = this.sesionpomodoroactual.resting;
    this.pomodorosCompletados = this.sesionpomodoroactual.completedPomodoros;

    this.tiempoTotalseg = this.sesionpomodoroactual.totalTimeElapsed;
    this.tiempoTotalCompleto = this.convertSecondsToHours_Minutes_Seconds(
      this.tiempoTotalseg
    );

    this.tiempoTrabajoTotalseg = this.sesionpomodoroactual.workTimeElapsed;
    this.tiempoTrabajoTotal = this.convertSecondsToHours_Minutes_Seconds(
      this.tiempoTrabajoTotalseg
    );
    this.tiempoDescansoTotalseg = this.sesionpomodoroactual.breakTimeElapsed;
    this.tiempoDescansoTotal = this.convertSecondsToHours_Minutes_Seconds(
      this.tiempoDescansoTotalseg
    );

    this.tiemporestanteTrabajoseg = this.sesionpomodoroactual.remainingWorkTime;
    this.tiemporestanteTrabajo = this.convertSecondsToHours_Minutes_Seconds(
      this.tiemporestanteTrabajoseg
    );
    this.tiemporestanteDescansoseg =
      this.sesionpomodoroactual.remainingBreakTime;
    this.tiemporestanteDescanso = this.convertSecondsToHours_Minutes_Seconds(
      this.tiemporestanteDescansoseg
    );

    this.currentTimeTrabajoseg = this.sesionpomodoroactual.currentWorkTime;
    this.currentTimeTrabajo = this.convertSecondsToHours_Minutes_Seconds(
      this.currentTimeTrabajoseg
    );
    this.currentTimeDescansoseg = this.sesionpomodoroactual.currentBreakTime;
    this.currentTimeDescanso = this.convertSecondsToHours_Minutes_Seconds(
      this.currentTimeDescansoseg
    );

    this.updateTrabajoBar();
    this.updateDescansoBar();
  }
  // Parar regresar a la pantalla anterior
  Cancelar() {
    this.router.navigate(['tasks/eisenhower']);
  }
  // Para mandar mensjaes en pantalla
  showToaster(mensaje: string, tipo: string) {
    this.toastMessageService.showtoast(mensaje, tipo);
  }

  // Para iterar por n objetos que se ingrese
  range(n: number): Array<number> {
    return Array(n)
      .fill(0)
      .map((x, i) => i);
  }

  // BOTON RESET TIMER
  resetTimer() {
    // console.log(this.sesionpomodoroactual);
    if (this.RelojisPlaying) {
      this.pauseSound(this.SonidoReloj);
    }
    if (this.AlarmaisPlaying) {
      this.pauseSound(this.SonidoAlarma);
    }

    let descripcion =
      'La sesion Pomodoro se REINICIO para la tarea: ' + this.task.title;
    this.CrearPomodoroEvento(descripcion);

    // Parte de mensaje al empezar la sesion
    this.showToaster('¡Sesion Reseteada exitosamente!', 'Success'); // Set toast message

    clearInterval(this.TiempoTotalTimerId);
    clearInterval(this.trabajoTimerId);
    clearInterval(this.descansoTimerId);
    clearInterval(this.otroTiempoId);
    clearInterval(this.guardarTiemposCadaMinutoId);

    this.trabajando = false;
    this.descansando = false;

    this.pomodorosCompletados = 0;

    this.descansoDuration = this.descansoDuration;
    this.trabajoDuration = this.trabajoDuration;

    this.tiemporestanteTrabajoseg = this.trabajoDuration;
    this.tiemporestanteTrabajo = this.convertSecondsToHours_Minutes_Seconds(
      this.tiemporestanteTrabajoseg
    );
    this.tiemporestanteDescansoseg = this.descansoDuration;
    this.tiemporestanteDescanso = this.convertSecondsToHours_Minutes_Seconds(
      this.tiemporestanteDescansoseg
    );

    this.tiempoTrabajoTotalseg = 0;
    this.tiempoTrabajoTotal = this.convertSecondsToHours_Minutes_Seconds(
      this.tiempoTrabajoTotalseg
    );

    this.tiempoDescansoTotalseg = 0;
    this.tiempoDescansoTotal = this.convertSecondsToHours_Minutes_Seconds(
      this.tiempoDescansoTotalseg
    );

    this.otroTiemposeg = 0;

    this.tiempoTotalseg = 0;
    this.tiempoTotalCompleto = this.convertSecondsToHours_Minutes_Seconds(
      this.tiempoTotalseg
    );
    // Resetear la barra de progreso
    this.currentTimeTrabajoseg = 0;
    this.currentTimeTrabajo = this.convertSecondsToHours_Minutes_Seconds(
      this.currentTimeTrabajoseg
    );
    this.currentTimeDescansoseg = 0;
    this.currentTimeDescanso = this.convertSecondsToHours_Minutes_Seconds(
      this.currentTimeDescansoseg
    );

    this.updateTrabajoBar();
    this.updateDescansoBar();
    this.actualizarTiemposSesion();
    this.actualizarCantPomodorosSesion();
    this.actualizartrabajodescansoSesion();
    this.actualizarInicioSesion(null);
    this.actualizarFinSesion(null);
    this.actualizarEstadoSesion('SinIniciar');
    this.changeDetector.detectChanges();
    // console.log(this.sesionpomodoroactual);
  }
  // BOTON PLAY
  startTimer() {
    // Trabajando
    if (this.trabajando == true) {
      this.changeDetector.detectChanges();
      if (this.otroTiempoId) {
        clearInterval(this.otroTiempoId);
      }

      this.playSound(this.SonidoReloj);
      this.startTrabajoConteo();
    }
    // Descansando
    if (this.trabajando == false) {
      this.changeDetector.detectChanges();
      if (this.otroTiempoId) {
        clearInterval(this.otroTiempoId);
      }

      this.playSound(this.SonidoReloj);
      this.startDescansoConteo();
    }
  }

  // BOTON PAUSE
  pauseTimer() {
    // if (this.trabajando == true) {
    //   this.changeDetector.detectChanges();

    //   if (this.RelojisPlaying) {
    //     this.pauseSound(this.SonidoReloj);
    //   }
    //   if (this.AlarmaisPlaying) {
    //     this.pauseSound(this.SonidoAlarma);
    //   }

    //   // 'Success' | 'Error' | 'Info' | 'Warning'
    //   this.showToaster('¡Sesion Pausada exitosamente!', 'Info'); // Set toast message
    //   this.actualizarEstadoSesion('Pausada');
    //   clearInterval(this.trabajoTimerId);
    //   clearInterval(this.descansoTimerId);
    // }
    // if (this.trabajando == false) {
    //   this.changeDetector.detectChanges();

    //   if (this.RelojisPlaying) {
    //     this.pauseSound(this.SonidoReloj);
    //   }
    //   if (this.AlarmaisPlaying) {
    //     this.pauseSound(this.SonidoAlarma);
    //   }

    //   // 'Success' | 'Error' | 'Info' | 'Warning'
    //   this.showToaster('¡Sesion Pausada exitosamente!', 'Info'); // Set toast message
    //   this.actualizarEstadoSesion('Pausada');

    //   clearInterval(this.trabajoTimerId);
    //   clearInterval(this.descansoTimerId);
    // }

    let descripcion =
      'La sesion Pomodoro se PAUSO para la tarea: ' + this.task.title;
    this.CrearPomodoroEvento(descripcion);

    // 'Success' | 'Error' | 'Info' | 'Warning'
    this.showToaster('¡Sesion Pausada exitosamente!', 'Info'); // Set toast message
    this.pauseSound(this.SonidoAlarma);
    this.pauseSound(this.SonidoReloj);

    if (this.templateTrabajoRef) {
      this.closeModal(this.templateTrabajoRef);
    }
    if (this.templateDescansoRef) {
      this.closeModal(this.templateDescansoRef);
    }
    this.actualizarEstadoSesion('Pausada');
    this.actualizarTiemposSesion();
    this.actualizarCantPomodorosSesion();
    this.actualizartrabajodescansoSesion();
    this.updateTrabajoBar();
    this.updateDescansoBar();

    //parar los contadores
    clearInterval(this.TiempoTotalTimerId);
    clearInterval(this.trabajoTimerId);
    clearInterval(this.descansoTimerId);
    clearInterval(this.otroTiempoId);
    clearInterval(this.guardarTiemposCadaMinutoId);
  }

  // BOTON END SESSION
  endTimer() {
    if (this.RelojisPlaying) {
      this.pauseSound(this.SonidoReloj);
    }
    if (this.AlarmaisPlaying) {
      this.pauseSound(this.SonidoAlarma);
    }

    clearInterval(this.trabajoTimerId);
    clearInterval(this.descansoTimerId);
    clearInterval(this.otroTiempoId);
    clearInterval(this.TiempoTotalTimerId);
    clearInterval(this.guardarTiemposCadaMinutoId);

    this.trabajando = false;
    this.descansando = false;
    this.actualizartrabajodescansoSesion();
    let descripcion =
      'La sesion Pomodoro se Termino para la tarea: ' + this.task.title;
    this.CrearPomodoroEvento(descripcion);

    // 'Success' | 'Error' | 'Info' | 'Warning'
    this.showToaster('¡Sesion Terminada exitosamente!', 'Success'); // Set toast message
    this.actualizarEstadoSesion('Terminada');

    // GUARDAR LOS TIEMPOS EN LA SESION
    this.actualizarTiemposSesion();

    // Format the date string in ISO 8601 format
    const nowInMilliseconds = Date.now();
    const createdAt = new Date(nowInMilliseconds).toISOString();
    this.actualizarFinSesion(createdAt);

    // GUARDAR LOS POMODOROS COMPLETADOS EN LA SESION
    this.actualizarCantPomodorosSesion();

    this.verModalCompletarTarea();
    // console.log(this.sesionpomodoroactual);
  }

  /// EMPIEZAN LAS FUNCIONES PARA EL FUNCIONAMIENTO DEL TIMER (LOGICA) ///

  // ESTO PASA CUANDO SE ESTA TRABAJANDO Y EL CONTADOR ESTA CORRIENDO
  startTrabajoConteo(): void {
    if (this.otroTiempoId) {
      clearInterval(this.otroTiempoId);
    }
    let descripcion =
      'Empezo el tiempo de TRABAJO del pomodoro actual, para la tarea: ' +
      this.task.title;
    this.CrearPomodoroEvento(descripcion);

    this.trabajoTimerId = setInterval(() => {
      // console.log(this.sesionpomodoroactual);
      // trabajo total
      this.tiempoTrabajoTotalseg++;
      this.tiempoTrabajoTotal = this.convertSecondsToHours_Minutes_Seconds(
        this.tiempoTrabajoTotalseg
      );

      // trabajo restante
      this.tiemporestanteTrabajoseg--;
      this.tiemporestanteTrabajo = this.convertSecondsToHours_Minutes_Seconds(
        this.tiemporestanteTrabajoseg
      );

      this.currentTimeTrabajoseg++;
      this.currentTimeTrabajo = this.convertSecondsToHours_Minutes_Seconds(
        this.currentTimeTrabajoseg
      );
      if (this.currentTimeTrabajoseg == this.trabajoDuration) {
        this.TrabajoEnd();
      }

      this.updateTrabajoBar();
    }, 1000);
  }

  // ESTO PASA CUANDO SE ESTA DESCANSANDO Y EL CONTADOR ESTA CORRIENDO
  startDescansoConteo(): void {
    let descripcion =
      'Empezo el tiempo de DESCANSO del pomodoro actual, para la tarea: ' +
      this.task.title;
    this.CrearPomodoroEvento(descripcion);

    if (this.otroTiempoId) {
      clearInterval(this.otroTiempoId);
    }

    this.descansoTimerId = setInterval(() => {
      // console.log(this.sesionpomodoroactual);
      // descanso total
      this.tiempoDescansoTotalseg++;
      this.tiempoDescansoTotal = this.convertSecondsToHours_Minutes_Seconds(
        this.tiempoDescansoTotalseg
      );

      // descanso restante
      this.tiemporestanteDescansoseg--;
      this.tiemporestanteDescanso = this.convertSecondsToHours_Minutes_Seconds(
        this.tiemporestanteDescansoseg
      );

      this.currentTimeDescansoseg++;
      this.currentTimeDescanso = this.convertSecondsToHours_Minutes_Seconds(
        this.currentTimeDescansoseg
      );

      if (this.currentTimeDescansoseg == this.descansoDuration) {
        this.DescansoEnd();
      }

      this.updateDescansoBar();
    }, 1000);
  }

  // COMPORTAMIENTO CUANDO SE COMPLETA EL TIEMPO DE TRABAJO
  TrabajoEnd() {
    if (this.RelojisPlaying) {
      this.pauseSound(this.SonidoReloj);
    }
    if (this.AlarmaisPlaying) {
      this.pauseSound(this.SonidoAlarma);
    }
    clearInterval(this.trabajoTimerId);
    // console.log('Aqui va la pregunta de empezar descanso y la alarma');

    let descripcion =
      'Se completo el tiempo de TRABAJO del pomodoro actual, para la tarea: ' +
      this.task.title;
    this.CrearPomodoroEvento(descripcion);

    this.trabajando = false;
    this.descansando = true;
    this.actualizartrabajodescansoSesion();

    this.verModalDescanso();
    // this.startDescansoConteo();
  }

  // COMPORTAMIENTO CUANDO SE COMPLETA EL TIEMPO DE DESCANSO
  DescansoEnd() {
    if (this.RelojisPlaying) {
      this.pauseSound(this.SonidoReloj);
    }
    if (this.AlarmaisPlaying) {
      this.pauseSound(this.SonidoAlarma);
    }
    clearInterval(this.descansoTimerId);
    // console.log('Aqui va la pregunta de empezar trabajo y la alarma');

    let descripcion =
      'Se completo el tiempo de DESCANSO del pomodoro actual, para la tarea: ' +
      this.task.title;
    this.CrearPomodoroEvento(descripcion);

    this.trabajando = true;
    this.descansando = false;
    this.actualizartrabajodescansoSesion();

    this.verModalTrabajo();
    // this.startTrabajoConteo();
  }

  // COMPORTAMIENTO CUANDO SE ACABA UN POMODORO, TRABAJAO + DESCANSO
  empezarNuevoPomodoro() {
    console.log('Empezando nuevo pomodoro');

    clearInterval(this.trabajoTimerId);
    clearInterval(this.descansoTimerId);
    clearInterval(this.otroTiempoId);
    clearInterval(this.guardarTiemposCadaMinutoId);

    this.pomodorosCompletados++;

    this.currentTimeTrabajoseg = 0;
    this.currentTimeTrabajo = this.convertSecondsToHours_Minutes_Seconds(
      this.currentTimeTrabajoseg
    );

    this.currentTimeDescansoseg = 0;
    this.currentTimeDescanso = this.convertSecondsToHours_Minutes_Seconds(
      this.currentTimeDescansoseg
    );
    this.updateTrabajoBar();
    this.updateDescansoBar();

    if (this.pomodorosCompletados % 3 == 0) {
      this.descansoDuration = this.UserSetting.longBreakDuration;
      this.tiemporestanteDescansoseg = this.descansoDuration;
      this.tiemporestanteDescanso = this.convertSecondsToHours_Minutes_Seconds(
        this.tiemporestanteDescansoseg
      );

      this.tiemporestanteTrabajoseg = this.trabajoDuration;
      this.tiemporestanteTrabajo = this.convertSecondsToHours_Minutes_Seconds(
        this.tiemporestanteTrabajoseg
      );
    } else {
      this.descansoDuration = this.UserSetting.shortBreakDuration;
      this.tiemporestanteDescansoseg = this.descansoDuration;
      this.tiemporestanteDescanso = this.convertSecondsToHours_Minutes_Seconds(
        this.tiemporestanteDescansoseg
      );

      this.tiemporestanteTrabajoseg = this.trabajoDuration;
      this.tiemporestanteTrabajo = this.convertSecondsToHours_Minutes_Seconds(
        this.tiemporestanteTrabajoseg
      );
    }

    this.actualizarTiemposSesion();
    this.startTrabajoConteo();
  }
  // PARA LA ACTUALIZACION DE LA BARRA DE PROGRESO DE TRABAJO
  updateTrabajoBar(): void {
    const progress = (this.currentTimeTrabajoseg / this.trabajoDuration) * 100;
    this.trabajoWidth = progress;
  }
  // PARA LA ACTUALIZACION DE LA BARRA DE PROGRESO DE DESCANSO
  updateDescansoBar(): void {
    const progress =
      (this.currentTimeDescansoseg / this.descansoDuration) * 100;

    this.descansoWidth = progress;
    // console.log(this.descansoWidth);
  }
  // PARA LANZAR EL MODAL PARA INICIAR SESION
  EmpezarSesionModal() {
    const nowInMilliseconds = Date.now();
    // Format the date string in ISO 8601 format
    const createdAt = new Date(nowInMilliseconds).toISOString();
    this.actualizarInicioSesion(createdAt);
    // console.log('EmpezarSesion');
    this.trabajando = true;
    this.descansando = false;
    this.actualizartrabajodescansoSesion();

    this.TiempoTotalTimerId = setInterval(() => {
      this.tiempoTotalseg++;
      this.tiempoTotalCompleto = this.convertSecondsToHours_Minutes_Seconds(
        this.tiempoTotalseg
      );
    }, 1000);

    this.guardarTiemposCadaMinutoId = setInterval(() => {
      this.actualizarEstadoSesion(this.sesionpomodoroactual.status);
      this.actualizarTiemposSesion();
      this.actualizarCantPomodorosSesion();
      this.actualizartrabajodescansoSesion();
      this.updateTrabajoBar();
      this.updateDescansoBar();
      // console.log('Se guardaron los valores ');
    }, 60000); // 60000 milliseconds = 1 minute

    let descripcion =
      'La sesion Pomodoro INICIO para la tarea: ' + this.task.title;
    this.CrearPomodoroEvento(descripcion);

    this.showToaster('¡Sesion Iniciada exitosamente!', 'Info'); // Set toast message
    this.actualizarEstadoSesion('Corriendo');

    this.startTimer();
  }
  // ACCION QUE REALIZA EL MODAL SI SE DA CLICK EN EL BOTON CANCELAR
  CancelarModal() {
    // console.log('Cancelar');
    // 'Success' | 'Error' | 'Info' | 'Warning'
    this.showToaster('¡Acción Cancelada!', 'Info'); // Set toast message
  }
  // CONVERTIDOR DE SEGUNDOS A HORAS, MINUTOS Y SEGUNDOS
  convertSecondsToHours_Minutes_Seconds(totalSeconds: number): {
    horas: number;
    minutos: number;
    segundos: number;
  } {
    let horas = 0;
    let minutos = 0;
    let segundos = Math.round(totalSeconds % 60);

    while (totalSeconds >= 60) {
      minutos++;
      totalSeconds -= 60;

      if (minutos >= 60) {
        horas++;
        minutos = 0;
      }
    }

    // Return an object with the calculated hours and minutes
    return { horas, minutos, segundos };
  }

  //// MODALES DE LA SESION ///

  // PARA MOSTRAR O ABRIR LOS MODALES
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

  // MODAL PARA EMPEZAR TRABAJO (DESCANSO COMPLETADO)
  verModalTrabajo() {
    this.otroTiemposeg = 0;
    this.otroTiempoId = setInterval(() => {
      this.otroTiemposeg++;

      // console.log(this.otroTiemposeg);
      if (this.otroTiemposeg == this.suspendedSessionLimit) {
        this.suspendedSessionStart();
      }
    }, 1000);

    if (this.templateTrabajoRef) {
      this.playSound(this.SonidoAlarma);
      // this.playAudioAlarma();
      this.openModal(this.templateTrabajoRef);
    }
  }
  // MODAL PARA EMPEZAR DESCANSO (TRABAJO COMPLETADO)
  verModalDescanso() {
    this.otroTiemposeg = 0;
    this.otroTiempoId = setInterval(() => {
      this.otroTiemposeg++;
      // console.log(this.otroTiemposeg);
      if (this.otroTiemposeg == this.suspendedSessionLimit) {
        this.suspendedSessionStart();
      }
    }, 1000);
    if (this.templateDescansoRef) {
      this.playSound(this.SonidoAlarma);
      // this.playAudioAlarma();
      this.openModal(this.templateDescansoRef);
    }
  }
  verModalCompletarTarea() {
    if (this.templateCompletarTareaRef) {
      this.openModal(this.templateCompletarTareaRef);
    }
  }

  // ACTUALIZAR trabajo y descanso sesion
  actualizartrabajodescansoSesion() {
    this.sesionpomodoroactual.working = this.trabajando;
    this.sesionpomodoroactual.resting = this.descansando;
    this.pomodoroSessionService
      .updateSession(this.sesionpomodoroactual)
      .subscribe({
        next: () => {
          // console.log('trabajando descansando actualizados');
        },
        error: (error) => {
          console.error('Error Actualizando los Tiempos', error);
          // Handle errors
        },
      });
  }
  // ACTUALIZAR INICIO DE SESION
  actualizarInicioSesion(startTime: string | null) {
    this.sesionpomodoroactual.startTime = startTime;
    this.pomodoroSessionService
      .updateSession(this.sesionpomodoroactual)
      .subscribe({
        next: () => {
          // console.log('Inicio actualizado');
        },
        error: (error) => {
          console.error('Error Actualizando los Tiempos', error);
          // Handle errors
        },
      });
  }
  // ACTUALIZAR FIN DE SESION
  actualizarFinSesion(endTime: string | null) {
    this.sesionpomodoroactual.endTime = endTime;
    this.pomodoroSessionService
      .updateSession(this.sesionpomodoroactual)
      .subscribe({
        next: () => {
          // console.log('fin actualizado');
        },
        error: (error) => {
          console.error('Error Actualizando los Tiempos', error);
          // Handle errors
        },
      });
  }
  // ACTUALIZAR CANTIDAD DE POMODOROS COMPLETADOS
  actualizarCantPomodorosSesion() {
    this.sesionpomodoroactual.completedPomodoros = this.pomodorosCompletados;
    this.pomodoroSessionService
      .updateSession(this.sesionpomodoroactual)
      .subscribe({
        next: () => {
          // console.log('cantidad pomodoros actualizada');
        },
        error: (error) => {
          console.error('Error Actualizando los Tiempos', error);
          // Handle errors
        },
      });
  }
  // ACTUALIZAR ESTADO DE LA SESION
  actualizarEstadoSesion(nuevoEstado: String) {
    this.sesionpomodoroactual.status = nuevoEstado;
    this.pomodoroSessionService
      .updateSession(this.sesionpomodoroactual)
      .subscribe({
        next: () => {
          // console.log('Estado Actualizado');
        },
        error: (error) => {
          console.error('Error Actualizando los Tiempos', error);
          // Handle errors
        },
      });
  }
  // ACTUALIZAR TIEMPOS DE LA SESION
  actualizarTiemposSesion() {
    this.sesionpomodoroactual.totalTimeElapsed = this.tiempoTotalseg; // totalTimeElapsed;
    this.sesionpomodoroactual.workTimeElapsed = this.tiempoTrabajoTotalseg; // workTimeElapsed;
    this.sesionpomodoroactual.breakTimeElapsed = this.tiempoDescansoTotalseg; //breakTimeElapsed;
    this.sesionpomodoroactual.remainingWorkTime = this.tiemporestanteTrabajoseg; // remainingWorkTime;
    this.sesionpomodoroactual.remainingBreakTime =
      this.tiemporestanteDescansoseg; // remainingBreakTime;
    this.sesionpomodoroactual.currentWorkTime = this.currentTimeTrabajoseg; // currentWorkTime;
    this.sesionpomodoroactual.currentBreakTime = this.currentTimeDescansoseg; //currentBreakTime;

    // console.log('Sesion a guardar');

    // console.log(this.sesionpomodoroactual);

    this.pomodoroSessionService
      .updateSession(this.sesionpomodoroactual)
      .subscribe({
        next: () => {
          // console.log('tiempos actualizados');
        },
        error: (error) => {
          console.error('Error Actualizando los Tiempos', error);
          // Handle errors
        },
      });
  }

  pausedSessionStart() {
    this.pauseSound(this.SonidoAlarma);
    this.pauseSound(this.SonidoReloj);

    if (this.templateTrabajoRef) {
      this.closeModal(this.templateTrabajoRef);
    }
    if (this.templateDescansoRef) {
      this.closeModal(this.templateDescansoRef);
    }
    this.actualizarEstadoSesion('Pausada');
    this.actualizarTiemposSesion();
    this.actualizarCantPomodorosSesion();
    this.actualizartrabajodescansoSesion();
    this.updateTrabajoBar();
    this.updateDescansoBar();

    //parar los contadores
    clearInterval(this.TiempoTotalTimerId);
    clearInterval(this.trabajoTimerId);
    clearInterval(this.descansoTimerId);
    clearInterval(this.otroTiempoId);
    clearInterval(this.guardarTiemposCadaMinutoId);

    if (this.templateSesionPausadaRef) {
      this.openModal(this.templateSesionPausadaRef);
    }
  }
  /// FUNCION PARA MANEJAR SESION ABANDONADA ///
  suspendedSessionStart() {
    let descripcion =
      'Se ABANDONO la sesion Pomodoro actual, para la tarea: ' +
      this.task.title;
    this.CrearPomodoroEvento(descripcion);

    this.pauseSound(this.SonidoAlarma);
    this.pauseSound(this.SonidoReloj);

    if (this.templateTrabajoRef) {
      this.closeModal(this.templateTrabajoRef);
    }
    if (this.templateDescansoRef) {
      this.closeModal(this.templateDescansoRef);
    }
    this.actualizarEstadoSesion('Abandonada');
    this.actualizarTiemposSesion();
    this.actualizarCantPomodorosSesion();
    this.actualizartrabajodescansoSesion();
    this.updateTrabajoBar();
    this.updateDescansoBar();

    //parar los contadores
    clearInterval(this.TiempoTotalTimerId);
    clearInterval(this.trabajoTimerId);
    clearInterval(this.descansoTimerId);
    clearInterval(this.otroTiempoId);
    clearInterval(this.guardarTiemposCadaMinutoId);

    if (this.templateSesionAbandonadaRef) {
      this.openModal(this.templateSesionAbandonadaRef);
    }
  }

  ContinuarSesion() {
    clearInterval(this.TiempoTotalTimerId);
    clearInterval(this.trabajoTimerId);
    clearInterval(this.descansoTimerId);
    clearInterval(this.otroTiempoId);
    clearInterval(this.guardarTiemposCadaMinutoId);

    this.cargarValoresGuardadosSesion();

    this.TiempoTotalTimerId = setInterval(() => {
      this.tiempoTotalseg++;
      this.tiempoTotalCompleto = this.convertSecondsToHours_Minutes_Seconds(
        this.tiempoTotalseg
      );
    }, 1000);

    let descripcion =
      'Se REANUDO la sesion Pomodoro, para la tarea: ' + this.task.title;
    this.CrearPomodoroEvento(descripcion);

    this.showToaster('¡Se reanudo la sesion exitosamente!', 'Info'); // Set toast message
    this.actualizarEstadoSesion('Corriendo');

    if (this.tiemporestanteDescansoseg == 0) {
      this.playSound(this.SonidoReloj);

      clearInterval(this.descansoTimerId);

      this.trabajando = true;
      this.descansando = false;
      this.actualizartrabajodescansoSesion();

      this.empezarNuevoPomodoro();
    } else if (this.tiemporestanteTrabajoseg == 0) {
      this.playSound(this.SonidoReloj);

      clearInterval(this.trabajoTimerId);
      this.trabajando = false;
      this.descansando = true;
      this.actualizartrabajodescansoSesion();

      this.startDescansoConteo();
      // this.startDescansoConteo();
    } else {
      this.startTimer();
    }
  }
  AbandonarSesion() {
    this.router.navigate(['events'], {
      queryParams: { selectedTaskId: this.task.idTask },
    });
  }
  // Funciones para los sonidos
  playSound(nombreSonido: string) {
    // Load the sound in your component or service

    if (nombreSonido == this.SonidoAlarma) {
      this.AlarmaisPlaying = true;
    }
    if (nombreSonido == this.SonidoReloj) {
      this.RelojisPlaying = true;
    }
    this.audioService.playSound(nombreSonido);
  }

  pauseSound(nombreSonido: string) {
    // Load the sound in your component or service (adjust path as needed)

    if (nombreSonido == this.SonidoAlarma) {
      this.AlarmaisPlaying = false;
    }
    if (nombreSonido == this.SonidoReloj) {
      this.RelojisPlaying = false;
    }
    this.audioService.pauseSound(nombreSonido);
  }
  HabilitarSonido() {
    let descripcion =
      'Se HABILITO EL SONIDO de la sesion Pomodoro, para la tarea: ' +
      this.task.title;
    this.CrearPomodoroEvento(descripcion);

    if (!this.RelojisPlaying) {
      this.playSound(this.SonidoReloj);
    }
  }
  DeshabilitarSonido() {
    let descripcion =
      'Se DESHABILITO EL SONIDO de la sesion Pomodoro, para la tarea: ' +
      this.task.title;
    this.CrearPomodoroEvento(descripcion);

    if (this.RelojisPlaying) {
      this.pauseSound(this.SonidoReloj);
    }
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
  CompletarTarea() {
    this.CrearEventoFinalizarTarea(this.task);
    if (this.task) {
      // console.log('Tarea seleccionada', this.selectedTask);
      const nuevatarea = this.task;
      nuevatarea.status = true;

      // Llamada al servicio para actualizar la tarea
      this.taskService.updateTask(nuevatarea).subscribe({
        next: () => {
          // this.CrearEventoFinalizarTarea(nuevatarea);
          this.showToaster('¡Tarea Completada exitosamente!', 'Success');
          // Actualizar las listas filtradas
          this.router.navigate(['tasks/eisenhower']);
        },
        error: (err) => {
          this.showToaster('¡Error al finalizar la Tarea!', 'Error');
        },
      });
    }
  }
  calcularTiempoEstimacion() {
    let pomodoros = this.sesionpomodoroactual.estimate;
    let tiempotrabajo: number = pomodoros * 25 * 60;
    let tiempodescanso: number;

    if (pomodoros != 4) {
      tiempodescanso = pomodoros * 5 * 60;
    } else {
      tiempodescanso = pomodoros * 5 * 60;
      tiempodescanso = tiempodescanso + 10 * 60;
    }

    this.tiempoTotalEstimacion = this.convertSecondsToHours_Minutes_Seconds(
      tiempotrabajo + tiempodescanso
    );
  }
  CrearPomodoroEvento(Descripcion: String) {
    let sesionActual = this.sesionpomodoroactual;

    const descripcion = Descripcion;

    const nowInMilliseconds = Date.now();
    const createdAt = new Date(nowInMilliseconds).toISOString();

    this.pomodoroEventService
      .postPomodoroEvent(sesionActual.idPomodoro, createdAt, descripcion)
      .subscribe();
  }
}
