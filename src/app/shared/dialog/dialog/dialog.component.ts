import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dialog', // Reusable dialog component
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent {
  // Title of the dialog (default is "Message")
  @Input() title: string = 'Message';

  // Content/message to show inside the dialog
  @Input() message: string = '';

  // Controls whether the dialog is visible or hidden
  @Input() visible: boolean = false;

  // Event emitted when the dialog is closed
  @Output() closed = new EventEmitter<void>();

  // Function to close the dialog
  // Sets `visible` to false and emits a `closed` event
  close() {
    this.visible = false;
    this.closed.emit();
  }
}
