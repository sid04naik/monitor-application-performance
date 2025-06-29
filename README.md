# Monitor Application Performance

A lightweight local performance monitoring solution designed to test application performance on a local machine and visualize results through a Grafana dashboard. The system uses Docker Compose to orchestrate Grafana and InfluxDB services, with K6 installed globally for performance testing.

## 🚀 Features

- **Performance Testing**: Execute K6 performance tests against target applications
- **Real-time Monitoring**: Visualize performance metrics through Grafana dashboards
- **Data Persistence**: Store metrics in InfluxDB time-series database
- **Easy Setup**: One-command Docker Compose setup
- **Custom Scenarios**: Support for custom K6 test scenarios
- **Local Development**: Complete local environment for performance testing
- **Minimal Dependencies**: No Node.js runtime required, only Docker and K6

## 🏗️ Architecture

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│     K6      │───▶│  InfluxDB   │───▶│   Grafana   │
│   Tests     │    │   (1.8)     │    │  Dashboard  │
│ (Global)    │    │             │    │             │
└─────────────┘    └─────────────┘    └─────────────┘
```

## 📋 Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/)
- [K6](https://k6.io/docs/getting-started/installation/) (globally installed)

## 🛠️ Installation

### 1. Install K6 Globally

**macOS:**
```bash
brew install k6
```

**Ubuntu/Debian:**
```bash
sudo gpg -k
sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update
sudo apt-get install k6
```

**Windows:**
```bash
choco install k6
```

### 2. Clone and Setup

```bash
# Clone the repository
git clone https://github.com/sid04naik/monitor-application-performance.git
cd monitor-application-performance

# Start the monitoring services
docker-compose up -d
```

## 🚀 Quick Start

1. **Start Services**
   ```bash
   docker-compose up -d
   ```

2. **Create a Test**
   Create a K6 test file in the `tests/` directory:
   ```javascript
   // tests/example-test.js
   import http from 'k6/http';
   import { check, sleep } from 'k6';

   export const options = {
     vus: 10,
     duration: '30s',
     thresholds: {
       http_req_duration: ['p(95)<500'],
     },
   };

   export default function () {
     const res = http.get('https://httpbin.org/get');
     check(res, { 'status is 200': (r) => r.status === 200 });
     sleep(1);
   }
   ```

3. **Run Performance Tests**
   ```bash
   # Run with InfluxDB output
   k6 run --out influxdb=http://localhost:8086/k6 tests/example-test.js
   ```

4. **View Results in Grafana**
   - Open [http://localhost:3000](http://localhost:3000)
   - Login with `admin/admin`
   - Import dashboards from the `dashboard/` directory

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

### Basic Test Execution
```bash
# Run a test file
k6 run tests/your-test.js

# Run with InfluxDB output
k6 run --out influxdb=http://localhost:8086/k6 tests/your-test.js

# Run with multiple outputs
k6 run --out influxdb=http://localhost:8086/k6 --out json=results.json tests/your-test.js
```

### Test Configuration Examples

**Load Test:**
```javascript
export const options = {
  stages: [
    { duration: '2m', target: 10 }, // Ramp up
    { duration: '5m', target: 10 }, // Stay at 10 users
    { duration: '2m', target: 0 },  // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.1'],
  },
};
```

**Stress Test:**
```javascript
export const options = {
  stages: [
    { duration: '1m', target: 20 },
    { duration: '3m', target: 20 },
    { duration: '1m', target: 50 },
    { duration: '5m', target: 50 },
    { duration: '1m', target: 100 },
    { duration: '3m', target: 100 },
    { duration: '2m', target: 0 },
  ],
};
```

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

3. **Import Pre-configured Dashboards**
   - Go to Dashboards → Import
   - Upload dashboard files from the `dashboard/` directory:
     - `k6-dashboard-1.json`
     - `K6-dashboard-2.json`

## 📁 Project Structure

```
monitor-application-performance/
├── dashboard/              # Pre-configured Grafana dashboards
│   ├── k6-dashboard-1.json # Comprehensive K6 metrics dashboard
│   └── K6-dashboard-2.json # Additional K6 dashboard
├── tests/                  # K6 test scenarios
│   └── .gitkeep           # Placeholder for test files
├── data/                   # Persistent data storage
│   ├── grafana/           # Grafana data
│   └── influxdb/          # InfluxDB data
├── log/                   # Application logs
├── specs/                 # Backup folder (can be ignored)
├── docker-compose.yml     # Docker services configuration
└── README.md             # This file
```

## 🔧 Available Commands

| Command | Description |
|---------|-------------|
| `docker-compose up -d` | Start Grafana and InfluxDB services |
| `docker-compose down` | Stop all services |
| `docker-compose logs -f` | View service logs |
| `docker-compose down -v` | Stop services and remove volumes |
| `k6 run tests/your-test.js` | Run a K6 test |
| `k6 run --out influxdb=http://localhost:8086/k6 tests/your-test.js` | Run test with InfluxDB output |

## 🐛 Troubleshooting

### Common Issues

1. **K6 not found**
   ```bash
   # Verify K6 installation
   k6 version

   # Reinstall if needed
   brew install k6  # macOS
   ```

2. **Services not starting**
   ```bash
   # Check Docker status
   docker ps

   # View logs
   docker-compose logs
   ```

3. **Port conflicts**
   - Check if ports 3000 or 8086 are already in use
   - Modify ports in `docker-compose.yml` if needed

4. **Permission issues**
   ```bash
   # Ensure Docker has proper permissions
   sudo usermod -aG docker $USER
   ```

### Logs and Debugging

```bash
# View all service logs
docker-compose logs -f

# View specific service logs
docker-compose logs grafana
docker-compose logs influxdb

# Check service status
docker-compose ps

# Test InfluxDB connection
curl http://localhost:8086/ping
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

## 📚 Additional Resources

- [K6 Documentation](https://k6.io/docs/)
- [Grafana Documentation](https://grafana.com/docs/)
- [InfluxDB Documentation](https://docs.influxdata.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [K6 Installation Guide](https://k6.io/docs/getting-started/installation/)
