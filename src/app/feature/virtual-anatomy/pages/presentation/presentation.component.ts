import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { MODULES_ROUTES } from '../../../../core/routes/modules.routes';
import { VIRTUAL_ANATOMY_PAGES } from '../../../../core/routes/virtual-anatomy.routes';

@Component({
  selector: 'app-search-group',
  templateUrl: './presentation.component.html',
  styleUrls: ['./presentation.component.scss'],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    RouterLink
  ],
})
export class PresentationComponent {
  value = '';
  protected readonly MODULES_ROUTES = MODULES_ROUTES;
  protected readonly VIRTUAL_ANATOMY_PAGES = VIRTUAL_ANATOMY_PAGES;
}
