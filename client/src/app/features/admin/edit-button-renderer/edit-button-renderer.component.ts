import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-edit-button-renderer',
  standalone: true,
  imports: [MatIcon],
  template: `

    <button matTooltip="Edit" mat-icon-button
    (click)="navigateToEditPage()"
   class="bg-teal-600 hover:bg-teal-700 text-white p-2 rounded-md transition">
                            
                              <mat-icon>edit</mat-icon>
                            </button>
    
  `
})
export class EditButtonRendererComponent {
  params: any;

  agInit(params: any): void {
    this.params = params;
  }

  refresh(): boolean {
    return false;
  }



  navigateToEditPage() {
    if (this.params.navigateToEditPage) {
      this.params.navigateToEditPage(this.params.data.id);
    }
  }

}
