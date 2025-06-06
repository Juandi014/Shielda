import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Address } from 'src/app/models/address.model';
import { AddressService } from 'src/app/services/address.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {
  mode: number; // 1: view, 2: create, 3: update
  Address: Address;
  theFormGroup: FormGroup; // Policía de formulario
  trySend: boolean;
  constructor(private activatedRoute: ActivatedRoute,
    private AddressesService: AddressService,
    private router: Router,
    private theFormBuilder: FormBuilder //Definir las reglas
  ) {
    this.trySend = false;
    this.Address = { id: 0 };
    this.configFormGroup()
  }

  ngOnInit(): void {
    const currentUrl = this.activatedRoute.snapshot.url.join('/');
    if (currentUrl.includes('view')) {
      this.mode = 1;
    } else if (currentUrl.includes('create')) {
      this.mode = 2;
    } else if (currentUrl.includes('update')) {
      this.mode = 3;
    }
    if (this.activatedRoute.snapshot.params.id) {
      this.Address.id = this.activatedRoute.snapshot.params.id
      this.getAddress(this.Address.id)
    }

  }
  configFormGroup() {
    this.theFormGroup = this.theFormBuilder.group({
      // primer elemento del vector, valor por defecto
      // lista, serán las reglas
      id: [0,[]],
      street: ['', [Validators.required, Validators.minLength(2)]],
      number: ['', [Validators.required, Validators.minLength(2)]],
      latitude: [0,[]],
      longitude: [0,[]]
    })
  }


  get getTheFormGroup() {
    return this.theFormGroup.controls
  }

  getAddress(id: number) {
    this.AddressesService.view(id).subscribe({
      next: (response) => {
        this.Address = response;

        this.theFormGroup.patchValue({
          id: this.Address.id,
          street: this.Address.street,
          number: this.Address.number,
          latitude: this.Address.latitude,
          longitude: this.Address.longitude,
        });
        
        console.log('Address fetched successfully:', this.Address);
      },
      error: (error) => {
        console.error('Error fetching Address:', error);
      }
    });
  }
  back() {
    this.router.navigate(['/Addresses/list']);
  }

  create() {
    this.trySend = true;
    if (this.theFormGroup.invalid) {
      Swal.fire({
        title: 'Error!',
        text: 'Por favor, complete todos los campos requeridos.',
        icon: 'error',
      })
      return;
    }
    this.AddressesService.create(this.theFormGroup.value).subscribe({
      next: (Address) => {
        console.log('Address created successfully:', Address);
        Swal.fire({
          title: 'Creado!',
          text: 'Registro creado correctamente.',
          icon: 'success',
        })
        this.router.navigate(['/Addresses/list']);
      },
      error: (error) => {
        console.error('Error creating Address:', error);
      }
    });
  }
  update() {
    this.trySend = true;
    if (this.theFormGroup.invalid) {
      Swal.fire({
        title: 'Error!',
        text: 'Por favor, complete todos los campos requeridos.',
        icon: 'error',
      })
      return;
    }
    this.AddressesService.update(this.theFormGroup.value).subscribe({
      next: (Address) => {
        console.log('Address updated successfully:', Address);
        Swal.fire({
          title: 'Actualizado!',
          text: 'Registro actualizado correctamente.',
          icon: 'success',
        })
        this.router.navigate(['/Addresses/list']);
      },
      error: (error) => {
        console.error('Error updating Address:', error);
      }
    });
  }

}
