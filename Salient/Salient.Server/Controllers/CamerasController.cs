using Microsoft.AspNetCore.Mvc;
using Microsoft.OpenApi.Extensions;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Salient.Server.Controllers;
[Route("api/[controller]")]
[ApiController]
public class CamerasController : ControllerBase
{
    private static List<CameraData> _cameras = new();

    public CamerasController()
    {
        // Initialize with sample data if empty
        if (!_cameras.Any())
        {
            _cameras = GenerateCameraData(200);
        }
    }
    // <summary>
    /// Get all cameras
    /// </summary>
    [HttpGet]
    public IEnumerable<CameraData> GetCameras()
    {
        return _cameras;
    }


    public class CameraData
    {
        public string Id { get; set; } = string.Empty;
        public bool Enabled { get; set; }
        public string DeviceId { get; set; } = string.Empty;
        public int Port { get; set; }
        public string Driver { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public bool Audio { get; set; }
        public string Name { get; set; } = string.Empty;
        public string IpAddress { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string Resolution { get; set; } = string.Empty;
        public int FrameRate { get; set; }
        public CameraProtocol Protocol { get; set; }
        public string Location { get; set; } = string.Empty;
        public DateTime LastSeen { get; set; }
        public RecordingMode RecordingMode { get; set; }
        public double StorageUsed { get; set; } // in GB
        public string Manufacturer { get; set; } = string.Empty;
        public string Model { get; set; } = string.Empty;
        public string FirmwareVersion { get; set; } = string.Empty;
    }

    public enum CameraStatus
    {
        Online,
        Offline,
        Error
    }

    public enum CameraProtocol
    {
        RTSP,
        HTTP,
        ONVIF
    }

    public enum RecordingMode
    {
        Continuous,
        Motion,
        Scheduled,
        Off
    }

    /// <summary>
    /// Generate sample camera data
    /// </summary>
    private static List<CameraData> GenerateCameraData(int count)
    {
        var random = new Random();
        var statuses = Enum.GetValues<CameraStatus>();
        var protocols = Enum.GetValues<CameraProtocol>();
        var recordingModes = Enum.GetValues<RecordingMode>();
        var manufacturers = new[] { "Hikvision", "Dahua", "Axis", "Uniview", "Bosch", "Sony" };
        var resolutions = new[] { "1280x720", "1920x1080", "2560x1440", "2560x1920", "3840x2160" };
        var drivers = new[] { "Generic RTSP", "Dahua RTSP", "Axis HTTP", "Hikvision ISAPI", "ONVIF Generic" };
        var locations = new[] { "Building A", "Building B", "Parking Area", "Warehouse", "Perimeter" };
        var models = new[] { "DS-2CD2085FWD-I", "IPC-HDW2431T-ZS", "M3046-V", "IPC2122LR3-PF28-D", "NBE-3502-AL" };

        var cameras = new List<CameraData>();

        for (int i = 1; i <= count; i++)
        {
            var ipLastOctet = 100 + (i % 156);
            var camera = new CameraData
            {
                Id = i.ToString(),
                Enabled = random.NextDouble() > 0.3,
                DeviceId = $"CAM-{i:D3}",
                Port = random.Next(554, 9001),
                Driver = drivers[random.Next(drivers.Length)],
                Password = $"pass{i}",
                Audio = random.NextDouble() > 0.5,
                Name = $"Camera {i}",
                Manufacturer = manufacturers[random.Next(manufacturers.Length)],
                FirmwareVersion = $"{random.Next(1, 10)}.{random.Next(0, 10)}",
                IpAddress = $"192.168.1.{ipLastOctet}",
                Status = statuses[random.Next(statuses.Length)].GetDisplayName(),
                Resolution = resolutions[random.Next(resolutions.Length)],
                FrameRate = random.Next(15, 31),
                Protocol = protocols[random.Next(protocols.Length)],
                Location = $"{locations[random.Next(locations.Length)]} - Area {i % 10}",
                LastSeen = DateTime.Now.AddDays(-random.Next(0, 15)),
                RecordingMode = recordingModes[random.Next(recordingModes.Length)],
                StorageUsed = Math.Round(random.NextDouble() * 50, 1),
                Model = models[random.Next(models.Length)],
            };

            cameras.Add(camera);
        }

        return cameras;
    }
}
