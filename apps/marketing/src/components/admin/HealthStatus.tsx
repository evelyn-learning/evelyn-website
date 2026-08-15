'use client';

import { useState, useEffect } from 'react';
import { Activity, Database, HardDrive, Server, Cpu, RefreshCw, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

interface HealthData {
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

export function HealthStatus() {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHealth = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/health');
      if (!res.ok) throw new Error('Health check failed');
      const data = await res.json();
      setHealth(data);
      setError(null);
    } catch (err) {
      setError('Unable to fetch health status');
      console.error(err);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchHealth();
    // Refresh every 30 seconds
    const interval = setInterval(fetchHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
  };

  const formatSize = (mb: number) => {
    if (mb >= 1024) {
      return `${(mb / 1024).toFixed(1)}GB`;
    }
    return `${mb}MB`;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'connected':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'degraded':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default:
        return <XCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'connected':
        return 'text-green-600 bg-green-50';
      case 'degraded':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-red-600 bg-red-50';
    }
  };

  if (error) {
    return (
      <div className="rounded-xl bg-white p-6 shadow">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Activity className="w-5 h-5" />
            System Health
          </h2>
          <button
            onClick={fetchHealth}
            className="p-1 text-gray-400 hover:text-gray-600 rounded"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
        <div className="text-sm text-red-500 flex items-center gap-2">
          <XCircle className="w-4 h-4" />
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-white p-6 shadow">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Activity className="w-5 h-5" />
          System Health
        </h2>
        <button
          onClick={fetchHealth}
          className="p-1 text-gray-400 hover:text-gray-600 rounded"
          title="Refresh"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {isLoading && !health ? (
        <div className="space-y-3">
          <div className="h-8 bg-gray-100 rounded animate-pulse" />
          <div className="h-8 bg-gray-100 rounded animate-pulse" />
          <div className="h-8 bg-gray-100 rounded animate-pulse" />
        </div>
      ) : health ? (
        <div className="space-y-4">
          {/* Overall Status */}
          <div className={`flex items-center justify-between px-3 py-2 rounded-lg ${getStatusColor(health.status)}`}>
            <span className="text-sm font-medium">Status</span>
            <span className="flex items-center gap-2 text-sm font-semibold capitalize">
              {getStatusIcon(health.status)}
              {health.status}
            </span>
          </div>

          {/* Database */}
          <div className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-600 flex items-center gap-2">
              <Database className="w-4 h-4" />
              Database
            </span>
            <span className="flex items-center gap-2 text-sm">
              {getStatusIcon(health.database.status)}
              <span className="capitalize">{health.database.status}</span>
              {health.database.latency !== undefined && (
                <span className="text-xs text-gray-500">({health.database.latency}ms)</span>
              )}
            </span>
          </div>

          {/* Memory */}
          <div className="px-3 py-2 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-600 flex items-center gap-2">
                <Cpu className="w-4 h-4" />
                Memory
              </span>
              <span className="text-sm text-gray-700">
                {formatSize(health.memory.used)} / {formatSize(health.memory.total)}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  health.memory.percentage > 90
                    ? 'bg-red-500'
                    : health.memory.percentage > 70
                    ? 'bg-yellow-500'
                    : 'bg-green-500'
                }`}
                style={{ width: `${health.memory.percentage}%` }}
              />
            </div>
          </div>

          {/* Disk Space */}
          {health.disk && health.disk.total > 0 && (
            <div className="px-3 py-2 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600 flex items-center gap-2">
                  <HardDrive className="w-4 h-4" />
                  Disk Space
                </span>
                <span className="text-sm text-gray-700">
                  {formatSize(health.disk.used)} / {formatSize(health.disk.total)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    health.disk.percentage > 90
                      ? 'bg-red-500'
                      : health.disk.percentage > 80
                      ? 'bg-yellow-500'
                      : 'bg-green-500'
                  }`}
                  style={{ width: `${health.disk.percentage}%` }}
                />
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {formatSize(health.disk.available)} available
              </div>
            </div>
          )}

          {/* Server Info */}
          {health.server && (
            <div className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600 flex items-center gap-2">
                <Server className="w-4 h-4" />
                Server
              </span>
              <span className="text-sm text-gray-700">
                {health.server.hostname}
                <span className="text-xs text-gray-500 ml-2">
                  ({health.server.platform}, {health.server.cpuCores} cores)
                </span>
              </span>
            </div>
          )}

          {/* Uptime & Environment */}
          <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
            <span>Uptime: {formatUptime(health.uptime)}</span>
            <span className="px-2 py-0.5 bg-gray-100 rounded capitalize">{health.environment}</span>
          </div>
        </div>
      ) : null}
    </div>
  );
}
