import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './list/list.component';
import { ManageComponent } from './manage/manage.component';
import { ViewComponent } from './view/view.component';
import { EditComponent } from './edit/edit.component';

const routes: Routes = [
  { path: '', component: ListComponent }, // /users
  { path: 'view/:id', component: ViewComponent }, // /users/view/123
  { path: 'update/:id', component: ManageComponent }, // /users/update/123
  { path: 'profile/:id', component: ManageComponent }, // /users/profile/123
  { path: 'address/:id', component: ManageComponent }, // /users/address/123
  { path: 'edit/:id', component: EditComponent }, 
  { path: 'users/signature/:userId', component: ManageComponent }, // /users/signature/123
  // /users/edit/123
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
