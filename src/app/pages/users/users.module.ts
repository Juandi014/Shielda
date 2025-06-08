import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // ✅ Importar aquí

import { UsersRoutingModule } from './users-routing.module';
import { ListComponent } from './list/list.component';
import { ManageComponent } from './manage/manage.component';
import { ViewComponent } from './view/view.component';
import { EditComponent } from './edit/edit.component';

@NgModule({
  declarations: [
    ListComponent,
    ManageComponent,
    ViewComponent,
    EditComponent,
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    FormsModule,            
    ReactiveFormsModule     
  ]
})
export class UsersModule { }
