import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';

import { CreateGroupBody } from 'src/app/feature/virtual-anatomy/core/interfaces/create-group.interface';
import { environment } from 'src/environment/environments';
import { GroupFacade } from '../../aplication/group.facade';
import { DialogCreateComponent } from '../../core/components/dialog-create/dialog-create.component';
import { DialogErrorComponent } from '../../core/components/dialog-error/dialog-error.component';

@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.scss'],
  standalone: true,
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    MatDialogModule,
    RouterLink,
    MatProgressSpinnerModule,
  ],
})
export class CreateGroupComponent {
  apiUrl = signal<string>(environment.api);
  private readonly groupService: GroupFacade = inject(GroupFacade);
  private readonly dialog: MatDialog = inject(MatDialog);
  onSpinner: boolean = false;
  name: string = '';

  createGroup() {
    const enterAnimationDuration = '300ms';
    const exitAnimationDuration = '300ms';
    if (!this.name) {
      this.dialog.open(DialogErrorComponent, {
        data: {
          tittle: '¡Datos incompletos!',
          text: 'Por favor ingresa el nombre del grupo',
        },
        enterAnimationDuration,
        exitAnimationDuration,
      });
    } else if (/^[a-zA-Z0-9 ]*$/.test(this.name)) {
      const body: CreateGroupBody = {
        nameGroup: this.name.toUpperCase(),
      };

      this.onSpinner = true;

      this.groupService.createGroup(body).subscribe((resp) => {
        this.onSpinner = false;
        this.name = '';
        this.dialog.open(DialogCreateComponent, {
          data: {
            groupName: body.nameGroup,
            groupData: resp,
          },
          enterAnimationDuration,
          exitAnimationDuration,
        });
      });
    } else if (!/^[a-zA-Z0-9 ]*$/.test(this.name) && this.name) {
      this.dialog.open(DialogErrorComponent, {
        data: {
          tittle: '¡Datos inválidos!',
          text: 'Por favor ingresa solo letras y números',
        },
        enterAnimationDuration,
        exitAnimationDuration,
      });
    }
  }
}
