import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Note } from '../../../models/note.model';
import { NoteService } from '../../../_services/note.service';
import { StorageService } from '../../../_services/storage.service';

@Component({
  selector: 'app-see-notes',
  templateUrl: './see-notes.component.html',
  styleUrl: './see-notes.component.scss',
})
export class SeeNotesComponent {
  note: Note = {} as Note;

  currentUser: any;
  isLoggedIn = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private noteService: NoteService,
    private storageService: StorageService
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
          console.error('Error obteniendo la nota:', error);
          // Handle errors
        },
        complete: () => {
          // Handle completion if needed
        },
      });
    }
  }

  Cancelar() {
    this.router.navigate(['/notes']);
  }
}
