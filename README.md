# Monitor Application Performance

A local performance monitoring solution designed to test application performance on a local machine and visualize results through a Grafana dashboard.

## 🚀 Features

- **Performance Testing**: Execute K6 performance tests against target applications
- **Real-time Monitoring**: Visualize performance metrics through Grafana dashboards
- **Data Persistence**: Store metrics in InfluxDB time-series database
- **Easy Setup**: One-command Docker Compose setup
- **Custom Scenarios**: Support for custom K6 test scenarios
- **Local Development**: Complete local environment for performance testing
- **Memory Profiling**: Heap snapshots for debugging memory issues

## 🏗️ Architecture

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│     K6      │───▶│  InfluxDB   │───▶│   Grafana   │
│   Tests     │    │   (1.8)     │    │  Dashboard  │
└─────────────┘    └─────────────┘    └─────────────┘
         │
         ▼
┌─────────────┐
│  Heapdump   │
│  Snapshots  │
└─────────────┘
```

## 📋 Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/)
- [Node.js](https://nodejs.org/) (version 22 or higher)
- [K6](https://k6.io/docs/getting-started/installation/) (for running performance tests)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/sid04naik/monitor-application-performance.git
   cd monitor-application-performance
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install K6** (if not already installed)
   ```bash
   npm run install-k6
   ```

4. **Start the monitoring services**
   ```bash
   npm run setup
   ```

## 🚀 Quick Start

1. **Initialize the system**
   ```bash
   npm start
   ```

2. **Run performance tests**
   ```bash
   npm run test
   ```

3. **View results in Grafana**
   - Open [http://localhost:3000](http://localhost:3000)
   - Login with `admin/admin`
   - Configure InfluxDB data source (see configuration section)

## 📊 Services

### Grafana Dashboard
- **URL**: [http://localhost:3000](http://localhost:3000)
- **Username**: `admin`
- **Password**: `admin`
- **Purpose**: Visualize performance metrics and create dashboards

### InfluxDB Database
- **URL**: [http://localhost:8086](http://localhost:8086)
- **Username**: `administrator`
- **Password**: `administrator`
- **Database**: `K6`
- **Purpose**: Store time-series performance metrics

## 🧪 Running Tests

### Available Commands

```bash
# Run the default test scenario
npm run test

# Run all test scenarios
npm run test:all

# Run a specific test file
k6 run tests/performance/your-test.js
```

### Test Configuration

Tests are located in the `tests/performance/` directory. Each test file should:

1. Import required K6 modules
2. Define test configuration and thresholds
3. Implement test scenarios using K6's HTTP client

Example test structure:
```javascript
import http from "k6/http";
import { check, group, sleep } from "k6";

export const options = {
  vus: 2,
  duration: "10s",
  thresholds: {
    checks: ["rate >= 1.0"],
    "http_req_duration": ["p(95) < 250"],
  },
};

export default function () {
  // Your test logic here
}
```

## 🔍 Memory Profiling with Heapdump

The application includes heapdump functionality for taking memory snapshots during performance testing.

### Configuration

Add heapdump settings to your `.env` file:

```env
# Heapdump Configuration
HEAPDUMP_ENABLED=true
HEAPDUMP_DIR=heapdumps
HEAPDUMP_INTERVAL=300
```

### Usage

#### Automatic Snapshots
- **Pre/Post Test**: Snapshots are automatically taken before and after test execution
- **Periodic Snapshots**: Set `HEAPDUMP_INTERVAL` for automatic snapshots every N seconds
- **Signal-based**: Send `SIGUSR2` signal to take snapshots on demand

#### Manual Snapshots
```bash
# Take a manual heap snapshot
npm run heapdump:manual

# Using the standalone tool
node heapdump-manual.js take
node heapdump-manual.js take pre-test
node heapdump-manual.js list
node heapdump-manual.js clean 7
```

#### Signal-based Snapshots
```bash
# Find the process ID
ps aux | grep node

# Send SIGUSR2 signal to take snapshot
kill -USR2 <process_id>
```

### Analyzing Heap Snapshots

Heap snapshots are saved in the `heapdumps/` directory and can be analyzed using:

1. **Chrome DevTools**:
   - Open Chrome DevTools
   - Go to Memory tab
   - Load the `.heapsnapshot` file

2. **Node.js Inspector**:
   ```bash
   node --inspect heapdump-analyzer.js
   ```

3. **Online Tools**:
   - [Chrome DevTools Memory Panel](https://developers.google.com/web/tools/chrome-devtools/memory-problems)

### Memory Usage Monitoring

The application logs memory usage when taking snapshots:

```
💾 Memory usage: {
  rss: "45MB",
  heapTotal: "20MB",
  heapUsed: "15MB",
  external: "2MB"
}
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Test Configuration
TEST_HOST=https://your-api-endpoint.com
TEST_TOKEN=your-auth-token

# Service Configuration
GRAFANA_PORT=3000
INFLUXDB_PORT=8086

# Heapdump Configuration
HEAPDUMP_ENABLED=true
HEAPDUMP_DIR=heapdumps
HEAPDUMP_INTERVAL=300
```

### Docker Compose Configuration

The `docker-compose.yml` file configures:
- **Grafana**: Visualization platform
- **InfluxDB**: Time-series database
- **Node.js**: Application runtime

## 📁 Project Structure

```
monitor-application-performance/
├── dashboard/              # Grafana dashboard configurations
├── tests/
│   └── performance/        # K6 test scenarios
│       ├── lots.js         # Example performance test
│       ├── api-load-test.js # API load testing
│       └── stress-test.js  # Stress testing
├── heapdumps/             # Heap snapshots (when enabled)
├── data/                   # Persistent data storage
│   ├── grafana/           # Grafana data
│   └── influxdb/          # InfluxDB data
├── log/                   # Application logs
├── memory-bank/           # Project documentation
├── docker-compose.yml     # Docker services configuration
├── index.js              # Main application entry point
├── heapdump-manual.js    # Standalone heapdump tool
├── package.json          # Node.js dependencies and scripts
└── README.md             # This file
```

## 🔧 Available Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Initialize the performance monitoring system |
| `npm run dev` | Start in development mode with file watching |
| `npm run test` | Run the default performance test |
| `npm run test:all` | Run all performance tests |
| `npm run setup` | Start Docker services |
| `npm run stop` | Stop Docker services |
| `npm run logs` | View Docker service logs |
| `npm run clean` | Clean up all data and containers |
| `npm run install-k6` | Install K6 globally |
| `npm run heapdump` | Start with heapdump signal support |
| `npm run heapdump:manual` | Take manual heap snapshot |

## 📈 Setting Up Grafana Dashboards

1. **Access Grafana**
   - Open [http://localhost:3000](http://localhost:3000)
   - Login with `admin/admin`

2. **Add InfluxDB Data Source**
   - Go to Configuration → Data Sources
   - Click "Add data source"
   - Select "InfluxDB"
   - Configure:
     - **URL**: `http://influxdb_v1:8086`
     - **Database**: `K6`
     - **User**: `administrator`
     - **Password**: `administrator`

3. **Create Dashboards**
   - Import dashboard configurations from the `dashboard/` directory
   - Or create custom dashboards using InfluxDB queries

## 🐛 Troubleshooting

### Common Issues

1. **K6 not found**
   ```bash
   npm run install-k6
   ```

2. **Services not starting**
   ```bash
   # Check Docker status
   docker ps

   # View logs
   npm run logs
   ```

3. **Port conflicts**
   - Check if ports 3000 or 8086 are already in use
   - Modify ports in `docker-compose.yml` if needed

4. **Permission issues**
   ```bash
   # Ensure Docker has proper permissions
   sudo usermod -aG docker $USER
   ```

5. **Heapdump issues**
   ```bash
   # Check if heapdump is enabled
   echo $HEAPDUMP_ENABLED

   # Take manual snapshot
   npm run heapdump:manual

   # Check heapdump directory
   ls -la heapdumps/
   ```

### Logs and Debugging

```bash
# View all service logs
npm run logs

# View specific service logs
docker-compose logs grafana
docker-compose logs influxdb

# Check service status
docker-compose ps

# Check memory usage
node heapdump-manual.js take
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Siddhant Naik**
- GitHub: [@sid04naik](https://github.com/sid04naik)

## 🙏 Acknowledgments

- [K6](https://k6.io/) - Modern load testing tool
- [Grafana](https://grafana.com/) - Metrics visualization platform
- [InfluxDB](https://www.influxdata.com/) - Time-series database
- [Docker](https://www.docker.com/) - Containerization platform
- [Heapdump](https://github.com/bnoordhuis/node-heapdump) - Memory profiling

## 📚 Additional Resources

- [K6 Documentation](https://k6.io/docs/)
- [Grafana Documentation](https://grafana.com/docs/)
- [InfluxDB Documentation](https://docs.influxdata.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Node.js Memory Profiling](https://nodejs.org/en/docs/guides/memory-profiling/)
- [Chrome DevTools Memory](https://developers.google.com/web/tools/chrome-devtools/memory-problems)