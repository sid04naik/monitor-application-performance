# Product Context

## Why This Project Exists
Performance testing is critical for application development, but setting up a complete monitoring stack locally can be complex and time-consuming. This project solves the problem by providing a pre-configured, containerized environment that developers can quickly spin up to test their applications' performance without requiring Node.js or other runtime dependencies.

## Problems It Solves
1. **Complex Setup**: Eliminates the need to manually configure InfluxDB and Grafana
2. **Environment Consistency**: Ensures all developers use the same monitoring stack
3. **Local Development**: Enables performance testing without external dependencies
4. **Quick Iteration**: Allows rapid testing and validation of performance changes
5. **Minimal Dependencies**: No Node.js runtime required, reducing system complexity
6. **Global K6**: Uses globally installed K6 for maximum compatibility

## How It Should Work
1. **One-Command Setup**: `docker-compose up` starts Grafana and InfluxDB
2. **Test Execution**: K6 tests run against target applications and send metrics to InfluxDB
3. **Real-time Monitoring**: Grafana dashboards display performance metrics in real-time
4. **Custom Scenarios**: Developers can create custom K6 test scenarios in the tests folder
5. **Dashboard Import**: Pre-configured dashboards can be imported into Grafana

## User Experience Goals
- **Simple**: Minimal configuration required to get started
- **Fast**: Quick setup and test execution
- **Reliable**: Consistent results across different environments
- **Flexible**: Support for various test scenarios and configurations
- **Visual**: Clear, actionable performance insights through dashboards
- **Lightweight**: No additional runtime dependencies beyond Docker and K6

## Key Workflows
1. **Initial Setup**: Clone repository, run docker-compose up
2. **Test Creation**: Write K6 test scenarios in the tests directory
3. **Test Execution**: Run K6 tests against target applications
4. **Monitoring**: View results in Grafana dashboards
5. **Analysis**: Analyze performance trends and identify bottlenecks

## Integration Points
- **K6**: Performance testing engine (globally installed)
- **InfluxDB**: Time-series database for metrics storage
- **Grafana**: Visualization and dashboard platform
- **Target Applications**: Applications being performance tested
- **Docker Compose**: Container orchestration