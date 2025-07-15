import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgZone } from '@angular/core';
import Swal from 'sweetalert2';
@Component({
  standalone: true,
  selector: 'app-proyecto-list',
  templateUrl: './proyecto-list.html',
  styleUrls: ['./proyecto-list.scss'],
  imports: [CommonModule, RouterModule, NgFor, NgIf, FormsModule]
})
export class ProyectoListComponent implements OnInit {
  proyectos: any[] = [];
  prioridades: any[] = [];
  fases: any[] = [];
  estados: any[] = [];
  showSuccess = false;
  errorMessages: string[] = [];

  form: any = {
    nombre: '',
    fecha_inicio: '',
    fecha_fin: '',
    prioridad_id: null,
    faseproyecto_id: null,
    estado_id: null,
    usuario_registro: 'admin',
    fecha_registro: '',
    usuario_actualizacion: 'admin',
    fecha_actualizacion: ''
  };

  isEditMode = false;
  editId: number | null = null;

  constructor(private http: HttpClient,private zone: NgZone) {}

  ngOnInit(): void {
    this.loadProyectos();
    this.loadCombos();
  }

  
  loadProyectos() {
    this.http.get<any[]>('http://localhost:8000/proyecto/')
      .subscribe(res => {
        this.zone.run(() => {
          this.proyectos = res;
        });
      });
  }


  loadCombos() {
    this.http.get<any[]>('http://localhost:8000/proyecto/prioridades').subscribe(res => (this.prioridades = res));
    this.http.get<any[]>('http://localhost:8000/clasificacion/faseproyectos').subscribe(res => (this.fases = res));
    this.http.get<any[]>('http://localhost:8000/proyecto/estados').subscribe(res => (this.estados = res));
  }

  newProyecto() {
    this.isEditMode = false;
    this.resetForm();
    this.errorMessages = [];
    this.openModal();
  }

  editProyecto(proyecto: any) {
    this.isEditMode = true;
    this.editId = proyecto.id;
    this.form = {
      nombre: proyecto.nombre,
      fecha_inicio: proyecto.fecha_inicio,
      fecha_fin: proyecto.fecha_fin,
      prioridad_id: proyecto.prioridad_id,
      faseproyecto_id: proyecto.faseproyecto_id,
      estado_id: proyecto.estado_id,
      usuario_registro: 'admin',
      fecha_registro: '',
      usuario_actualizacion: 'admin',
      fecha_actualizacion: ''
    };
    this.errorMessages = [];
    this.openModal();
  }

  submitProyecto() {
    this.errorMessages = [];
    const url = 'http://localhost:8000/proyecto/';
    const body = this.form;

    if (this.isEditMode && this.editId !== null) {
      this.http.put(url + this.editId, body).subscribe({
        next: () => {
          this.loadProyectos();
          this.closeModal();
           Swal.fire({
                        icon: 'success',
                        title: 'Proyecto actualizado',
                        text: 'Proyecto actualizado correctamente.',
                        timer: 2000,
                        showConfirmButton: false
                      });
        },
        error: err => this.handleApiError(err)
      });
    } else {
       const now = this.getCurrentDateTime();
        body.fecha_registro = now;
        body.fecha_actualizacion = now;
        body.usuario_registro = 'admin';
        body.usuario_actualizacion = 'admin';
      this.http.post(url, body).subscribe({
        next: () => {
          this.loadProyectos();
          this.closeModal();
            Swal.fire({
                        icon: 'success',
                        title: 'Proyecto registrado',
                        text: 'Proyecto registrado correctamente.',
                        timer: 2000,
                        showConfirmButton: false
                      });
        },
        error: err => this.handleApiError(err)
      });
    }
  }


  deleteProyecto(id: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Este proyecto se eliminará permanentemente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete(`http://localhost:8000/proyecto/${id}`).subscribe(() => {
          this.loadProyectos();
          Swal.fire({
            title: 'Eliminado',
            text: 'El proyecto ha sido eliminado correctamente.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
        });
      }
    });
  }

  resetForm() {
    this.form = {
      nombre: '',
      fecha_inicio: '',
      fecha_fin: '',
      prioridad_id: null,
      faseproyecto_id: null,
      estado_id: null
    };
  }

  handleApiError(err: any) {
    if (err.error?.detail && Array.isArray(err.error.detail)) {
      this.errorMessages = err.error.detail.map((e: any) => e.msg);
    } else {
      this.errorMessages = ['Ocurrió un error inesperado.'];
    }
  }

  openModal() {
    const modalEl = document.getElementById('proyectoModal');
    if (modalEl) {
      const modal = new (window as any).bootstrap.Modal(modalEl);
      modal.show();
    }
  }

  closeModal() {
    const modal = (window as any).bootstrap.Modal.getInstance(document.getElementById('proyectoModal'));
    modal?.hide();
  }
  getCurrentDateTime(): string {
    const now = new Date();
    return now.toISOString(); // ejemplo: "2025-07-13T20:45:00.000Z"
  }
}
