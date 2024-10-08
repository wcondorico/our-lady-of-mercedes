import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchGroupComponent } from './pages/search-group/search-group.component';
import { DataGroupComponent } from './pages/data-group/data-group.component';
import { VirtualAnatomyRoutingModule } from './virtual-anatomy-routing.module';



@NgModule({
  declarations: [
  ],
  imports: [
    SearchGroupComponent,
    CommonModule,
    VirtualAnatomyRoutingModule,
    DataGroupComponent
  ]
})
export class VirtualAnatomyModule { }
