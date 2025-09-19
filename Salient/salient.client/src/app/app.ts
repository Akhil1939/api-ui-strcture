import { Component, inject, signal, viewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Grid } from './shared/components/grid/grid';
import { MatTableDataSource } from '@angular/material/table';
import {
  CameraData,
  generateCameraData,
} from './shared/components/grid/camera-data';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';
import { Tree } from './shared/components/tree/tree';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  imports: [
    Grid,
    MatFormField,
    MatInput,
    MatLabel,
    MatSelect,
    MatOption,
    FormsModule,
    Tree,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('salient-ui');

  protected dataSource = new MatTableDataSource<CameraData>();
  protected manufacturerFilter = '';
  private globalFilter = '';
  protected firmwareComparisonFilter = '';
  protected firmwareVersionFilter = '';

 
  grid = viewChild<Grid<CameraData>>(Grid);
  protected manufacturers = [
    'Hikvision',
    'Dahua',
    'Axis',
    'Uniview',
    'Bosch',
    'Sony',
  ];
  protected availableFirmwareVersions = [
    '1.0',
    '2.1',
    '3.2',
    '4.3',
    '5.4',
    '1.5',
    '2.0',
    '2.5',
    '2.2',
    '2.3',
  ];

  constructor(private client: HttpClient) {

  }
  ngOnInit(): void {
    this.initializeData();
    this.setupFilterPredicate();
  }

  private setupFilterPredicate(): void {
    this.dataSource.filterPredicate = (
      data: CameraData,
      filter: string
    ): boolean => {
      if (!filter || filter === '') return true;

      // Parse the filter string - format: "globalFilter|manufacturerFilter|firmwareComparison|firmwareVersion"
      const parts = filter.split('|');
      const currentGlobalFilter = (parts[0] || '').trim();
      const currentManufacturerFilter = (parts[1] || '').trim();
      const currentFirmwareComparisonFilter = (parts[2] || '').trim();
      const currentFirmwareVersionFilter = (parts[3] || '').trim();

      // Check global filter (only if it has meaningful content)
      const globalMatch =
        currentGlobalFilter.length > 0
          ? this.checkGlobalFilter(data, currentGlobalFilter)
          : true;

      // Check manufacturer filter (only if it has meaningful content)
      const manufacturerMatch =
        currentManufacturerFilter.length > 0
          ? this.checkManufacturerFilter(data, currentManufacturerFilter)
          : true;

      // Check firmware filter (only if both comparison and version are set)
      const firmwareMatch =
        currentFirmwareComparisonFilter.length > 0 &&
        currentFirmwareVersionFilter.length > 0
          ? this.checkFirmwareFilter(
              data,
              currentFirmwareComparisonFilter,
              currentFirmwareVersionFilter
            )
          : true;

      // All filters must pass (if they're active)
      return globalMatch && manufacturerMatch && firmwareMatch;
    };
  }

  private async initializeData() {
     this.client.get<CameraData[]>('/api/cameras', {
     }).subscribe(res =>{
      this.dataSource.data = res
     });

    this.client.get<any[]>('/weatherforecast').subscribe(
      (result) => {
      },
      (error) => {
        console.error(error);
      }
    );
  }

  // Apply global search filter
  applyGlobalFilter(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.globalFilter = inputElement.value.trim();

    // Always use the | delimiter format, even if one part is empty
    const combinedFilter = `${this.globalFilter}|${this.manufacturerFilter}|${this.firmwareComparisonFilter}|${this.firmwareVersionFilter}`;

    this.dataSource.filter = combinedFilter;
  }

  // Apply manufacturer filter
  applyManufacturerFilter(manufacturerValue: string): void {
    this.manufacturerFilter = manufacturerValue;

    // Always use the | delimiter format, even if one part is empty
    const combinedFilter = `${this.globalFilter}|${manufacturerValue}|${this.firmwareComparisonFilter}|${this.firmwareVersionFilter}`;

    this.dataSource.filter = combinedFilter;
  }

  // Apply firmware comparison filter
  applyFirmwareComparisonFilter(comparisonValue: string): void {
    this.firmwareComparisonFilter = comparisonValue;
    this.updateCombinedFilter();
  }

  // Apply firmware version filter
  applyFirmwareVersionFilter(versionValue: string): void {
    this.firmwareVersionFilter = versionValue;
    this.updateCombinedFilter();
  }
  private updateCombinedFilter(): void {
    const combinedFilter = `${this.globalFilter}|${this.manufacturerFilter}|${this.firmwareComparisonFilter}|${this.firmwareVersionFilter}`;

    this.dataSource.filter = combinedFilter;
  }
  // Helper method for global search
  private checkGlobalFilter(data: CameraData, globalFilter: string): boolean {
    if (!globalFilter || globalFilter.length === 0) return true;

    const filterValues = globalFilter
      .split(',')
      .map((val) => val.trim().toLowerCase());

    return filterValues.some((filterValue) => {
      return Object.keys(data).some((key) => {
        const value = data[key as keyof CameraData];
        if (value === null || value === undefined) return false;

        return value.toString().toLowerCase().includes(filterValue);
      });
    });
  }

  // Helper method for manufacturer filter
  private checkManufacturerFilter(
    data: CameraData,
    manufacturerFilter: string
  ): boolean {
    if (
      !manufacturerFilter ||
      manufacturerFilter.length === 0 ||
      !data.manufacturer
    )
      return true;

    return data.manufacturer
      .toString()
      .toLowerCase()
      .includes(manufacturerFilter.toLowerCase());
  }

  // Helper method for firmware version filter
  private checkFirmwareFilter(
    data: CameraData,
    comparison: string,
    targetVersion: string
  ): boolean {
    if (!comparison || !targetVersion || !data.firmwareVersion) return true;

    const dataVersion = data.firmwareVersion.toString();

    // Convert version strings to comparable numbers (e.g., "1.2" -> 1.2)
    const parseVersion = (version: string): number => {
      const parts = version.split('.');
      return parseFloat(parts[0] + '.' + (parts[1] || '0'));
    };

    const dataVersionNum = parseVersion(dataVersion);
    const targetVersionNum = parseVersion(targetVersion);

    switch (comparison) {
      case '=':
        return dataVersionNum === targetVersionNum;
      case '>':
        return dataVersionNum > targetVersionNum;
      case '<':
        return dataVersionNum < targetVersionNum;
      case '>=':
        return dataVersionNum >= targetVersionNum;
      case '<=':
        return dataVersionNum <= targetVersionNum;
      case '!=':
        return dataVersionNum !== targetVersionNum;
      default:
        return true;
    }
  }
  // Clear all filters
  clearFilters(): void {
    this.globalFilter = '';
    this.manufacturerFilter = '';
    this.firmwareComparisonFilter = '';
    this.firmwareVersionFilter = '';
    this.dataSource.filter = '';

    const inputElement = document.querySelector(
      'input[placeholder="Search cameras..."]'
    ) as HTMLInputElement;
    if (inputElement) {
      inputElement.value = '';
    }
  }
}
