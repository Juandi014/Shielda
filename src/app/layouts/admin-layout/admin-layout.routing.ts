import { Routes } from '@angular/router';
import { UserProfileComponent } from 'src/app/pages/user-profile/user-profile.component';
import { ProfileUpdateComponent } from 'src/app/pages/profile-update/profile-update.component';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { IconsComponent } from '../../pages/icons/icons.component';
import { MapsComponent } from '../../pages/maps/maps.component';

import { TablesComponent } from '../../pages/tables/tables.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard', component: DashboardComponent },
    
    { path: 'tables', component: TablesComponent },
    { path: 'icons', component: IconsComponent },
    { path: 'maps', component: MapsComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'dashboard', component: DashboardComponent },
  { path: 'profile/:id', component: UserProfileComponent },
  { path: 'profile/update/:id', component: ProfileUpdateComponent },
  {
  path: 'profile/:id',
  component: UserProfileComponent
},

    {
        path: 'roles',
        children: [
            {
                path: '',
                loadChildren: () => import('src/app/pages/roles/roles.module').then(m => m.RolesModule)
            },
        ]
    },
   
{
  path: 'addresses',
  children: [
    {
      path: '',
      loadChildren: () => import('src/app/pages/addresses/addresses.module').then(m => m.AddressesModule)
    }
  ]
},
{ path: 'profile/:id', component: UserProfileComponent },


    {
        path: 'user-roles',
        children: [
            {
                path: '',
                loadChildren: () => import('src/app/pages/user-role/user-role.module').then(m => m.UserRoleModule)
            },
        ]
    },
    {
        path: 'permissions',
        children: [
            {
                path: '',
                loadChildren: () => import('src/app/pages/permissions/permissions.module').then(m => m.PermissionsModule)
            },
        ]
    },
    {
        path: 'passwords',
        children: [
            {
                path: '',
                loadChildren: () => import('src/app/pages/passwords/passwords.module').then(m => m.PasswordsModule)
            },
        ]
    },
    {
        path: 'sessions',
        children: [
            {
                path: '',
                loadChildren: () => import('src/app/pages/sessions/sessions.module').then(m => m.SessionsModule)
            },
        ]
    }
];
