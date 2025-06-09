import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DigitalSignature } from 'src/app/models/digital-signature.model';
import { DigitalSignatureService } from 'src/app/services/digital-signature.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  digitalSignatures: DigitalSignature[] = [];
  constructor(private digitalSignaturesService:DigitalSignatureService,
    private router:Router
  ) { }

  ngOnInit(): void {
    this.list();
  }

  list(){
    this.digitalSignaturesService.list().subscribe({
      next: (digitalSignatures) => {
        this.digitalSignatures = digitalSignatures;
      }
    });
  }
  create(){
    this.router.navigate(['/digital-signatures/create']);
  }
  view(id:number){
    this.router.navigate(['/digital-signatures/view/'+id]);
  }
  edit(id:number){
    this.router.navigate(['/digital-signatures/update/'+id]);
  }
  delete(id:number){
    console.log("Delete device with id:", id);
    Swal.fire({
      title: 'Eliminar',
      text: "Está seguro que quiere eliminar el registro?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.digitalSignaturesService.delete(id).
          subscribe(data => {
            Swal.fire(
              'Eliminado!',
              'Registro eliminado correctamente.',
              'success'
            )
            this.ngOnInit();
          });
      }
    })
  }

}
