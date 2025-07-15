import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgZone } from '@angular/core';
import Swal from 'sweetalert2';

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
  fecha: string;
  hora: string;
  sistema_id: number;
  proyectomodulo_id: number;
  usuario_reportador: string;
  descripcion: string;
  tiempo_estimado: number;
  fecha_solucion: string;
  hora_solucion: string;
  usuario_registro: string;
  fecha_registro: string;
  usuario_actualizacion: string;
  fecha_actualizacion: string;
  sistema: Sistema;
  proyecto_modulo: ProyectoModulo;
}

interface CreateIncidenteDto {
  fecha: string;
  hora: string;
  sistema_id: number;
  proyectomodulo_id: number;
  usuario_reportador: string;
  descripcion: string;
  tiempo_estimado: number;
  fecha_solucion: string;
  hora_solucion: string;
  usuario_registro: string;
  fecha_registro: string;
  usuario_actualizacion: string;
  fecha_actualizacion: string;
}

@Component({
  standalone: true,
  selector: 'app-incidente-list',
  templateUrl: './incidente-list.html',
  styleUrls: ['./incidente-list.scss'],
  imports: [CommonModule, RouterModule, NgFor, NgIf, FormsModule]
})


export class IncidenteListComponent implements OnInit {

  incidentes: Incidente[] = [];
  sistemas: Sistema[] = [];
  modulos: ProyectoModulo[] = [];
  showSuccess = false;
  newIncidente: CreateIncidenteDto = {
    fecha: '',
    hora: '',
    sistema_id: 0,
    proyectomodulo_id: 0,
    usuario_reportador: '',
    descripcion: '',
    tiempo_estimado: 0,
    fecha_solucion: '',
    hora_solucion: '',
    usuario_registro: 'admin',
    fecha_registro: '',
    usuario_actualizacion: 'admin',
    fecha_actualizacion: ''
  };

  isEditMode = false;
  editingId: number | null = null;
  errorMessages: string[] = [];

  constructor(private http: HttpClient,private zone: NgZone) {}

  ngOnInit() {
    this.loadIncidentes();
    this.loadCombos();
  }


  loadIncidentes() {
    this.http.get<Incidente[]>('http://localhost:8000/incidente/incidentes')
      .subscribe(res => {
        this.zone.run(() => {
          this.incidentes = res;
        });
      });
  }

  loadCombos() {
    this.http.get<Sistema[]>('http://localhost:8000/incidente/sistemas')
      .subscribe(res => this.sistemas = res);

    this.http.get<ProyectoModulo[]>('http://localhost:8000/incidente/proyectos-modulo')
      .subscribe(res => this.modulos = res);
  }

  newEntry() {
    this.resetForm();
    this.isEditMode = false;
    this.openModal();
  }

  editEntry(id: number) {
    const now = this.getCurrentDateTime();
    const incidente = this.incidentes.find(i => i.id === id);
    if (!incidente) return;

    this.newIncidente = {
      fecha: incidente.fecha,
      hora: incidente.hora,
      sistema_id: incidente.sistema_id,
      proyectomodulo_id: incidente.proyectomodulo_id,
      usuario_reportador: incidente.usuario_reportador,
      descripcion: incidente.descripcion,
      tiempo_estimado: incidente.tiempo_estimado,
      fecha_solucion: incidente.fecha_solucion,
      hora_solucion: incidente.hora_solucion,
      usuario_registro: 'admin',
      fecha_registro: now,
      usuario_actualizacion: 'admin',
      fecha_actualizacion: now
    };

    this.isEditMode = true;
    this.editingId = id;
    this.errorMessages = [];
    this.openModal();
  }


  deleteEntry(id: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Este incidente se eliminará permanentemente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete(`http://localhost:8000/incidente/incidentes/${id}`).subscribe(() => {
          this.loadIncidentes();
          Swal.fire({
            title: 'Eliminado',
            text: 'El incidente ha sido eliminado correctamente.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
        });
      }
    });
  }

  submitEntry() {
    if (this.isEditMode && this.editingId !== null) {
      this.http.put(`http://localhost:8000/incidente/incidentes/${this.editingId}`, this.newIncidente)
        .subscribe({
          next: () => {
            this.closeModal();
            this.loadIncidentes();
              Swal.fire({
                           icon: 'success',
                           title: 'Incidente actualizado',
                           text: 'Incidente actualizado correctamente.',
                           timer: 2000,
                           showConfirmButton: false
                         });
          },
          error: () => {
            this.errorMessages = ['Error al actualizar el incidente.'];
          }
        });
    } else {
        const now = this.getCurrentDateTime();
        this.newIncidente.fecha_registro = now;
        this.newIncidente.fecha_actualizacion = now;
        this.newIncidente.usuario_registro = 'admin';
        this.newIncidente.usuario_actualizacion = 'admin';
      this.http.post(`http://localhost:8000/incidente/incidentes`, this.newIncidente)
        .subscribe({
          next: () => {
            this.closeModal();
            this.loadIncidentes();
              Swal.fire({
                          icon: 'success',
                          title: 'Incidente registrado',
                          text: 'Incidente registrado correctamente.',
                          timer: 2000,
                          showConfirmButton: false
                        });
          },
          error: () => {
            this.errorMessages = ['Error al crear el incidente.'];
          }
        });
    }
  }

  resetForm() {
    this.newIncidente = {
      fecha: '',
      hora: '',
      sistema_id: 0,
      proyectomodulo_id: 0,
      usuario_reportador: '',
      descripcion: '',
      tiempo_estimado: 0,
      fecha_solucion: '',
      hora_solucion: '',
      usuario_registro: 'admin',
      fecha_registro: '',
      usuario_actualizacion: 'admin',
      fecha_actualizacion: ''
    };
  }

  openModal() {
    const modalEl = document.getElementById('incidenteModal');
    if (modalEl) {
      const modal = new (window as any).bootstrap.Modal(modalEl);
      modal.show();
    }
  }

  closeModal() {
    const modal = (window as any).bootstrap.Modal.getInstance(document.getElementById('incidenteModal'));
    modal?.hide();
  }
  getCurrentDateTime(): string {
    const now = new Date();
    return now.toISOString(); // ejemplo: "2025-07-13T20:45:00.000Z"
  }
}
