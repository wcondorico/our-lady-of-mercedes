import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { HeaderComponent } from './layouts/header/header.component';
import { SharedModule } from "../shared/shared.module";
import { FooterComponent } from './layouts/footer/footer.component';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent
  ],
  exports: [
    HeaderComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    NgOptimizedImage
  ]
})
export class CoreModule { }
