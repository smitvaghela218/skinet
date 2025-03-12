import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { AgGridAngular, ICellRendererAngularComp } from 'ag-grid-angular';


@Component({
  selector: 'app-delete-button-renderer',
  standalone: true,
  imports: [MatIcon],
  template: `
    <button matTooltip="Delete" mat-icon-button
      class="bg-red-600 hover:bg-red-700 text-white p-2 rounded-md transition"
      (click)="confirmDelete()">
      <mat-icon>delete</mat-icon>
    </button>
  `
})

export class DeleteButtonRendererComponent implements ICellRendererAngularComp {
  params: any;

  agInit(params: any): void {
    this.params = params;
  }

  refresh(): boolean {
    return false;
  }

  async confirmDelete() {
    if (this.params.openDeleteDialog) {
      await this.params.openDeleteDialog(this.params.data.id);
    }
  }
}

