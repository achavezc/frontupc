import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgZone } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import Swal from 'sweetalert2';

interface ComboOption {
  id: number;
  nombre: string; // para faseproyecto, impacto, tipo
}

interface IncidenteOption {
  id: number;
  descripcion: string;
}

interface Clasificacion {
  id?: number;
  incidente_id: number | null;
  faseproyecto_id: number | null;
  impacto_id: number | null;
  tipo_id: number | null;
  faseproyecto : ComboOption;
  impacto : ComboOption;
  tipo : ComboOption;
  incidente : IncidenteOption;
  usuario_registro: string;
  fecha_registro: string;
  usuario_actualizacion: string;
  fecha_actualizacion: string;
}
interface CreateClasificacion {
  id?: number;
  incidente_id: number | null;
  faseproyecto_id: number | null;
  impacto_id: number | null;
  tipo_id: number | null;
  usuario_registro: string;
  fecha_registro: string;
  usuario_actualizacion: string;
  fecha_actualizacion: string;
}

@Component({
  standalone: true,
  selector: 'app-clasificacion-list',
  templateUrl: './clasificacion-list.html',
  styleUrls: ['./clasificacion-list.scss'],
  imports: [CommonModule, RouterModule, NgFor, NgIf, FormsModule]
})
export class ClasificacionListComponent implements OnInit {
  showSuccess = false;
  clasificaciones: Clasificacion[] = [];
  incidentes: IncidenteOption[] = [];
  fases: ComboOption[] = [];
  impactos: ComboOption[] = [];
  tipos: ComboOption[] = [];
  errorMessages: string[] = [];
  toastMessage: string | null = null;

  isEditMode = false;
  editingId: number | null = null;

  newClasificacion: CreateClasificacion = {
    incidente_id: null,
    faseproyecto_id: null,
    impacto_id: null,
    tipo_id: null,
    usuario_registro: 'admin',
    fecha_registro: '',
    usuario_actualizacion: 'admin',
    fecha_actualizacion: ''
  };

  constructor(private http: HttpClient,private zone: NgZone,private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadClasificaciones();
    this.loadCombos();
  }

  loadClasificaciones() {
    this.http.get<Clasificacion[]>('http://localhost:8000/clasificacion/')
      .subscribe(res => {
        this.zone.run(() => {
          this.clasificaciones = res;
        });
      });
  }


  loadCombos() {
    this.http.get<IncidenteOption[]>('http://localhost:8000/clasificacion/incidentecombo').subscribe(res => this.incidentes = res);
    this.http.get<ComboOption[]>('http://localhost:8000/clasificacion/faseproyectos').subscribe(res => this.fases = res);
    this.http.get<ComboOption[]>('http://localhost:8000/clasificacion/impactos').subscribe(res => this.impactos = res);
    this.http.get<ComboOption[]>('http://localhost:8000/clasificacion/tipos').subscribe(res => this.tipos = res);
  }

  openModal() {
    const modalEl = document.getElementById('newClasificacionModal');
    if (modalEl) {
      const modal = new (window as any).bootstrap.Modal(modalEl);
      modal.show();
    }
  }

  closeModal() {
    const modal = (window as any).bootstrap.Modal.getInstance(document.getElementById('newClasificacionModal'));
    modal?.hide();
  }

  newItem() {
    this.resetForm();
    this.isEditMode = false;
    this.errorMessages = [];
    this.openModal();
  }

  editItem(item: CreateClasificacion) {
    this.newClasificacion = { ...item }; // ahora no da error
    this.editingId = item.id!;
    this.isEditMode = true;
    this.openModal();
  }


  deleteItem(id: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta clasificación se eliminará permanentemente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete(`http://localhost:8000/clasificacion/${id}`).subscribe(() => {
          this.loadClasificaciones();
          Swal.fire({
            title: 'Eliminado',
            text: 'La clasificación ha sido eliminada correctamente.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
        });
      }
    });
  }
  submit() {
    this.errorMessages = [];

    if (this.isEditMode && this.editingId !== null) {
      this.http.put(`http://localhost:8000/clasificacion/${this.editingId}`, this.newClasificacion)
        .subscribe({
          next: () => {
            this.closeModal();
            this.loadClasificaciones();
            // this.showToast('Clasificación actualizado correctamente.');
                 // Mostrar éxito
            Swal.fire({
              icon: 'success',
              title: 'Clasificación actualizado',
              text: 'Clasificación actualizado correctamente.',
              timer: 2000,
              showConfirmButton: false
            });
          },
          error: err => this.handleApiError(err)
        });
    } else {
         const now = this.getCurrentDateTime();
        this.newClasificacion.fecha_registro = now;
        this.newClasificacion.fecha_actualizacion = now;
        this.newClasificacion.usuario_registro = 'admin';
        this.newClasificacion.usuario_actualizacion = 'admin';
      this.http.post(`http://localhost:8000/clasificacion/`, this.newClasificacion)
        .subscribe({
          next: () => {
            this.closeModal();
            this.loadClasificaciones();
              Swal.fire({
              icon: 'success',
              title: 'Clasificación registrado',
              text: 'Clasificación registrado correctamente.',
              timer: 2000,
              showConfirmButton: false
            });
          },
          error: err => this.handleApiError(err)
        });
    }
  }

  resetForm() {
    this.newClasificacion = {
      incidente_id: null,
      faseproyecto_id: null,
      impacto_id: null,
      tipo_id: null,
      usuario_registro: 'admin',
      fecha_registro: '',
      usuario_actualizacion: 'admin',
      fecha_actualizacion: ''
    };
    this.editingId = null;
  }
  getCurrentDateTime(): string {
    const now = new Date();
    return now.toISOString(); // ejemplo: "2025-07-13T20:45:00.000Z"
  }
  handleApiError(err: any) {
    if (err.error?.detail && Array.isArray(err.error.detail)) {
      this.errorMessages = err.error.detail.map((e: any) => e.msg);
    } else {
      this.errorMessages = ['Error desconocido al procesar la solicitud.'];
    }
  }
}
