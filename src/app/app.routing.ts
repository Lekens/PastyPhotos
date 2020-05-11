import {ModuleWithProviders} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {InitFrameComponent} from './users/init-frame/init-frame.component';
import {AdminRoutesComponent} from './admin/admin-routes/admin-routes.component';
import {OrdersComponent} from './admin/orders/orders.component';
import {GuardService} from './services/gaurdService/guard.service';

export interface IRouting {
  routes: ModuleWithProviders;
  components: any[];
  entryComponent?: any[];
  providers?: any[];
}

const landingRoutes: Routes = [
  {path: '', component: InitFrameComponent, pathMatch: 'full'},

  {path: 'init-frame', component: InitFrameComponent},
  {path: 'admin', loadChildren: './shared/modules/super-user/super-user.module#SuperUserModule'},
  {path: '**', component: InitFrameComponent},
];

export const landingRouting: IRouting = {
  routes: RouterModule.forRoot(landingRoutes, {useHash: false}),
  components: [
    InitFrameComponent,
  ],
  entryComponent: [],
  providers: []
};



// , canActivate: [RoleService, GuardService]
export const superUserRoutes: Routes = [
  {path: '', component: AdminRoutesComponent, children: [
    {path: 'dashboard', component: OrdersComponent, canActivate: [GuardService], data: {roles: ['admin']}}
  ]},
  {path: '**', component: AdminRoutesComponent , redirectTo: 'dashboard'}
];

export const superUserRouting: IRouting = {
  routes: RouterModule.forChild(superUserRoutes),
  components: [
    AdminRoutesComponent,
    OrdersComponent,
  ],
  entryComponent: [],
  providers: []
};

