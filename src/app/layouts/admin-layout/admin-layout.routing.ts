import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { IconsComponent } from '../../pages/icons/icons.component';
import { MapsComponent } from '../../pages/maps/maps.component';
import { UserProfileComponent } from '../../pages/user-profile/user-profile.component';
import { TablesComponent } from '../../pages/tables/tables.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard', component: DashboardComponent },
    
    { path: 'tables', component: TablesComponent },
    { path: 'icons', component: IconsComponent },
    { path: 'maps', component: MapsComponent },
    { path: 'dashboard', component: DashboardComponent },
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
    },
    {
        path: 'security-questions',
        children: [
            {
                path: '',
                loadChildren: () => import('src/app/pages/security-questions/security-questions.module').then(m => m.SecurityQuestionsModule)
            },
        ]
    },
    {
        path: 'devices',
        children: [
            {
                path: '',
                loadChildren: () => import('src/app/pages/devices/devices.module').then(m => m.DevicesModule)
            },
        ]
    },
    {
        path: 'digital-signatures',
        children: [
            {
                path: '',
                loadChildren: () => import('src/app/pages/digital-signatures/digital-signatures.module').then(m => m.DigitalSignaturesModule)
            },
        ]
    },
    {
        path: 'answers',
        children: [
            {
                path: '',
                loadChildren: () => import('src/app/pages/answers/answers.module').then(m => m.AnswersModule)
            },
        ]
    },
    {
        path: 'role-permissions',
        children: [
            {
                path: '',
                loadChildren: () => import('src/app/pages/role-permissions/role-permissions.module').then(m => m.RolePermissionsModule)
            },
        ]
    }
];
