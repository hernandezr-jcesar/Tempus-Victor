import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { CuentaComponent } from './components/user/cuenta/cuenta.component';

import { MetricsComponent } from './components/metricas/metrics/metrics.component';
import { ConfigComponent } from './components/config/config.component';

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

import { PomodoroComponent } from './components/Timer-Pomodoro/pomodoro/pomodoro.component';
import { EstimacionPomodorosComponent } from './components/Timer-Pomodoro/estimacion-pomodoros/estimacion-pomodoros.component';
import { EventsComponent } from './components/events/events.component';
import { FinalizadasComponent } from './components/tareas/finalizadas/finalizadas.component';
import { ArchivadasComponent } from './components/notas/archivadas/archivadas.component';
import { EditUserComponent } from './components/user/edit-user/edit-user.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: CuentaComponent },
  { path: 'edit-user', component: EditUserComponent },

  { path: 'notes', component: NotesComponent },
  { path: 'add-notes', component: AddNotesComponent },
  { path: 'see-notes', component: SeeNotesComponent },
  { path: 'edit-notes', component: EditNotesComponent },
  { path: 'del-notes', component: DelNotesComponent },
  { path: 'archivadas', component: ArchivadasComponent },

  { path: 'tasks/eisenhower', component: EisenhowerTasksComponent },
  { path: 'tasks/calendar', component: CalendarTasksComponent },
  { path: 'add-task', component: AddTaskComponent },
  { path: 'see-task', component: SeeTaskComponent },
  { path: 'edit-task', component: EditTaskComponent },
  { path: 'del-task', component: DelTaskComponent },

  { path: 'events', component: EventsComponent },
  { path: 'estimacion-pomodoros', component: EstimacionPomodorosComponent },
  { path: 'pomodoro', component: PomodoroComponent },
  { path: 'finalizadas', component: FinalizadasComponent },

  { path: 'metrics', component: MetricsComponent },
  { path: 'config', component: ConfigComponent },

  { path: '', redirectTo: 'home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
