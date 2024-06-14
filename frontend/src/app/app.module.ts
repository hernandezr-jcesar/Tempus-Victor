import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { httpInterceptorProviders } from './_helpers/http.interceptor';
import { MatchPasswordDirective } from './directives/match-password.directive';

import { ToastrModule } from 'ngx-toastr';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { CuentaComponent } from './components/user/cuenta/cuenta.component';

import { NotesComponent } from './components/notas/notes/notes.component';
import { AddNotesComponent } from './components/notas/add-notes/add-notes.component';
import { SeeNotesComponent } from './components/notas/see-notes/see-notes.component';
import { EditNotesComponent } from './components/notas/edit-notes/edit-notes.component';
import { DelNotesComponent } from './components/notas/del-notes/del-notes.component';

import { EisenhowerTasksComponent } from './components/tareas/eisenhower-tasks/eisenhower-tasks.component';
import { CalendarTasksComponent } from './components/tareas/calendar-tasks/calendar-tasks.component';
import { AddTaskComponent } from './components/tareas/add-task/add-task.component';
import { SeeTaskComponent } from './components/tareas/see-task/see-task.component';
import { EditTaskComponent } from './components/tareas/edit-task/edit-task.component';
import { DelTaskComponent } from './components/tareas/del-task/del-task.component';

import { MetricsComponent } from './components/metricas/metrics/metrics.component';
import { ConfigComponent } from './components/config/config.component';
import { ToastComponent } from './components/toast/toast.component';
import { PomodoroComponent } from './components/Timer-Pomodoro/pomodoro/pomodoro.component';

import { PasswordModule } from 'primeng/password';
import { CalendarModule as PrimeNgCalendar } from 'primeng/calendar';
import { InputSwitchModule } from 'primeng/inputswitch';
import { DropdownModule } from 'primeng/dropdown';
import { ImageModule } from 'primeng/image';

import { DragDropModule } from '@angular/cdk/drag-drop';

import {
  CalendarModule as AngularCalendar,
  DateAdapter,
} from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

import { CommonModule } from '@angular/common';

import { FlatpickrModule } from 'angularx-flatpickr';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { EventsComponent } from './components/events/events.component';
import { FinalizadasComponent } from './components/tareas/finalizadas/finalizadas.component';
import { EstimacionPomodorosComponent } from './components/Timer-Pomodoro/estimacion-pomodoros/estimacion-pomodoros.component';
import { PadTo2DigitsPipe } from './_pipes/pad-to-2-digits.pipe';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TransformDatePipe } from './_pipes/transform-date.pipe';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

import { CarouselModule } from 'ngx-bootstrap/carousel';
import { MatSliderModule } from '@angular/material/slider';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ArchivadasComponent } from './components/notas/archivadas/archivadas.component';
import { EditUserComponent } from './components/user/edit-user/edit-user.component';

@NgModule({
  declarations: [
    AppComponent,
    MatchPasswordDirective,

    LoginComponent,
    RegisterComponent,
    HomeComponent,
    CuentaComponent,

    NotesComponent,
    AddNotesComponent,
    SeeNotesComponent,
    DelNotesComponent,
    EditNotesComponent,

    EisenhowerTasksComponent,
    CalendarTasksComponent,
    AddTaskComponent,
    SeeTaskComponent,
    EditTaskComponent,
    DelTaskComponent,

    MetricsComponent,
    ConfigComponent,
    ToastComponent,

    PomodoroComponent,
    EventsComponent,
    FinalizadasComponent,
    EstimacionPomodorosComponent,
    PadTo2DigitsPipe,
    TransformDatePipe,
    ArchivadasComponent,
    EditUserComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    ToastrModule.forRoot(), // Add ToastrModule.forRoot() here
    PasswordModule,
    DropdownModule,
    InputSwitchModule,
    DragDropModule,
    PrimeNgCalendar,
    ImageModule,
    FlatpickrModule.forRoot(),
    AngularCalendar.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    CommonModule,
    NgbModalModule,

    TooltipModule.forRoot(),
    ModalModule.forRoot(),
    CarouselModule.forRoot(),
    MatSliderModule,
    MatTooltipModule,
  ],
  providers: [
    httpInterceptorProviders,
    provideAnimationsAsync(),
    provideCharts(withDefaultRegisterables()),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor() {}
}
