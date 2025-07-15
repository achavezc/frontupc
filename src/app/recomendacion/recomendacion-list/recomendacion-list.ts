import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgZone } from '@angular/core';
import Swal from 'sweetalert2';

interface ComboItem {
  id: number;
  nombre: string;
}

interface Sistema {
  id: number;
  nombre: string;
}

interface ProyectoModulo {
  id: number;
  nombre: string;
}

interface Incidente {
  id: number;
  descripcion: string;
  sistema: Sistema;
  proyecto_modulo: ProyectoModulo;
}

export interface Recomendacion {
  id: number;
  recomendacion: string;
  incidente_id: number;
  prioridad_id: number;
  faseproyecto_id: number;
  tipoaccion_id: number;
  frecuencia_id: number;
  usuario_registro: string;
  fecha_registro: string;
  usuario_actualizacion?: string | null;
  fecha_actualizacion?: string | null;
  incidente: Incidente;
  prioridad: ComboItem;
  fase_proyecto: ComboItem;
  tipo_accion: ComboItem;
  frecuencia: ComboItem;
}

export interface CreateRecomendacionDto {
  recomendacion: string;
  incidente_id: number;
  prioridad_id: number;
  faseproyecto_id: number;
  tipoaccion_id: number;
  frecuencia_id: number;
  usuario_registro: string;
  fecha_registro: string;
  usuario_actualizacion?: string | null;
  fecha_actualizacion?: string | null;
}
@Component({
  standalone: true,
  selector: 'app-recomendacion-list',
  templateUrl: './recomendacion-list.html',
  styleUrls: ['./recomendacion-list.scss'],
  imports: [CommonModule, RouterModule, NgFor, NgIf, FormsModule]
})
export class RecomendacionListComponent implements OnInit {
  recomendaciones: Recomendacion[] = [];
  showSuccess = false;
  incidentes: any[] = [];
  prioridades: any[] = [];
  fases: any[] = [];
  tipoAcciones: any[] = [];
  frecuencias: any[] = [];

  newRecomendacion: CreateRecomendacionDto = {
    recomendacion: '',
    incidente_id: 0,
    prioridad_id: 0,
    faseproyecto_id: 0,
    tipoaccion_id: 0,
    frecuencia_id: 0,
    usuario_registro: 'admin',
    fecha_registro: '',
    usuario_actualizacion: 'admin',
    fecha_actualizacion: ''
  };

  isEditMode = false;
  editingId: number | null = null;
  errorMessages: string[] = [];

  constructor(private http: HttpClient,private zone: NgZone) {}

  ngOnInit(): void {
    this.loadRecomendaciones();
    this.loadCombos();
  }

loadRecomendaciones() {
  this.http.get<Recomendacion[]>('http://localhost:8000/recomendacion/?skip=0&limit=100')
    .subscribe(res => {
      this.zone.run(() => {
        this.recomendaciones = res;
      });
    });
}

  loadCombos() {
    this.http.get<any[]>('http://localhost:8000/clasificacion/incidentecombo').subscribe(res => this.incidentes = res);
    this.http.get<any[]>('http://localhost:8000/proyecto/prioridades').subscribe(res => this.prioridades = res);
    this.http.get<any[]>('http://localhost:8000/clasificacion/faseproyectos').subscribe(res => this.fases = res);
    this.http.get<any[]>('http://localhost:8000/recomendacion/combo/tipoaccion').subscribe(res => this.tipoAcciones = res);
    this.http.get<any[]>('http://localhost:8000/recomendacion/combo/frecuencia').subscribe(res => this.frecuencias = res);
  }

  newItem() {
    this.isEditMode = false;
    this.resetForm();
    this.openModal();
  }

  editItem(rec: Recomendacion) {
    this.isEditMode = true;
    this.editingId = rec.id;
    this.newRecomendacion = {
      recomendacion: rec.recomendacion,
      incidente_id: rec.incidente_id,
      prioridad_id: rec.prioridad_id,
      faseproyecto_id: rec.faseproyecto_id,
      tipoaccion_id: rec.tipoaccion_id,
      frecuencia_id: rec.frecuencia_id,
      usuario_registro: 'admin',
      fecha_registro: '',
      usuario_actualizacion: 'admin',
      fecha_actualizacion: ''
    };
    this.openModal();
  }

  deleteItem(id: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta recomendación se eliminará permanentemente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete(`http://localhost:8000/recomendacion/${id}`).subscribe(() => {
          this.loadRecomendaciones();
          Swal.fire({
            title: 'Eliminado',
            text: 'La recomendación ha sido eliminada correctamente.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
        });
      }
    });
  }

  submitForm() {
    const payload = { ...this.newRecomendacion };

    if (this.isEditMode && this.editingId !== null) {
      this.http.put(`http://localhost:8000/recomendacion/${this.editingId}`, payload)
        .subscribe({
          next: () => {
            this.closeModal();
            this.loadRecomendaciones();
            
                        Swal.fire({
                          icon: 'success',
                          title: 'Recomendación actualizado',
                          text: 'Recomendación actualizado correctamente.',
                          timer: 2000,
                          showConfirmButton: false
                        });
          },
          error: err => this.handleError(err)
        });
    } else {
      const now = this.getCurrentDateTime();
        this.newRecomendacion.fecha_registro = now;
        this.newRecomendacion.fecha_actualizacion = now;
        this.newRecomendacion.usuario_registro = 'admin';
        this.newRecomendacion.usuario_actualizacion = 'admin';
      this.http.post(`http://localhost:8000/recomendacion/`, payload)
        .subscribe({
          next: () => {
            this.closeModal();
            this.loadRecomendaciones();
            
              Swal.fire({
                          icon: 'success',
                          title: 'Recomendación registrado',
                          text: 'Recomendación registrado correctamente.',
                          timer: 2000,
                          showConfirmButton: false
                        });
          },
          error: err => this.handleError(err)
        });
    }
  }

  resetForm() {
    this.newRecomendacion = {
      recomendacion: '',
      incidente_id: 0,
      prioridad_id: 0,
      faseproyecto_id: 0,
      tipoaccion_id: 0,
      frecuencia_id: 0,
      usuario_registro: 'admin',
      fecha_registro: '',
      usuario_actualizacion: 'admin',
      fecha_actualizacion: ''
    };
  }

  handleError(err: any) {
    if (err.error?.detail && Array.isArray(err.error.detail)) {
      this.errorMessages = err.error.detail.map((e: any) => e.msg);
    } else {
      this.errorMessages = ['Error inesperado.'];
    }
  }

  openModal() {
    const modalEl = document.getElementById('newRecomendacionModal');
    if (modalEl) {
      const modal = new (window as any).bootstrap.Modal(modalEl);
      modal.show();
    }
  }
  getCurrentDateTime(): string {
    const now = new Date();
    return now.toISOString(); // ejemplo: "2025-07-13T20:45:00.000Z"
  }
  closeModal() {
    const modal = (window as any).bootstrap.Modal.getInstance(document.getElementById('newRecomendacionModal'));
    modal?.hide();
  }
}
