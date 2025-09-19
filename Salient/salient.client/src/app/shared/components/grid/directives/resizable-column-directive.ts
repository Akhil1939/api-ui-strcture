import { 
  Directive, 
  HostListener, 
  ElementRef, 
  Renderer2, 
  OnDestroy, 
  Input,
  HostBinding 
} from '@angular/core';

@Directive({
  selector: '[resizableColumn]'
})
export class ResizableColumnDirective implements OnDestroy {
  @Input() dataColumn!: string;
  
  private startX: number = 0;
  private startWidth: number = 0;
  private pressed: boolean = false;
  private currentResizeHandle?: HTMLElement;
  private moveListener?: () => void;
  private upListener?: () => void;
  private minWidth: number = 50; // Minimum column width
  private maxWidth: number = 500; // Maximum column width

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    
    this.pressed = true;
    this.currentResizeHandle = this.el.nativeElement as HTMLElement;
    this.startX = event.clientX;
    
    // Get the header cell width
    const headerCell = this.currentResizeHandle.parentElement as HTMLElement;
    this.startWidth = headerCell.offsetWidth;
    
    this.startResizing();
  }

  private startResizing(): void {
    // Create visual feedback
    this.renderer.addClass(this.currentResizeHandle, 'resizing');
    
    // Add global event listeners
    this.moveListener = this.renderer.listen('document', 'mousemove', (event: MouseEvent) => {
      if (this.pressed) {
        this.resizeColumn(event.clientX);
      }
    });

    this.upListener = this.renderer.listen('document', 'mouseup', () => {
      if (this.pressed) {
        this.stopResizing();
      }
    });
  }

  private resizeColumn(currentX: number): void {
    if (!this.currentResizeHandle) return;

    const headerCell = this.currentResizeHandle.parentElement as HTMLElement;
    if (!headerCell) return;

    // Calculate new width
    let newWidth = this.startWidth + (currentX - this.startX);
    
    // Apply constraints
    newWidth = Math.max(this.minWidth, Math.min(this.maxWidth, newWidth));
    
    // Update header cell
    this.setColumnWidth(headerCell, `${newWidth}px`);
    
    // Update all corresponding cells in body rows
    this.updateBodyCells(headerCell, newWidth);
  }

  private setColumnWidth(element: HTMLElement, width: string): void {
    this.renderer.setStyle(element, 'width', width);
    this.renderer.setStyle(element, 'min-width', width);
    this.renderer.setStyle(element, 'max-width', width);
  }

  private updateBodyCells(headerCell: HTMLElement, width: number): void {
    const table = this.findTable(headerCell);
    if (!table) return;

    const columnIndex = Array.from(headerCell.parentElement!.children).indexOf(headerCell);
    
    // Update body cells
    const bodyRows = table.querySelectorAll('tbody tr, .mat-row');
    bodyRows.forEach(row => {
      const cells = row.querySelectorAll('td, .mat-cell');
      if (cells[columnIndex]) {
        this.setColumnWidth(cells[columnIndex] as HTMLElement, `${width}px`);
      }
    });
  }

  private findTable(element: HTMLElement): HTMLElement | null {
    let parent = element.parentElement;
    while (parent && !parent.matches('table')) {
      parent = parent.parentElement;
    }
    return parent;
  }

  private stopResizing(): void {
    this.pressed = false;
    
    if (this.currentResizeHandle) {
      this.renderer.removeClass(this.currentResizeHandle, 'resizing');
      this.currentResizeHandle = undefined;
    }
    
    // Clean up event listeners
    if (this.moveListener) {
      this.moveListener();
      this.moveListener = undefined;
    }
    
    if (this.upListener) {
      this.upListener();
      this.upListener = undefined;
    }
  }

  ngOnDestroy(): void {
    this.stopResizing();
  }
}