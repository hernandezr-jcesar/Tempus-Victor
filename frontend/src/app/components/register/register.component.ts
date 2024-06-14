import { Component } from '@angular/core';
import { AuthService } from '../../_services/auth.service';
import { SettingService } from '../../_services/setting.service';
import { User } from '../../models/user.model';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  form: any = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private settingService: SettingService
  ) {}

  onSubmit(): void {
    const { username, email, password } = this.form;

    this.authService.register(username, email, password).subscribe({
      next: (newUser: User) => {
        //console.log(data);
        let work = 25 * 60;
        let shortBreak = 5 * 60;
        let longBreak = 15 * 60;
        let workImg = 0;
        let breakImg = 0;
        let neglectedImg = 0;
        let alarmSound = 0;
        let tictacSound = 0;

        this.settingService
          .postSetting(
            newUser.idUser,
            work,
            shortBreak,
            longBreak,
            workImg,
            breakImg,
            neglectedImg,
            alarmSound,
            tictacSound
          )
          .subscribe({});

        this.isSuccessful = true;
        this.isSignUpFailed = false;
      },
      error: (err) => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      },
    });
    console.log('Form submitted:', this.form.value); // For debugging purposes
  }
}
