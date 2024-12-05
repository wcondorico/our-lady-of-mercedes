import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { VIRTUAL_ANATOMY_PAGES } from 'src/app/core/routes/virtual-anatomy.routes';
import { PresentationComponent } from './pages/presentation/presentation.component';
import { DataGroupComponent } from './pages/data-group/data-group.component';
import { SearchGroupComponent } from './pages/search-group/search-group.component';
import { CreateGroupComponent } from './pages/create-group/create-group.component';
import { authGroupGuard } from './core/guards/auth-group.guard';
import { exitGroupGuard } from './core/guards/exit-group.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: VIRTUAL_ANATOMY_PAGES.PRESENTATION,
    pathMatch: 'full'
  },
  {
    path: VIRTUAL_ANATOMY_PAGES.PRESENTATION,
    component: PresentationComponent
  },
  {
    path: VIRTUAL_ANATOMY_PAGES.DATA_GROUPS,
    component: DataGroupComponent,
    canActivate: [authGroupGuard],
    canDeactivate: [exitGroupGuard]
  },
  {
    path: VIRTUAL_ANATOMY_PAGES.CREATE_GROUP,
    component: CreateGroupComponent
  },
  {
    path: VIRTUAL_ANATOMY_PAGES.SEARCH_GROUPS,
    component: SearchGroupComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VirtualAnatomyRoutingModule { }
