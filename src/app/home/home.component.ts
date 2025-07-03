import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';

interface Actor {
  id: number;
  firstName: string;
  lastName: string;
  lastUpdate: string;
  filmCount: number;
}

@Component({
  selector: 'app-actor-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class ActorListComponent implements OnInit {
  actors: Actor[] = [];

  ngOnInit(): void {
    this.actors = [
      { id: 182, firstName: 'DEBBIE', lastName: 'AKROYD', lastUpdate: '15 February 2006 4:34 am', filmCount: 24 },
      { id: 58, firstName: 'CHRISTIAN', lastName: 'AKROYD', lastUpdate: '15 February 2006 4:34 am', filmCount: 32 },
      { id: 92, firstName: 'KIRSTEN', lastName: 'AKROYD', lastUpdate: '15 February 2006 4:34 am', filmCount: 34 },
      // Agrega más actores aquí...
    ];
  }

  view(actor: Actor) {
    alert(`Ver actor: ${actor.firstName}`);
  }

  edit(actor: Actor) {
    alert(`Editar actor: ${actor.firstName}`);
  }

  delete(actor: Actor) {
    if (confirm(`¿Eliminar actor ${actor.firstName}?`)) {
      this.actors = this.actors.filter(a => a.id !== actor.id);
    }
  }
}
