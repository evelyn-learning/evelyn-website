import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import mongoose from 'mongoose';
import { exec } from 'child_process';
import { promisify } from 'util';
import os from 'os';

const execAsync = promisify(exec);

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  uptime: number;
  database: {
    status: 'connected' | 'disconnected' | 'error';
    latency?: number;
  };
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  disk: {
    used: number;
    total: number;
    percentage: number;
    available: number;
  };
  server: {
    hostname: string;
    platform: string;
    cpuCores: number;
  };
  environment: string;
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const startTime = Date.now();
  const health: HealthStatus = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: {
      status: 'disconnected',
    },
    memory: {
      used: 0,
      total: 0,
      percentage: 0,
    },
    disk: {
      used: 0,
      total: 0,
      percentage: 0,
      available: 0,
    },
    server: {
      hostname: os.hostname(),
      platform: os.platform(),
      cpuCores: os.cpus().length,
    },
    environment: process.env.NODE_ENV || 'development',
  };

  // Check database connection
  try {
    await connectDB();
    const dbStartTime = Date.now();

    // Ping the database to check latency
    if (mongoose.connection.db) {
      await mongoose.connection.db.admin().ping();
      health.database.status = 'connected';
      health.database.latency = Date.now() - dbStartTime;
    } else {
      health.database.status = 'disconnected';
      health.status = 'degraded';
    }
  } catch (error) {
    console.error('[HEALTH] Database error:', error);
    health.database.status = 'error';
    health.status = 'unhealthy';
  }

  // Check memory usage (system-wide, not just Node.js heap)
  try {
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    health.memory = {
      used: Math.round(usedMem / 1024 / 1024), // MB
      total: Math.round(totalMem / 1024 / 1024), // MB
      percentage: Math.round((usedMem / totalMem) * 100),
    };

    // Flag if memory usage is high
    if (health.memory.percentage > 90) {
      health.status = health.status === 'healthy' ? 'degraded' : health.status;
    }
  } catch (error) {
    console.error('[HEALTH] Memory check error:', error);
  }

  // Check disk space (works on Linux/Mac)
  try {
    const { stdout } = await execAsync("df -k / | tail -1 | awk '{print $2,$3,$4}'");
    const [total, used, available] = stdout.trim().split(' ').map(Number);

    if (total && used && available) {
      health.disk = {
        total: Math.round(total / 1024), // MB
        used: Math.round(used / 1024), // MB
        available: Math.round(available / 1024), // MB
        percentage: Math.round((used / total) * 100),
      };

      // Flag if disk usage is high (>90%)
      if (health.disk.percentage > 90) {
        health.status = health.status === 'healthy' ? 'degraded' : health.status;
      }
    }
  } catch (error) {
    console.error('[HEALTH] Disk check error:', error);
    // Disk check may fail on some platforms, don't mark as unhealthy
  }

  // Set appropriate status code
  const statusCode = health.status === 'healthy' ? 200 : health.status === 'degraded' ? 200 : 503;

  return NextResponse.json(health, { status: statusCode });
}
