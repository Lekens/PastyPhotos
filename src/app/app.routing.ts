import {ModuleWithProviders} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {InitFrameComponent} from './users/init-frame/init-frame.component';
import {AdminRoutesComponent} from './admin/admin-routes/admin-routes.component';
import {OrdersComponent} from './admin/orders/orders.component';
import {GuardService} from './services/gaurdService/guard.service';
import {HeaderComponent} from "./shared/layouts/frames/header/header.component";
import {UserService} from "./services/api-handlers/userService/user.service";
import {ApiService} from "./services/api/api.service.";

export interface IRouting {
  routes: ModuleWithProviders;
  components: any[];
  entryComponent?: any[];
  providers?: any[];
}

const landingRoutes: Routes = [
  {path: '', component: InitFrameComponent, pathMatch: 'full'},
  {path: 'build-frame', component: InitFrameComponent},
  {path: 'build-frame/:orderId', component: InitFrameComponent},
  {path: 'admin', loadChildren: './shared/modules/super-user/super-user.module#SuperUserModule'},
  {path: '**', component: InitFrameComponent},
];

export const landingRouting: IRouting = {
  routes: RouterModule.forRoot(landingRoutes, {useHash: false}),
  components: [
    InitFrameComponent,
    HeaderComponent
  ],
  entryComponent: [],
  providers: [UserService, ApiService]
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

