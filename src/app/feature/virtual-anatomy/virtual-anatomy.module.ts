import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { GroupFacade } from './aplication/group.facade';
import { GroupHttp } from './infraestructure/group.http';
import { CreateGroupComponent } from './pages/create-group/create-group.component';
import { DataGroupComponent } from './pages/data-group/data-group.component';
import { PresentationComponent } from './pages/presentation/presentation.component';
import { SearchGroupComponent } from './pages/search-group/search-group.component';
import { VirtualAnatomyRoutingModule } from './virtual-anatomy-routing.module';

@NgModule({
  declarations: [],
  providers: [
    {
      provide: GroupFacade,
      useClass: GroupHttp
    }
  ],
  imports: [
    HttpClientModule,
    PresentationComponent,
    CommonModule,
    VirtualAnatomyRoutingModule,
    DataGroupComponent,
    SearchGroupComponent,
    CreateGroupComponent
  ]
})
export class VirtualAnatomyModule { }
