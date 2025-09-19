export interface CameraData {
  id: string;
  enabled: boolean;
  deviceId: string;
  port: number;
  driver: string;
  password: string;
  audio: boolean;
  name: string;
  ipAddress: string;
  status: 'online' | 'offline' | 'error';
  resolution: string;
  frameRate: number;
  protocol: 'RTSP' | 'HTTP' | 'ONVIF';
  location: string;
  lastSeen: Date;
  recordingMode: 'continuous' | 'motion' | 'scheduled' | 'off';
  storageUsed: number; // in GB
  manufacturer: string;
  model: string;
  firmwareVersion: string;
}

export const generateCameraData = (count: number): CameraData[] => {
  const statuses: CameraData['status'][] = ['online', 'offline', 'error'];
  const protocols: CameraData['protocol'][] = ['RTSP', 'HTTP', 'ONVIF'];
  const recordingModes: CameraData['recordingMode'][] = ['continuous', 'motion', 'scheduled', 'off'];
  const manufacturers = ['Hikvision', 'Dahua', 'Axis', 'Uniview', 'Bosch', 'Sony'];
  const resolutions = ['1280x720', '1920x1080', '2560x1440', '2560x1920', '3840x2160'];
  const drivers = ['Generic RTSP', 'Dahua RTSP', 'Axis HTTP', 'Hikvision ISAPI', 'ONVIF Generic'];
  const locations = ['Building A', 'Building B', 'Parking Area', 'Warehouse', 'Perimeter'];
  const models = ['DS-2CD2085FWD-I', 'IPC-HDW2431T-ZS', 'M3046-V', 'IPC2122LR3-PF28-D', 'NBE-3502-AL'];

  const generateRandomDate = (start: Date, end: Date): Date => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  };

  const data: CameraData[] = [];

  for (let i = 1; i <= count; i++) {
    const id = `${i}`;
    const ipLastOctet = 100 + (i % 156); // Generate IPs like 192.168.1.100 to 192.168.1.255
    const camera: CameraData = {
      id,
      enabled: Math.random() > 0.3, // 70% chance of being enabled
      deviceId: `CAM-${String(i).padStart(3, '0')}`,
      port: Math.floor(Math.random() * (9000 - 554 + 1)) + 554, // Random port between 554 and 9000
      driver: drivers[Math.floor(Math.random() * drivers.length)],
      password: `pass${i}`,
      audio: Math.random() > 0.5,
      name: `Camera ${i}`,
      manufacturer: manufacturers[Math.floor(Math.random() * manufacturers.length)],
      firmwareVersion: `${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}`,
      ipAddress: `192.168.1.${ipLastOctet}`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      resolution: resolutions[Math.floor(Math.random() * resolutions.length)],
      frameRate: Math.floor(Math.random() * (30 - 15 + 1)) + 15, // 15 to 30 fps
      protocol: protocols[Math.floor(Math.random() * protocols.length)],
      location: `${locations[Math.floor(Math.random() * locations.length)]} - Area ${i % 10}`,
      lastSeen: generateRandomDate(new Date('2024-09-01'), new Date('2024-09-15')),
      recordingMode: recordingModes[Math.floor(Math.random() * recordingModes.length)],
      storageUsed: parseFloat((Math.random() * 50).toFixed(1)), // 0 to 50 GB
      model: models[Math.floor(Math.random() * models.length)],
    };
    data.push(camera);
  }

  return data;
};
// Sample camera data
export const CAMERA_DATA: CameraData[] = [
  {
    id: '1',
    enabled: true,
    deviceId: 'CAM-001',
    port: 8080,
    driver: 'Generic RTSP',
    password: 'admin123',
    audio: true,
    name: 'Front Entrance',
    ipAddress: '192.168.1.101',
    status: 'online',
    resolution: '1920x1080',
    frameRate: 30,
    protocol: 'RTSP',
    location: 'Building A - Main Gate',
    lastSeen: new Date('2024-09-15T10:30:00'),
    recordingMode: 'continuous',
    storageUsed: 15.6,
    manufacturer: 'Hikvision',
    model: 'DS-2CD2085FWD-I',
    firmwareVersion: '5.5.82'
  },
  {
    id: '2',
    enabled: false,
    deviceId: 'CAM-002',
    port: 8081,
    driver: 'Dahua RTSP',
    password: 'camera456',
    audio: false,
    name: 'Parking Lot West',
    ipAddress: '192.168.1.102',
    status: 'offline',
    resolution: '2560x1440',
    frameRate: 25,
    protocol: 'ONVIF',
    location: 'Parking Area - West Side',
    lastSeen: new Date('2024-09-14T18:45:00'),
    recordingMode: 'motion',
    storageUsed: 8.2,
    manufacturer: 'Dahua',
    model: 'IPC-HDW2431T-ZS',
    firmwareVersion: '2.820.0000000.18.R'
  },
  {
    id: '3',
    enabled: true,
    deviceId: 'CAM-003',
    port: 8082,
    driver: 'Axis HTTP',
    password: 'secure789',
    audio: true,
    name: 'Reception Area',
    ipAddress: '192.168.1.103',
    status: 'online',
    resolution: '1920x1080',
    frameRate: 30,
    protocol: 'HTTP',
    location: 'Building A - Reception',
    lastSeen: new Date('2024-09-15T11:00:00'),
    recordingMode: 'continuous',
    storageUsed: 12.4,
    manufacturer: 'Axis',
    model: 'M3046-V',
    firmwareVersion: '8.40.1'
  },
  {
    id: '4',
    enabled: true,
    deviceId: 'CAM-004',
    port: 554,
    driver: 'Generic RTSP',
    password: 'pass123',
    audio: false,
    name: 'Warehouse Entry',
    ipAddress: '192.168.1.104',
    status: 'error',
    resolution: '1280x720',
    frameRate: 15,
    protocol: 'RTSP',
    location: 'Warehouse - Main Entry',
    lastSeen: new Date('2024-09-15T09:15:00'),
    recordingMode: 'scheduled',
    storageUsed: 5.8,
    manufacturer: 'Uniview',
    model: 'IPC2122LR3-PF28-D',
    firmwareVersion: '1.0.0'
  },
  {
    id: '5',
    enabled: true,
    deviceId: 'CAM-005',
    port: 8083,
    driver: 'Hikvision ISAPI',
    password: 'hikvision2024',
    audio: true,
    name: 'Server Room',
    ipAddress: '192.168.1.105',
    status: 'online',
    resolution: '3840x2160',
    frameRate: 20,
    protocol: 'ONVIF',
    location: 'Building B - Server Room',
    lastSeen: new Date('2024-09-15T11:05:00'),
    recordingMode: 'continuous',
    storageUsed: 28.7,
    manufacturer: 'Hikvision',
    model: 'DS-2CD2785FWD-IZS',
    firmwareVersion: '5.6.3'
  },
  {
    id: '6',
    enabled: false,
    deviceId: 'CAM-006',
    port: 8084,
    driver: 'ONVIF Generic',
    password: 'maintenance',
    audio: false,
    name: 'Emergency Exit',
    ipAddress: '192.168.1.106',
    status: 'offline',
    resolution: '1920x1080',
    frameRate: 30,
    protocol: 'ONVIF',
    location: 'Building A - Emergency Exit',
    lastSeen: new Date('2024-09-13T16:20:00'),
    recordingMode: 'motion',
    storageUsed: 3.2,
    manufacturer: 'Bosch',
    model: 'NBE-3502-AL',
    firmwareVersion: '6.50.0'
  },
  {
    id: '7',
    enabled: true,
    deviceId: 'CAM-007',
    port: 80,
    driver: 'Axis HTTP',
    password: 'axis2024',
    audio: true,
    name: 'Conference Room A',
    ipAddress: '192.168.1.107',
    status: 'online',
    resolution: '1920x1080',
    frameRate: 30,
    protocol: 'HTTP',
    location: 'Building A - Conference Room A',
    lastSeen: new Date('2024-09-15T10:55:00'),
    recordingMode: 'scheduled',
    storageUsed: 7.9,
    manufacturer: 'Axis',
    model: 'M3025-VE',
    firmwareVersion: '8.40.1'
  },
  {
    id: '8',
    enabled: true,
    deviceId: 'CAM-008',
    port: 554,
    driver: 'Generic RTSP',
    password: 'outdoor123',
    audio: false,
    name: 'Perimeter North',
    ipAddress: '192.168.1.108',
    status: 'online',
    resolution: '2560x1920',
    frameRate: 25,
    protocol: 'RTSP',
    location: 'Perimeter - North Side',
    lastSeen: new Date('2024-09-15T11:02:00'),
    recordingMode: 'continuous',
    storageUsed: 18.3,
    manufacturer: 'Dahua',
    model: 'IPC-HFW2531T-ZS',
    firmwareVersion: '2.820.0000000.18.R'
  }
];