import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientService } from 'src/app/services/client.service';
import { Client } from 'src/app/models/client.model';
import Swal from 'sweetalert2';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-client-form',
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.css'],
})
export class ClientFormComponent implements OnInit {
  @ViewChild('clientForm') clientForm!: NgForm;

  client: Client = {
    id: 0,
    names: '',
    email: '',
    cellPhone: '',
    address: '',
    dni: '',              // Inicializa el DNI vacío
    registrationDate: new Date(),
    status: 'A',
  };
  isEditMode: boolean = false;

  constructor(
    private clientService: ClientService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const clientId = this.route.snapshot.paramMap.get('id');
    if (clientId) {
      this.isEditMode = true;
      this.clientService.getClientById(Number(clientId)).subscribe(
        (data: Client) => (this.client = data),
        (error) => Swal.fire('Error', 'Error al cargar el cliente.', 'error')
      );
    }
  }

  submitForm(): void {
    this.clientForm.form.markAllAsTouched();

    if (this.clientForm.invalid) {
      Swal.fire('Error', 'Completa todos los campos obligatorios correctamente.', 'error');
      return;
    }

    this.isEditMode ? this.updateClient() : this.createClient();
  }

  private createClient(): void {
    this.clientService.createClient(this.client).subscribe(
      () => {
        Swal.fire('Éxito', 'Cliente creado con éxito.', 'success');
        this.router.navigate(['/clientes']);
      },
      (error) =>
        Swal.fire('Error', 'No se pudo crear el cliente. Por favor, verifica los datos ingresados.', 'error')
    );
  }

  private updateClient(): void {
    this.clientService.updateClient(this.client.id, this.client).subscribe(
      () => {
        Swal.fire('Éxito', 'Cliente actualizado con éxito.', 'success');
        this.router.navigate(['/clientes']);
      },
      (error) => Swal.fire('Error', 'No se pudo actualizar el cliente.', 'error')
    );
  }

  cancel(): void {
    this.router.navigate(['/clientes']);
  }
}
