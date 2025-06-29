# System Patterns

## Architecture Overview
The system follows a minimal microservices architecture using Docker containers, with each service having a specific responsibility:

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│     K6      │───▶│  InfluxDB   │───▶│   Grafana   │
│   Tests     │    │   (1.8)     │    │  Dashboard  │
│ (Global)    │    │             │    │             │
└─────────────┘    └─────────────┘    └─────────────┘
```

## Key Technical Decisions

### 1. Containerization Strategy
- **Docker Compose**: Orchestrates Grafana and InfluxDB services
- **Bridge Network**: Enables inter-service communication
- **Volume Mounting**: Persists data across container restarts
- **No Node.js Container**: Eliminated to reduce complexity

### 2. Database Choice
- **InfluxDB 1.8**: Time-series database optimized for metrics storage
- **Database Name**: "K6" (configured in environment)
- **Admin Credentials**: administrator/administrator

### 3. Visualization Platform
- **Grafana**: Industry-standard for metrics visualization
- **Port**: 3000 (accessible at http://localhost:3000)
- **Admin Password**: "admin"
- **Pre-configured Dashboards**: Available in dashboard/ directory

### 4. Performance Testing
- **K6**: Modern load testing tool with JavaScript-based test scripts
- **Global Installation**: K6 installed system-wide for maximum compatibility
- **Test Structure**: Tests stored in `tests/` directory
- **Configuration**: Environment-based configuration for different targets

## Design Patterns

### 1. Service Isolation
```yaml
services:
  grafana:
    container_name: map-grafana
    # Grafana configuration

  influxdb:
    container_name: map-influxdb_v1
    # InfluxDB configuration
```

### 2. Data Persistence
```yaml
volumes:
  - ./data/grafana:/var/lib/grafana
  - ./data/influxdb:/var/lib/influxdb
```

### 3. Network Configuration
```yaml
networks:
  bridge:
    driver: bridge
```

## Component Relationships

### Service Dependencies
1. **InfluxDB**: Receives metrics from K6 tests
2. **Grafana**: Reads from InfluxDB to display dashboards

### Data Flow
1. K6 tests execute against target applications
2. Performance metrics sent to InfluxDB
3. Grafana queries InfluxDB for visualization
4. Users view dashboards in Grafana web interface

## Security Considerations
- **Network Isolation**: Services communicate via Docker bridge network
- **Admin Credentials**: Default credentials for local development
- **Data Persistence**: Metrics stored in local volumes

## Scalability Patterns
- **Horizontal Scaling**: Multiple K6 instances can run simultaneously
- **Data Retention**: InfluxDB handles time-series data efficiently
- **Dashboard Sharing**: Grafana supports multiple users and dashboards

## File Organization
```
monitor-application-performance/
├── dashboard/              # Pre-configured Grafana dashboards
├── tests/                  # K6 test scenarios
├── data/                   # Persistent data storage
├── docker-compose.yml      # Service orchestration
└── README.md              # Documentation
```