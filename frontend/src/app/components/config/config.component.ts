import {
  Component,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
  ElementRef,
} from '@angular/core';

import {
  FormGroup,
  FormControl,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { StorageService } from '../../_services/storage.service';
import { ToastMessageService } from '../../_services/toast-message.service';
import { SettingService } from '../../_services/setting.service';
import { Setting } from '../../models/setting.model';
import { AudioOnceService } from '../../_services/audio-once.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrl: './config.component.scss',
})
export class ConfigComponent implements OnInit {
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
  startImageAbandonado: any;
  startImageTrabajo: any;
  startImageDescanso: any;

  selectedImageAbandonado: any;
  selectedImageTrabajo: any;
  selectedImageDescanso: any;

  slideChangeMessage = '';

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
      src: '../../../assets/Sounds/AudiosRecortados/SonidoTicTac_1.mp3',
    },
    {
      value: 'Sonido2',
      src: '../../../assets/Sounds/AudiosRecortados/SonidoTicTac_2.mp3',
    },
    {
      value: 'Sonido3',
      src: '../../../assets/Sounds/AudiosRecortados/SonidoTicTac_3.mp3',
    },
    {
      value: 'Sonido4',
      src: '../../../assets/Sounds/AudiosRecortados/SonidoTicTac_4.mp3',
    },
  ];
  @ViewChild('alarmSoundSelect')
  alarmSoundSelect!: ElementRef<HTMLSelectElement>;

  startAlarmSound: any;
  selectedAlarmSound: any;

  startTicTacSound: any;
  selectedTicTacSound: any;

  previouslyAlarmSelectedSound: string | null = null; // Track previously selected sound
  previouslyTicTacSelectedSound: string | null = null; // Track previously selected sound

  // volume = 0.5; // Initial volume (0-1)
  // maxVolume = 100;
  // minVolume = 0;
  // volumeStep = 1;

  // volumenAlarma = 51;
  // volumenTicTac = 52;

  configForm!: FormGroup;

  UserSetting: Setting = {} as Setting;
  newSetting: Setting = {} as Setting;

  currentUser: any;
  isLoggedIn = false;
  trabajoenMin: number = 0;
  descansoCortoenMin: number = 0;
  descansoLargoenMin: number = 0;

  // constructor(private configService: ConfigService) {}
  constructor(
    private storageService: StorageService,
    private toastMessageService: ToastMessageService,
    private settingService: SettingService,
    private formBuilder: FormBuilder,
    private cdRef: ChangeDetectorRef,
    private audioOnceService: AudioOnceService,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.storageService.isLoggedIn();
    if (!this.isLoggedIn) {
      this.storageService.clean();
      window.location.replace('/home');
      return;
    }

    this.Alarmsounds.forEach(async (sound) => {
      await this.audioOnceService.loadSound(sound.value, sound.src);
    });
    this.TicTacsounds.forEach(async (sound) => {
      await this.audioOnceService.loadSound(sound.value, sound.src);
    });

    this.showToaster('Bienvenido a Configuración', 'Info');
    // Populate form controls with default values (if retrieved settings are undefined)
    this.configForm = this.formBuilder.group({
      trabajo: [''],
      descansoCorto: [''],
      descansoLargo: [''],
      alarmSound: [''],
      TicTacSound: [''],
      volumenAlarma: [''],
      volumenTicTac: [''],
    });

    this.currentUser = this.storageService.getUser();

    this.settingService.getSetting(this.currentUser.idUser).subscribe({
      next: (currentSetting: Setting) => {
        this.UserSetting = currentSetting;
        console.log(currentSetting);
        this.newSetting = this.UserSetting;
        // console.log(this.UserSetting.pomodoroWorkDuration);

        // this.trabajoenMin = this.UserSetting.pomodoroWorkDuration / 60;
        // this.descansoCortoenMin = this.UserSetting.shortBreakDuration / 60;
        // this.descansoLargoenMin = this.UserSetting.longBreakDuration / 60;

        this.configForm.patchValue({
          trabajo: currentSetting.pomodoroWorkDuration / 60,
          descansoCorto: currentSetting.shortBreakDuration / 60,
          descansoLargo: currentSetting.longBreakDuration / 60,
          alarmSound: this.Alarmsounds[currentSetting.alarmSound]
            ? this.Alarmsounds[currentSetting.alarmSound].value
            : 'none',
          TicTacSound: this.TicTacsounds[currentSetting.tictacSound]
            ? this.TicTacsounds[currentSetting.tictacSound].value
            : 'none',
        });
        this.changeDetectorRef.detectChanges();

        this.startImageAbandonado = this.UserSetting.neglectedImg;
        this.startImageTrabajo = this.UserSetting.workImg;
        this.startImageDescanso = this.UserSetting.breakImg;

        this.startAlarmSound = this.UserSetting.alarmSound;
        this.startTicTacSound = this.UserSetting.tictacSound;
        this.changeDetectorRef.detectChanges();
        // console.log(this.trabajoenMin);
        // console.log(this.descansoCortoenMin);
        // console.log(this.descansoLargoenMin);
      },
      error: (error) => {
        console.error('Error obteniendo el servicio:', error);
        // Handle errors
      },
      // console.log(this.UserSetting);
    });

    // this.cargarConfiguracion();
  }

  CancelarModal() {
    // console.log('Cancelar');
    // 'Success' | 'Error' | 'Info' | 'Warning'
    this.showToaster('¡Acción Cancelada!', 'Info'); // Set toast message
  }
  logAbandonado(event: number) {
    // simple hack for expression has been changed error
    setTimeout(() => {
      let i = event;
      this.selectedImageAbandonado = i;
      // this.selectedImageAbandonado = this.imagenesAbandonado[i];
      // console.log(this.selectedImageAbandonado);
    });
  }
  logDescanso(event: number) {
    // simple hack for expression has been changed error
    setTimeout(() => {
      let i = event;
      this.selectedImageDescanso = i;
      // this.selectedImageDescanso = this.imagenesDescanso[i];
      // console.log(this.selectedImageDescanso);
    });
  }
  logTrabajo(event: number) {
    // simple hack for expression has been changed error
    setTimeout(() => {
      let i = event;
      this.selectedImageTrabajo = i;
      // this.selectedImageTrabajo = this.imagenesTrabajo[i];
      // console.log(this.selectedImageTrabajo);
    });
  }

  async onSubmit() {
    this.showToaster('Configuración Guardada Correctamente', 'Success');
    // console.log(this.trabajoenMin);
    // console.log(this.descansoCortoenMin);
    // console.log(this.descansoLargoenMin);

    // console.log(this.selectedImageAbandonado);
    // console.log(this.selectedImageDescanso);
    // console.log(this.selectedImageTrabajo);
    if (this.configForm.valid) {
      const config: Setting = this.configForm.value;
      // console.log(tarea);

      const { trabajo, descansoCorto, descansoLargo } = this.configForm.value;
      // console.log(trabajo, descansoCorto, descansoLargo);

      this.newSetting.pomodoroWorkDuration = trabajo * 60;
      this.newSetting.shortBreakDuration = descansoCorto * 60;
      this.newSetting.longBreakDuration = descansoLargo * 60;
      this.newSetting.neglectedImg = this.selectedImageAbandonado;
      this.newSetting.breakImg = this.selectedImageDescanso;
      this.newSetting.workImg = this.selectedImageTrabajo;
      this.newSetting.alarmSound = this.selectedAlarmSound;
      this.newSetting.tictacSound = this.selectedTicTacSound;
      console.log(this.newSetting);

      this.settingService.putSetting(this.newSetting).subscribe({
        next: (setting) => {
          console.log(setting);
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }

  async onSelectAlarmSound(event: Event) {
    event.preventDefault(); // Prevent default behavior (optional)
    const selectedValue = (event.target as HTMLSelectElement).value;

    let selectedIndex = -1; // Initialize with -1

    // Handle "Ningún sonido" explicitly
    if (selectedValue === 'none') {
      selectedIndex = 4; // Set index to 4 for "Ningún sonido"
    } else {
      // Find the index for other options (excluding "Ningún sonido")
      selectedIndex = this.Alarmsounds.findIndex(
        (sound) => sound.value === selectedValue
      );
    }

    this.selectedAlarmSound = selectedIndex;
    // console.log('Selected value:', selectedValue);
    // console.log('Selected index:', selectedIndex);

    if (
      this.previouslyTicTacSelectedSound &&
      this.previouslyTicTacSelectedSound !== 'none'
    ) {
      // Pause the previously playing sound (if any)
      this.audioOnceService.pauseSound(this.previouslyTicTacSelectedSound);
    }
    if (
      this.previouslyAlarmSelectedSound &&
      this.previouslyAlarmSelectedSound !== 'none'
    ) {
      // Pause the previously playing sound (if any)
      this.audioOnceService.pauseSound(this.previouslyAlarmSelectedSound);
    }

    // Play the newly selected sound
    this.audioOnceService.playSound(selectedValue);

    this.previouslyAlarmSelectedSound = selectedValue; // Update for future reference
  }

  async onSelectTicTacSound(event: Event) {
    event.preventDefault(); // Prevent default behavior (optional)
    const selectedValue = (event.target as HTMLSelectElement).value;

    let selectedIndex = -1; // Initialize with -1

    // Handle "Ningún sonido" explicitly
    if (selectedValue === 'none') {
      selectedIndex = 4; // Set index to 4 for "Ningún sonido"
    } else {
      // Find the index for other options (excluding "Ningún sonido")
      selectedIndex = this.TicTacsounds.findIndex(
        (sound) => sound.value === selectedValue
      );
    }
    this.selectedTicTacSound = selectedIndex;
    // console.log('Selected value:', selectedValue);
    // console.log('Selected index:', selectedIndex);

    if (
      this.previouslyTicTacSelectedSound &&
      this.previouslyTicTacSelectedSound !== 'none'
    ) {
      // Pause the previously playing sound (if any)
      this.audioOnceService.pauseSound(this.previouslyTicTacSelectedSound);
    }
    if (
      this.previouslyAlarmSelectedSound &&
      this.previouslyAlarmSelectedSound !== 'none'
    ) {
      // Pause the previously playing sound (if any)
      this.audioOnceService.pauseSound(this.previouslyAlarmSelectedSound);
    }

    // Play the newly selected sound
    this.audioOnceService.playSound(selectedValue);

    this.previouslyTicTacSelectedSound = selectedValue; // Update for future reference
  }
  onResetValues() {
    this.showToaster('Valores Reseteados Correctamente', 'Success');

    this.newSetting.pomodoroWorkDuration = 25 * 60;
    this.newSetting.shortBreakDuration = 5 * 60;
    this.newSetting.longBreakDuration = 15 * 60;
    this.newSetting.neglectedImg = 0;
    this.newSetting.breakImg = 0;
    this.newSetting.workImg = 0;
    this.newSetting.alarmSound = 0;
    this.newSetting.tictacSound = 0;

    this.settingService.putSetting(this.newSetting).subscribe({
      next: (setting) => {
        console.log(setting);
      },
      error: (err) => {
        console.log(err);
      },
    });

    this.configForm.patchValue({
      trabajo: this.newSetting.pomodoroWorkDuration / 60,
      descansoCorto: this.newSetting.shortBreakDuration / 60,
      descansoLargo: this.newSetting.longBreakDuration / 60,
      alarmSound: this.Alarmsounds[this.newSetting.alarmSound]
        ? this.Alarmsounds[this.newSetting.alarmSound].value
        : 'none',
      TicTacSound: this.TicTacsounds[this.newSetting.tictacSound]
        ? this.TicTacsounds[this.newSetting.tictacSound].value
        : 'none',
    });
    this.changeDetectorRef.detectChanges();

    this.startImageAbandonado = this.newSetting.neglectedImg;
    this.startImageTrabajo = this.newSetting.workImg;
    this.startImageDescanso = this.newSetting.breakImg;

    this.startAlarmSound = this.newSetting.alarmSound;
    this.startTicTacSound = this.newSetting.tictacSound;

    this.changeDetectorRef.detectChanges();
  }
  Regresar() {
    this.showToaster('!Salio De Configuración del Sistema!', 'Info');
    this.router.navigate(['tasks/eisenhower']);
  }

  showToaster(mensaje: string, tipo: string) {
    this.toastMessageService.showtoast(mensaje, tipo);
  }
}
