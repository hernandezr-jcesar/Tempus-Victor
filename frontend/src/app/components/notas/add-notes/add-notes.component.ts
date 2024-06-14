import { Component, OnInit, ViewChild } from '@angular/core';
import { NoteService } from '../../../_services/note.service';
import { StorageService } from '../../../_services/storage.service';
import { Note } from '../../../models/note.model';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastMessageService } from '../../../_services/toast-message.service';

@Component({
  selector: 'app-add-notes',
  templateUrl: './add-notes.component.html',
  styleUrl: './add-notes.component.scss',
})
export class AddNotesComponent implements OnInit {
  note: Note = {} as Note;

  form: any = {
    title: '',
    content: '',
  };

  submitted = false;
  isSuccessful = false;
  errorMessage = '';
  isLoggedIn = false;
  userId?: number;

  constructor(
    private noteService: NoteService,
    private storageService: StorageService,
    private router: Router,
    private toastMessageService: ToastMessageService
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.storageService.isLoggedIn();
    // console.log(' is loged in: ' + this.isLoggedIn);
    if (!this.isLoggedIn) {
      this.storageService.clean();
      window.location.replace('/home');
    }
    if (this.isLoggedIn) {
      const user = this.storageService.getUser();
      this.userId = user.idUser;
      // console.log(this.authorId);
    }
  }
  @ViewChild('noteForm')
  noteForm!: NgForm; // Injects the reference

  onSubmit(): void {
    this.submitted = true; // Mark form as submitted for error handling

    // Check if form is valid before submitting
    if (this.noteForm.form.valid) {
      const { title, content } = this.form;
      // console.log('title:', title);
      // console.log('content:', content);

      const nowInMilliseconds = Date.now();
      // Format the date string in ISO 8601 format
      const createdAt = new Date(nowInMilliseconds).toISOString();
      // console.log(createdAt);
      if (this.userId) {
        this.noteService
          .createNote(createdAt, title, content, false, this.userId)
          .subscribe({
            next: () => {
              this.isSuccessful = true;
              // 'Success' | 'Error' | 'Info' | 'Warning'
              this.showToaster('¡Nota creada exitosamente!', 'Success'); // Set toast message

              this.router.navigate(['/notes']);
            },
            error: (err) => {
              this.errorMessage = err.error.message;
              this.isSuccessful = false;
              this.showToaster('¡Error al crear la nota!', 'Error');
            },
          });
      }
    }
  }

  Cancelar() {
    this.showToaster('¡No se creo la Nota!', 'Info'); // Set toast message
    this.router.navigate(['/notes']);
  }
  showToaster(mensaje: string, tipo: string) {
    this.toastMessageService.showtoast(mensaje, tipo);
  }
}
