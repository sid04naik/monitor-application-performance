# System Patterns

## Architecture Overview
The system follows a microservices architecture pattern using Docker containers, with each service having a specific responsibility:

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│     K6      │───▶│  InfluxDB   │───▶│   Grafana   │
│   Tests     │    │   (1.8)     │    │  Dashboard  │
└─────────────┘    └─────────────┘    └─────────────┘
```

## Key Technical Decisions

### 1. Containerization Strategy
- **Docker Compose**: Orchestrates all services in a single configuration
- **Bridge Network**: Enables inter-service communication
- **Volume Mounting**: Persists data across container restarts

### 2. Database Choice
- **InfluxDB 1.8**: Time-series database optimized for metrics storage
- **Database Name**: "K6" (configured in environment)
- **Admin Credentials**: administrator/administrator

### 3. Visualization Platform
- **Grafana**: Industry-standard for metrics visualization
- **Port**: 3000 (accessible at http://localhost:3000)
- **Admin Password**: "admin"

### 4. Performance Testing
- **K6**: Modern load testing tool with JavaScript-based test scripts
- **Test Structure**: Modular tests in `tests/performance/` directory
- **Configuration**: Environment-based configuration for different targets

## Design Patterns

### 1. Configuration Pattern
```javascript
const configuration = {
  host: "https://dev.albertinventdev.com",
  performanceTester: {
    name: "performanceTester",
    email: "performanceTester@albertinvent.com",
    // ... other config
  }
};
```

### 2. Test Group Pattern
```javascript
group("CREATE", function () {
  // Test logic for creation operations
});

group("DELETE", function () {
  // Test logic for deletion operations
});
```

### 3. Threshold Monitoring
```javascript
thresholds: {
  checks: ["rate >= 1.0"],
  "http_req_duration{group:::CREATE}": ["p(95) < 250"],
  "http_req_duration{group:::DELETE}": ["p(95) < 250"],
}
```

## Component Relationships

### Service Dependencies
1. **Node.js Container**: Handles npm install and potential future application logic
2. **InfluxDB**: Receives metrics from K6 tests
3. **Grafana**: Reads from InfluxDB to display dashboards

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