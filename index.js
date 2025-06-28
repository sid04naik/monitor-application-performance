#!/usr/bin/env node

import { spawn } from 'child_process';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import dotenv from 'dotenv';
import heapdump from 'heapdump';

// Load environment variables
dotenv.config();

class PerformanceMonitor {
  constructor() {
    this.services = {
      grafana: { port: 3000, url: 'http://localhost:3000' },
      influxdb: { port: 8086, url: 'http://localhost:8086/ping' }
    };
    this.heapdumpEnabled = process.env.HEAPDUMP_ENABLED === 'true';
    this.heapdumpDir = process.env.HEAPDUMP_DIR || 'heapdumps';
    this.initHeapdump();
  }

  /**
   * Initialize heapdump functionality
   */
  initHeapdump() {
    if (this.heapdumpEnabled) {
      // Create heapdump directory
      if (!existsSync(this.heapdumpDir)) {
        mkdirSync(this.heapdumpDir, { recursive: true });
        console.log(`📁 Created heapdump directory: ${this.heapdumpDir}`);
      }

      // Setup heapdump signal handlers
      process.on('SIGUSR2', () => {
        this.takeHeapSnapshot('signal');
      });

      // Setup periodic heap snapshots if enabled
      const snapshotInterval = process.env.HEAPDUMP_INTERVAL;
      if (snapshotInterval && !isNaN(snapshotInterval)) {
        setInterval(() => {
          this.takeHeapSnapshot('periodic');
        }, parseInt(snapshotInterval) * 1000);
        console.log(`⏰ Periodic heap snapshots enabled (every ${snapshotInterval}s)`);
      }

      console.log('🔍 Heapdump monitoring enabled');
    }
  }

  /**
   * Take a heap snapshot
   */
  takeHeapSnapshot(type = 'manual') {
    if (!this.heapdumpEnabled) {
      console.log('⚠️  Heapdump is not enabled. Set HEAPDUMP_ENABLED=true to enable.');
      return;
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `heapdump-${type}-${timestamp}.heapsnapshot`;
    const filepath = join(this.heapdumpDir, filename);

    heapdump.writeSnapshot(filepath, (err, filename) => {
      if (err) {
        console.error('❌ Failed to take heap snapshot:', err);
      } else {
        console.log(`📸 Heap snapshot saved: ${filename}`);

        // Log memory usage
        const memUsage = process.memoryUsage();
        console.log(`💾 Memory usage:`, {
          rss: `${Math.round(memUsage.rss / 1024 / 1024)}MB`,
          heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)}MB`,
          heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`,
          external: `${Math.round(memUsage.external / 1024 / 1024)}MB`
        });
      }
    });
  }

  /**
   * Initialize the performance monitoring system
   */
  async init() {
    console.log('🚀 Initializing Performance Monitoring System...');

    // Create necessary directories
    this.createDirectories();

    // Check if services are running
    await this.checkServices();

    console.log('✅ Performance monitoring system initialized successfully!');
    console.log('\n📊 Access your services:');
    console.log(`   Grafana Dashboard: ${this.services.grafana.url} (admin/admin)`);
    console.log(`   InfluxDB: http://localhost:${this.services.influxdb.port} (administrator/administrator)`);
    console.log('\n📝 Available commands:');
    console.log('   npm run test      - Run performance tests');
    console.log('   npm run test:all  - Run all performance tests');
    console.log('   npm run setup     - Start Docker services');
    console.log('   npm run stop      - Stop Docker services');
    if (this.heapdumpEnabled) {
      console.log('   npm run heapdump:manual - Take manual heap snapshot');
      console.log('   kill -USR2 <pid>  - Take heap snapshot via signal');
    }
  }

  /**
   * Create necessary directories
   */
  createDirectories() {
    const dirs = ['data', 'data/grafana', 'data/influxdb', 'log'];

    if (this.heapdumpEnabled) {
      dirs.push(this.heapdumpDir);
    }

    dirs.forEach(dir => {
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
        console.log(`📁 Created directory: ${dir}`);
      }
    });
  }

  /**
   * Check if required services are running
   */
  async checkServices() {
    console.log('🔍 Checking service status...');

    for (const [service, config] of Object.entries(this.services)) {
      try {
        const response = await fetch(config.url);
        if (response.ok || response.status === 204) { // 204 is expected for InfluxDB ping
          console.log(`✅ ${service} is running on port ${config.port}`);
        } else {
          console.log(`⚠️  ${service} responded with status ${response.status}`);
        }
      } catch (error) {
        console.log(`❌ ${service} is not running on port ${config.port}`);
        console.log(`   Start services with: npm run setup`);
      }
    }
  }

  /**
   * Run K6 performance tests
   */
  async runTests(testFile = 'tests/performance/lots.js') {
    console.log(`🧪 Running performance tests: ${testFile}`);

    // Take heap snapshot before test if enabled
    if (this.heapdumpEnabled) {
      console.log('📸 Taking pre-test heap snapshot...');
      this.takeHeapSnapshot('pre-test');
    }

    return new Promise((resolve, reject) => {
      const k6 = spawn('k6', ['run', testFile], {
        stdio: 'inherit',
        shell: true
      });

      k6.on('close', (code) => {
        // Take heap snapshot after test if enabled
        if (this.heapdumpEnabled) {
          console.log('📸 Taking post-test heap snapshot...');
          this.takeHeapSnapshot('post-test');
        }

        if (code === 0) {
          console.log('✅ Performance tests completed successfully');
          resolve();
        } else {
          console.log(`❌ Performance tests failed with code ${code}`);
          reject(new Error(`K6 tests failed with code ${code}`));
        }
      });

      k6.on('error', (error) => {
        console.error('❌ Failed to start K6 tests:', error.message);
        console.log('💡 Make sure K6 is installed: npm run install-k6');
        reject(error);
      });
    });
  }

  /**
   * Display system information
   */
  showInfo() {
    console.log('\n📋 Performance Monitoring System Info:');
    console.log('=====================================');
    console.log('🏗️  Architecture:');
    console.log('   • K6: Performance testing engine');
    console.log('   • InfluxDB: Time-series database for metrics');
    console.log('   • Grafana: Visualization and dashboards');
    console.log('   • Docker: Container orchestration');
    if (this.heapdumpEnabled) {
      console.log('   • Heapdump: Memory profiling and snapshots');
    }

    console.log('\n🔧 Configuration:');
    console.log('   • Database: K6');
    console.log('   • Grafana Admin: admin/admin');
    console.log('   • InfluxDB Admin: administrator/administrator');
    if (this.heapdumpEnabled) {
      console.log(`   • Heapdump Directory: ${this.heapdumpDir}`);
      console.log('   • Heapdump Enabled: true');
    }

    console.log('\n📁 Project Structure:');
    console.log('   • tests/performance/: K6 test scenarios');
    console.log('   • dashboard/: Grafana dashboard configurations');
    console.log('   • data/: Persistent data storage');
    console.log('   • log/: Application logs');
    if (this.heapdumpEnabled) {
      console.log(`   • ${this.heapdumpDir}/: Heap snapshots`);
    }
  }
}

// Main execution
async function main() {
  const monitor = new PerformanceMonitor();

  try {
    const command = process.argv[2];

    switch (command) {
      case 'test':
        await monitor.runTests();
        break;
      case 'test:all':
        await monitor.runTests('tests/performance/*.js');
        break;
      case 'heapdump':
        monitor.takeHeapSnapshot('manual');
        break;
      case 'info':
        monitor.showInfo();
        break;
      default:
        await monitor.init();
        monitor.showInfo();
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export default PerformanceMonitor;
