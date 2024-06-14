import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Note } from '../../../models/note.model';
import { NoteService } from '../../../_services/note.service';
import { StorageService } from '../../../_services/storage.service';
import { NgForm } from '@angular/forms';
import { ToastMessageService } from '../../../_services/toast-message.service';

@Component({
  selector: 'app-edit-notes',
  templateUrl: './edit-notes.component.html',
  styleUrl: './edit-notes.component.scss',
})
export class EditNotesComponent {
  note: Note = {} as Note;

  form: any = {
    titulo: '',
    descripcion: '',
  };

  submitted = false;
  isSuccessful = false;
  errorMessage = '';
  isLoggedIn = false;
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

  @ViewChild('noteForm')
  noteForm!: NgForm; // Injects the reference

  onSubmit(): void {
    this.submitted = true; // Mark form as submitted for error handling

    // Check if form is valid before submitting
    if (this.noteForm.form.valid) {
      this.noteService.updateNote(this.note).subscribe({
        next: () => {
          this.showToaster('¡Nota Actualizada exitosamente!', 'Success'); // Set toast message

          this.isSuccessful = true;
          this.router.navigate(['/notes']);
        },
        error: (err) => {
          this.errorMessage = err.error.message;
          this.isSuccessful = false;
          this.showToaster('¡Error al actualizar la nota!', 'Error'); // Set toast message
        },
      });
    }
  }
  Cancelar() {
    this.showToaster('¡No se actualizo la Nota!', 'Info'); // Set toast message
    this.router.navigate(['/notes']);
  }
  showToaster(mensaje: string, tipo: string) {
    this.toastMessageService.showtoast(mensaje, tipo);
  }
}
