import { CameraData } from "./camera-data";

export interface GridColumn {
  property: string;
  label: string;
  type?: 'text' | 'checkbox' | 'radio' | 'password' | 'action' | 'status' | 'date' | 'number';
  sortable?: boolean;
  fixedWidth?: string;
  headerClass?: string;
  cellClass?: string;
  disabled?: boolean;
  showPassword?: boolean;
  unit?: string;
  options?: { value: any; label: string }[];
  resizable?:boolean;
  actions?: {
    name: string;
    icon: string;
    tooltip: string;
    class?: string;
    disabled?: (row: any) => boolean;
  }[];
}

export const grid_columns: GridColumn[] = [
    { 
      property: 'enabled', 
      label: 'Enabled', 
      type: 'checkbox', 
      fixedWidth: '80px',
      sortable: true 
    },
    { 
      property: 'deviceId', 
      label: 'Device Id', 
      type: 'text', 
      fixedWidth: '120px' ,
      sortable: true,
    },
    { 
      property: 'name', 
      label: 'Camera Name', 
      type: 'text', 
      fixedWidth: '180px' 
    },
    { 
      property: 'port', 
      label: 'Port', 
      type: 'number', 
      fixedWidth: '80px' 
    },
    { 
      property: 'driver', 
      label: 'Driver', 
      type: 'text', 
      fixedWidth: '140px' ,
      sortable: true 
    },
    { 
      property: 'manufacturer', 
      label: 'Manufacturer', 
      type: 'text', 
      fixedWidth: '120px' 
    },
    { 
      property: 'model', 
      label: 'Model', 
      type: 'text', 
      fixedWidth: '160px' 
    },
    { 
      property: 'firmwareVersion', 
      label: 'Firmware', 
      type: 'text', 
      fixedWidth: '130px' 
    },
    { 
      property: 'password', 
      label: 'Password', 
      type: 'password', 
      fixedWidth: '150px',
      sortable: false,
      showPassword: false
    },
    { 
      property: 'audio', 
      label: 'Audio', 
      type: 'checkbox', 
      fixedWidth: '80px',
      sortable: false 
    },
    { 
      property: 'status', 
      label: 'Status', 
      type: 'status', 
      fixedWidth: '110px' 
    },
    { 
      property: 'ipAddress', 
      label: 'IP Address', 
      type: 'text', 
      fixedWidth: '130px' 
    },
    { 
      property: 'resolution', 
      label: 'Resolution', 
      type: 'text', 
      fixedWidth: '120px' 
    },
    { 
      property: 'frameRate', 
      label: 'FPS', 
      type: 'number', 
      unit: ' fps',
      fixedWidth: '80px' 
    },
    { 
      property: 'protocol', 
      label: 'Protocol', 
      type: 'text', 
      fixedWidth: '100px' 
    },
    { 
      property: 'location', 
      label: 'Location', 
      type: 'text', 
      fixedWidth: '200px' 
    },
    { 
      property: 'lastSeen', 
      label: 'Last Seen', 
      type: 'date', 
      fixedWidth: '160px' 
    },
    { 
      property: 'recordingMode', 
      label: 'Recording', 
      type: 'radio',
      fixedWidth: '180px',
      sortable: false,
      options: [
        { value: 'continuous', label: 'Continuous' },
        { value: 'motion', label: 'Motion' },
        { value: 'scheduled', label: 'Scheduled' },
        { value: 'off', label: 'Off' }
      ]
    },
    { 
      property: 'storageUsed', 
      label: 'Storage', 
      type: 'number', 
      unit: ' GB',
      fixedWidth: '100px' 
    },
    {
      property: 'actions',
      label: 'Actions',
      type: 'action',
      fixedWidth: '200px',
      sortable: false,
      actions: [
        {
          name: 'edit',
          icon: 'edit',
          tooltip: 'Edit Camera',
          class: 'edit-btn'
        },
        {
          name: 'view',
          icon: 'videocam',
          tooltip: 'View Live Feed',
          class: 'view-btn',
          disabled: (row: CameraData) => row.status !== 'online'
        },
        {
          name: 'settings',
          icon: 'settings',
          tooltip: 'Camera Settings',
          class: 'settings-btn'
        },
        {
          name: 'delete',
          icon: 'delete',
          tooltip: 'Delete Camera',
          class: 'delete-btn'
        }
      ]
    }
  ];
