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

    if (this.name === '') {
      confirm("No puede crear un grupo de nombre vacio")
    } else {
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
        });
      });
    }

  }
}
