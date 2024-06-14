import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Note } from '../../../models/note.model';
import { NoteService } from '../../../_services/note.service';
import { StorageService } from '../../../_services/storage.service';
import { Router } from '@angular/router';
import { ToastMessageService } from '../../../_services/toast-message.service';

@Component({
  selector: 'app-archivadas',
  templateUrl: './archivadas.component.html',
  styleUrl: './archivadas.component.scss',
})
export class ArchivadasComponent {
  notes: Note[] = [];
  searchText: string = ''; // String to store search term
  filteredNotes: Note[] = []; // Property to store the filtered notes

  toSendNote: Note = {} as Note;
  // selectedNote: Note = {} as Note;

  selectedNote: Note | null = null; // Variable para almacenar la nota seleccionada

  showButtons: boolean = false;
  currentUser: any;
  isLoggedIn = false;
  isSingleSelected = false;

  constructor(
    private router: Router,
    private noteService: NoteService,
    private storageService: StorageService,
    private toastMessageService: ToastMessageService,
    private changeDetector: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    this.isLoggedIn = this.storageService.isLoggedIn();
    if (!this.isLoggedIn) {
      this.storageService.clean();
      window.location.replace('/home');
    }
    if (this.isLoggedIn) {
      this.currentUser = this.storageService.getUser();

      this.noteService
        .getArchivedNotes(this.currentUser.idUser)
        .subscribe((data: Note[]) => {
          this.notes = data;

          this.filteredNotes = this.notes; // Initially show all notes
          this.selectedNote = null; // Reset for clarity
          this.showButtons = false; // Reset for clarity
          // console.log('Notas:');
          // console.log(this.notes);
        });
    }
  }

  onNoteClick(note: Note) {
    this.selectedNote = note;
    this.toSendNote = note;
    this.showButtons = true;
    // console.log(note);
    setTimeout(() => {
      this.onNoteDeselect();
    }, 10000); // Deseleccionar después de 10 segundos
  }

  onNoteDeselect() {
    this.selectedNote = null;
    this.showButtons = false;
  }

  showToaster(mensaje: string, tipo: string) {
    this.toastMessageService.showtoast(mensaje, tipo);
  }

  onSearchChange(event: Event) {
    const inputElement = event.target as HTMLInputElement; // Cast to HTMLInputElement
    const searchText = inputElement.value.toLowerCase(); // Access the value property

    // Directly use searchText for filtering
    this.filteredNotes = this.notes.filter((note) => {
      const lowerTitle = note.title.toLowerCase(); // Convert title to lowercase
      const lowerContent = note.description?.toLowerCase(); // Convert content to lowercase (optional chaining)

      // Case-insensitive matching using includes
      return (
        lowerTitle.includes(searchText) ||
        (lowerContent && lowerContent.includes(searchText))
      );
    });
    // console.log(this.filteredNotes);
  }
  // ACCION QUE REALIZA EL MODAL SI SE DA CLICK EN EL BOTON CANCELAR
  CancelarModal() {
    // console.log('Cancelar');
    // 'Success' | 'Error' | 'Info' | 'Warning'
    this.showToaster('¡Acción Cancelada!', 'Info'); // Set toast message
  }
  onArchivarNota() {
    if (this.selectedNote) {
      // console.log(this.selectedNote);
      this.selectedNote.archived = false;
      this.noteService.updateNote(this.selectedNote).subscribe({
        next: () => {
          this.showToaster('¡Nota Actualizada exitosamente!', 'Success'); // Set toast message
          this.actualizarListaNotas();
          this.changeDetector.detectChanges();
        },
        error: (err) => {
          this.showToaster('¡Error al actualizar la nota!', 'Error'); // Set toast message
        },
      });
    }
  }
  Regresar() {
    this.router.navigate(['notes']);
  }
  actualizarListaNotas() {
    this.noteService
      .getArchivedNotes(this.currentUser.idUser)
      .subscribe((data: Note[]) => {
        this.notes = data;

        this.filteredNotes = this.notes; // Initially show all notes
        this.selectedNote = null; // Reset for clarity
        this.showButtons = false; // Reset for clarity
        // console.log('Notas:');
        // console.log(this.notes);
      });
  }
}
