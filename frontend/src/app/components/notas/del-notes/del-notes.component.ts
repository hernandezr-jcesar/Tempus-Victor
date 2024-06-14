import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Note } from '../../../models/note.model';
import { NoteService } from '../../../_services/note.service';
import { StorageService } from '../../../_services/storage.service';
import { ToastMessageService } from '../../../_services/toast-message.service';

@Component({
  selector: 'app-del-notes',
  templateUrl: './del-notes.component.html',
  styleUrl: './del-notes.component.scss',
})
export class DelNotesComponent {
  note: Note = {} as Note;

  submitted = false;
  isSuccessful = false;
  errorMessage = '';
  isLoggedIn = false;

  persona_id?: number;
  currentUser: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private noteService: NoteService,
    private storageService: StorageService,
    private toastMessageService: ToastMessageService
  ) {}

  ngOnInit() {
    const selectedNoteId = this.route.snapshot.queryParams['selectedNoteId'];
    // console.log('Note ID: ' + selectedNoteId);

    this.isLoggedIn = this.storageService.isLoggedIn();
    if (!this.isLoggedIn) {
      this.storageService.clean();
      window.location.replace('/home');
    }
    if (this.isLoggedIn) {
      this.currentUser = this.storageService.getUser();
      this.persona_id = this.currentUser.id_persona;

      // // Update the service call to retrieve a single note
      // this.notesService;

      this.noteService.getOneNote(selectedNoteId as number).subscribe({
        next: (note: Note) => {
          this.note = note;
          // console.log(this.note);
        },
        error: (error) => {
          console.error('Error fetching note:', error);
          // Handle errors
        },
        complete: () => {
          // Handle completion if needed
        },
      });
    }
  }

  onSubmit(): void {
    this.submitted = true; // Mark form as submitted for error handling
    // console.log(this.note.id_nota);

    this.noteService.deleteNote(this.note.idNote).subscribe({
      next: () => {
        this.showToaster('Nota Eliminada Correctamente', 'Success');
        this.isSuccessful = true;
        this.router.navigate(['/notes']);
      },
      error: (err) => {
        this.errorMessage = err.error.message;
        this.isSuccessful = false;
      },
    });
  }
  Cancelar() {
    this.showToaster('¡No se elimino la nota!', 'Info'); // Set toast message

    this.router.navigate(['/notes']);
  }
  showToaster(mensaje: string, tipo: string) {
    this.toastMessageService.showtoast(mensaje, tipo);
  }
}
