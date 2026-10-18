import React from 'react';
import { Link } from 'react-router-dom';
import { useSafety } from '../../../context/SafetyContext';
import PageHeader from '../../../shared/components/PageHeader';
import StatCard from '../../../shared/components/StatCard';
import LiveCameraCard from '../components/LiveCameraCard';
import ActiveAlertCard from '../components/ActiveAlertCard';
import RiskSummary from '../components/RiskSummary';

export default function Dashboard() {
  const { cameras, alerts, incidents, activeMobileStream, triggerManualAlert } = useSafety();

  const activeCamerasCount = cameras.filter(c => c.status === 'online').length;
  const totalCamerasCount = cameras.length;
  const activeAlerts = alerts.filter(a => a.status !== 'DISMISSED' && a.status !== 'RESOLVED');
  const criticalCount = alerts.filter(a => a.priority === 'CRITICAL' && a.status !== 'RESOLVED').length;
  const highCount = alerts.filter(a => a.priority === 'HIGH' && a.status !== 'RESOLVED').length;

  const currentRisk = criticalCount > 0 ? 'CRITICAL' : highCount > 0 ? 'HIGH' : 'LOW';

  return (
    <div className="space-y-6">
      <PageHeader
        title="Safety Operations Center"
        subtitle="Real-time AI camera telemetry, safety rule violations, and incident response center."
      >
        <button
          onClick={() => triggerManualAlert()}
          className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <span>⚡</span>
          <span>Trigger Test Hazard</span>
        </button>
      </PageHeader>

      {/* Top Stats Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Cameras"
          value={`${activeCamerasCount}/${totalCamerasCount}`}
          subtitle="Online optical streams"
          icon="📹"
          change={activeCamerasCount > 0 ? 'Optimal' : 'Offline'}
          isPositive={activeCamerasCount > 0}
        />
        <StatCard
          title="Active Alerts"
          value={String(activeAlerts.length).padStart(2, '0')}
          subtitle="Unresolved CV warnings"
          icon="🚨"
          change={activeAlerts.length > 0 ? `${activeAlerts.length} Attention` : 'All Clear'}
          isPositive={activeAlerts.length === 0}
        />
        <StatCard
          title="Today's Incidents"
          value={String(incidents.length).padStart(2, '0')}
          subtitle="Escalated investigation files"
          icon="⚠️"
          change={incidents.filter(i => i.status === 'RESOLVED').length + ' Resolved'}
          isPositive={true}
        />
        <StatCard
          title="Current Site Risk"
          value={currentRisk}
          subtitle="Dynamic composite index"
          icon="🛡️"
          change={currentRisk === 'LOW' ? 'Normal' : 'High Alert'}
          isPositive={currentRisk === 'LOW'}
        />
      </div>

      {/* Main Grid: Live Feeds + Risk Summary */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Live CCTV AI Streams
            </h2>
            <Link
              to="/cameras"
              className="text-xs text-blue-600 hover:text-blue-500 font-semibold transition-colors"
            >
              View All Feeds →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cameras.slice(0, 4).map((camera) => (
              <LiveCameraCard
                key={camera.id}
                camera={camera}
                stream={camera.id === 'CAM-MOBILE-001' ? activeMobileStream : null}
              />
            ))}
          </div>
        </div>

        <RiskSummary />
      </div>

      {/* Recent Active Alerts */}
      <div className="space-y-4 pt-2">
        <div className="flex justify-between items-center">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Recent Active Safety Alerts
          </h2>
          <Link
            to="/alerts"
            className="text-xs text-blue-600 hover:text-blue-500 font-semibold transition-colors"
          >
            Open Alert Console →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {alerts.slice(0, 3).map((alert) => (
            <ActiveAlertCard key={alert.id} alert={alert} />
          ))}
        </div>
      </div>
    </div>
  );
}
