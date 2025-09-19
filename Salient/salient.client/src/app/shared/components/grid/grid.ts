import { CommonModule, DatePipe, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, inject, input, Input, Output, viewChild, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatRow, MatRowDef, MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CameraData } from './camera-data';
import { grid_columns, GridColumn } from './cam-column';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CdkTableModule } from '@angular/cdk/table';
import { ResizableColumnDirective } from './directives/resizable-column-directive';

@Component({
  selector: 'app-grid',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatRadioModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    DatePipe,
    TitleCasePipe,
    ScrollingModule,
    CdkTableModule,
    MatRowDef,
    MatRow,
    ResizableColumnDirective
  ],
  templateUrl: './grid.html',
  styleUrl: './grid.scss',
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class Grid<T> {
  private snackBar = inject(MatSnackBar);

  columns = grid_columns;
virtualScrollHeight = '400px';
  displayedColumns: string[] = this.columns.map((c) => c.property);
  dataSource = input.required<MatTableDataSource<T>>();
  
  @Output() personSelected = new EventEmitter<CameraData>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  matTable = viewChild<any>("table")
  constructor() {
    // Load camera data
    // this.dataSource = new MatTableDataSource(generateCameraData(500));
  }

  ngOnInit() {
  // Set up custom filter predicate

  
}
  ngAfterViewInit() {
     this.dataSource().paginator = this.paginator;
     this.dataSource().sort = this.sort;
  }
  trackByFunction = (index: number, item: any): any => {
    return  item.id|| index;
  };

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource().filter = filterValue.trim().toLowerCase();
  }

  onCheckboxChange(row: CameraData, property: string, checked: boolean) {
    (row as any)[property] = checked;
    this.showSnackBar(`${property} ${checked ? 'enabled' : 'disabled'} for ${row.name}`);
    // Here you would typically call your API to update the camera
  }

  onRadioChange(row: CameraData, property: string, value: any) {
    (row as any)[property] = value;
    this.showSnackBar(`${property} changed to ${value} for ${row.name}`);
    // Here you would typically call your API to update the camera
  }

  togglePasswordVisibility(column: GridColumn) {
    column.showPassword = !column.showPassword;
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'online': return 'check_circle';
      case 'offline': return 'cancel';
      case 'error': return 'error';
      default: return 'help';
    }
  }

  onAction(actionName: string, row: CameraData) {
    // switch (actionName) {
    //   case 'edit':
    //     this.editCamera(row);
    //     break;
    //   case 'view':
    //     this.viewCamera(row);
    //     break;
    //   case 'settings':
    //     this.cameraSettings(row);
    //     break;
    //   case 'delete':
    //     this.deleteCamera(row);
    //     break;
    // }
  }

  onRowClick(row: T) {
    console.log('Row clicked:', row);
    // You can add row selection logic here
  }


  private showSnackBar(message: string, type: 'success' | 'error' = 'success') {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: type === 'error' ? ['error-snackbar'] : ['success-snackbar']
    });
  }
}
