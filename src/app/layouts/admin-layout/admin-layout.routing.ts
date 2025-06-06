import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { IconsComponent } from '../../pages/icons/icons.component';
import { MapsComponent } from '../../pages/maps/maps.component';
import { UserProfileComponent } from '../../pages/user-profile/user-profile.component';
import { TablesComponent } from '../../pages/tables/tables.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard', component: DashboardComponent },
    { path: 'user-profile', component: UserProfileComponent },
    { path: 'tables', component: TablesComponent },
    { path: 'icons', component: IconsComponent },
    { path: 'maps', component: MapsComponent },
    {
        path: 'roles',
        children: [
            {
                path: '',
                loadChildren: () => import('src/app/pages/roles/roles.module').then(m => m.RolesModule)
            },
            {
                path: '',
                loadChildren: () => import('src/app/pages/user-role/user-role.module').then(m => m.UserRoleModule)
            }
        ]
    }
];
