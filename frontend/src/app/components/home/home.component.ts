import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../_services/storage.service';
import { UserService } from '../../_services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  content?: string;
  isLoggedIn = false;

  constructor(
    private userService: UserService,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.storageService.isLoggedIn();
    // if (this.isLoggedIn) {
    //   const user = this.storageService.getUser();
    // }
    // this.userService.getPublicContent().subscribe({
    //   next: (data) => {
    //     this.content = data;
    //     console.log(this.content);
    //   },
    //   error: (err) => {
    //     console.log(err);
    //     if (err.error) {
    //       this.content = JSON.parse(err.error).message;
    //     } else {
    //       this.content = 'Error with status: ' + err.status;
    //     }
    //   },
    // });
  }
}
