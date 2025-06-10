import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DigitalSignature } from 'src/app/models/digital-signature.model';
import { DigitalSignatureService } from 'src/app/services/digital-signature.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  digitalSignatures: any[] = [];

  constructor(
    private digitalSignaturesService: DigitalSignatureService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.list();
  }

  list() {
    this.digitalSignaturesService.list().subscribe({
      next: (signatures) => {
        const requests = signatures.map((sig) =>
          this.userService.getById(sig.userId).toPromise().then(user => ({
            ...sig,
            userName: user.name,
            userEmail: user.email
          }))
        );

        Promise.all(requests).then((data) => {
          this.digitalSignatures = data;
        });
      },
      error: () => {
        Swal.fire('Error', 'No se pudieron cargar las firmas digitales', 'error');
      }
    });
  }

  create() {
    this.router.navigate(['/digital-signatures/create']);
  }

  view(id: number) {
    this.router.navigate(['/digital-signatures/view', id]);
  }

  edit(id: number) {
    this.router.navigate(['/digital-signatures/update', id]);
  }

  delete(id: number) {
    Swal.fire({
      title: 'Eliminar',
      text: '¿Está seguro que quiere eliminar la firma?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.digitalSignaturesService.delete(id).subscribe(() => {
          Swal.fire('Eliminado', 'Firma eliminada correctamente', 'success');
          this.list();
        });
      }
    });
  }
}
