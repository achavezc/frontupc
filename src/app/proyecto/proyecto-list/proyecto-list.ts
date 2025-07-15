import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  standalone: true,
  selector: 'app-proyecto-list',
  templateUrl: './proyecto-list.html',
  styleUrls: ['./proyecto-list.scss'],
  imports: [CommonModule, RouterModule, NgFor, NgIf, FormsModule]
})


export class ProyectoListComponent implements OnInit {

  errorMessages: string[] = [];
  showSuccess = false;
  constructor(private http: HttpClient) {}

  ngOnInit() {
  }


 
}
