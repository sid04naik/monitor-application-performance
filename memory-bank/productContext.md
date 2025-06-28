# Product Context

## Why This Project Exists
Performance testing is critical for application development, but setting up a complete monitoring stack locally can be complex and time-consuming. This project solves the problem by providing a pre-configured, containerized environment that developers can quickly spin up to test their applications' performance.

## Problems It Solves
1. **Complex Setup**: Eliminates the need to manually configure InfluxDB, Grafana, and K6
2. **Environment Consistency**: Ensures all developers use the same monitoring stack
3. **Local Development**: Enables performance testing without external dependencies
4. **Quick Iteration**: Allows rapid testing and validation of performance changes

## How It Should Work
1. **One-Command Setup**: `docker-compose up` starts the entire monitoring stack
2. **Test Execution**: K6 tests run against target applications and send metrics to InfluxDB
3. **Real-time Monitoring**: Grafana dashboards display performance metrics in real-time
4. **Custom Scenarios**: Developers can create custom K6 test scenarios for their specific needs

## User Experience Goals
- **Simple**: Minimal configuration required to get started
- **Fast**: Quick setup and test execution
- **Reliable**: Consistent results across different environments
- **Flexible**: Support for various test scenarios and configurations
- **Visual**: Clear, actionable performance insights through dashboards

## Key Workflows
1. **Initial Setup**: Clone repository, run docker-compose
2. **Test Creation**: Write K6 test scenarios in the tests/performance directory
3. **Test Execution**: Run K6 tests against target applications
4. **Monitoring**: View results in Grafana dashboards
5. **Analysis**: Analyze performance trends and identify bottlenecks

## Integration Points
- **K6**: Performance testing engine
- **InfluxDB**: Time-series database for metrics storage
- **Grafana**: Visualization and dashboard platform
- **Target Applications**: Applications being performance tested