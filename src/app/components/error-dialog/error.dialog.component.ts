import {Component} from '@angular/core';

@Component({
  selector: 'error-dialog',
  templateUrl: './error-dialog.component.html',
  styleUrls: ['./error-dialog.component.scss'],
})

export class ErrorDialogComponent {
  public message: string;
}
