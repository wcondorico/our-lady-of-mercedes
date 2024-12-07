import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { environment } from 'src/environment/environments';
import { GroupFacade } from '../../aplication/group.facade';
import { SearchGroupBody } from '../../core/interfaces/search-group.interface';
import { TokensService } from '../../core/stores/tokens.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DialogErrorComponent } from '../../core/components/dialog-error/dialog-error.component';

@Component({
  selector: 'app-search-group',
  templateUrl: './search-group.component.html',
  styleUrls: ['./search-group.component.scss'],
  standalone: true,
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    RouterLink,
    MatProgressSpinnerModule,
    MatDialogModule
  ]
})
export class SearchGroupComponent {
  apiUrl = signal<string>(environment.api);
  private readonly groupService: GroupFacade = inject(GroupFacade);
  private readonly router: Router = inject(Router);
  private readonly tokenService: TokensService = inject(TokensService);
  name: string = '';
  serial: string = '';
  onSpinner: boolean = false;
  private readonly dialog: MatDialog = inject(MatDialog);

  searchGroup() {
    const enterAnimationDuration = '300ms';
    const exitAnimationDuration = '300ms';

    if(this.name === '' || this.serial === ''){
      this.dialog.open(DialogErrorComponent, {
        data: {
          tittle: "¡Datos incompletos!",
          text: "Por favor ingresa los datos que faltan"
        },
        enterAnimationDuration,
        exitAnimationDuration,
      })
    }
    else {
    this.onSpinner = true;
    const body: SearchGroupBody = {
      nameGroup: this.name.toUpperCase(),
      serialGroup: this.serial,
    };

    this.groupService
      .searchGroup(body).subscribe({
        next: (token) => {
          this.onSpinner = false;
          this.tokenService.accessToken = token.access;
          this.tokenService.refreshToken = token.refresh;
          this.router.navigate(['/anatomia-virtual/datos-grupos']);
        },
        error: (err) => {
          console.log('este es el error: ',err)
          this.onSpinner = false;

          if ( err.status === 0 ) {
            this.dialog.open(DialogErrorComponent, {
              data: {
                tittle: "¡Hubo un error de conexión!",
                text: "Por favor inténtalo mas tarde"
              },
              enterAnimationDuration,
              exitAnimationDuration,
            })
          } else if ( err.status === 400 ) {
            this.dialog.open(DialogErrorComponent, {
              data: {
                tittle: "¡Hubo un error en la busqueda!",
                text: "Por favor ingresa correctamente los datos del grupo que busca"
              },
              enterAnimationDuration,
              exitAnimationDuration,
            })
          } else {
            this.dialog.open(DialogErrorComponent, {
              data: {
                tittle: "¡Ocurrió un error!",
                text: "Ocurrió un error inesperado. Inténtalo nuevamente más tarde"
              },
              enterAnimationDuration,
              exitAnimationDuration,
            })
          }



        }

      })
    }
  }
}
