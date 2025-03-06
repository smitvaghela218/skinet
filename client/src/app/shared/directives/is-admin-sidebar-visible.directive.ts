import { Directive, effect, inject, TemplateRef, ViewContainerRef } from '@angular/core';
import { SidebarService } from '../../core/services/sidebar.service';

@Directive({
  selector: '[appIsAdminSidebarVisible]',
  standalone: true
})
export class IsAdminSidebarVisibleDirective {
  private sidebarService = inject(SidebarService);
  private viewContainerRef = inject(ViewContainerRef);
  private templateRef = inject(TemplateRef<any>);

  constructor() {
    effect(() => {
      console.log('Directive effect triggered, Sidebar visible:', this.sidebarService.isAdminSidebarVisible());
      
      if (this.sidebarService.isAdminSidebarVisible()) {
        console.log('Creating sidebar view');
        this.viewContainerRef.createEmbeddedView(this.templateRef);
      } else {
        console.log('Clearing sidebar view');
        this.viewContainerRef.clear();
      }
    });
  }
  
}
