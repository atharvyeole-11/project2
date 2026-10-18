import React, { useState } from 'react';
import { useSafety } from '../../../context/SafetyContext';
import { SettingsConfig } from '../../../types';
import PageHeader from '../../../shared/components/PageHeader';

export default function Settings() {
  const { settings, updateSettings, aiEngineName } = useSafety();
  const [localSettings, setLocalSettings] = useState<SettingsConfig>(settings);
  const [saved, setSaved] = useState<boolean>(false);
  const [dispatchChannels, setDispatchChannels] = useState({
    slack: true,
    sms: false,
    audioSiren: true,
    webhook: true,
  });

  const toggle = (key: keyof SettingsConfig) => {
    setLocalSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = () => {
    updateSettings(localSettings);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const ruleItems: { key: keyof SettingsConfig; label: string; desc: string; icon: string }[] = [
    {
      key: 'ppeDetection',
      label: 'PPE Compliance Neural Engine',
      desc: 'Detects hard hats, reflective vests, protective eyewear, and safety boots in real time.',
      icon: '🦺',
    },
    {
      key: 'intrusionDetection',
      label: 'Restricted Perimeter Intrusion',
      desc: 'Flags unauthorized human or vehicle traversal across virtual geofences.',
      icon: '🚧',
    },
    {
      key: 'proximityWarning',
      label: 'Heavy Machinery Proximity Vector',
      desc: 'Calculates dynamic distance vectors between mobile equipment and ground personnel.',
      icon: '🚜',
    },
    {
      key: 'fireDetection',
      label: 'Thermal & Flame Signature Recognition',
      desc: 'Visual smoke tracking and thermal differential hot-spot alerts.',
      icon: '🔥',
    },
    {
      key: 'crowdEvaluation',
      label: 'High-Density Crowd & Gathering Detection',
      desc: 'Monitors bottleneck corridors and emergency egress points for over-capacity.',
      icon: '👥',
    },
    {
      key: 'autoEscalate',
      label: 'Automated Incident Docket Escalation',
      desc: 'Promotes unacknowledged Critical alerts to formal incident investigations after 5 minutes.',
      icon: '⚠️',
    },
    {
      key: 'smsNotifications',
      label: 'High-Priority Supervisor SMS Dispatch',
      desc: 'Sends SMS alerts directly to the designated on-duty safety superintendent.',
      icon: '📱',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeader
          title="System Rules & Neural Engine Configuration"
          subtitle="Configure YOLO11 computer vision inference parameters, confidence thresholds, and dispatch policies."
        />

        <button
          onClick={handleSave}
          className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-mono font-black text-xs rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] cursor-pointer self-start sm:self-auto border border-cyan-300/40 uppercase tracking-wider"
        >
          {saved ? '✓ Parameters Committed' : 'Save Configuration'}
        </button>
      </div>

      {/* Save Success Banner */}
      {saved && (
        <div className="p-3.5 bg-emerald-950/40 border border-emerald-500/40 text-emerald-400 text-xs font-mono font-bold rounded-xl animate-fade-in flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Inference parameters and neural safety rules synchronized across all optical nodes.</span>
        </div>
      )}

      {/* Main Settings Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: AI Rule Toggles */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl bg-slate-900/70 backdrop-blur-xl border border-white/[0.08] p-6 shadow-xl relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  Active Computer Vision Detection Rules
                </h3>
              </div>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                {aiEngineName}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ruleItems.map((item) => {
                const isActive = Boolean(localSettings[item.key]);
                return (
                  <div
                    key={item.key}
                    onClick={() => toggle(item.key)}
                    className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer flex items-start justify-between gap-3 group select-none ${
                      isActive
                        ? 'bg-slate-950/80 border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.12)]'
                        : 'bg-slate-950/40 border-white/[0.05] hover:border-white/10'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{item.icon}</span>
                        <h4 className="text-xs font-mono font-bold text-white group-hover:text-cyan-300 transition-colors">
                          {item.label}
                        </h4>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>

                    {/* Cyber Switch Toggle */}
                    <div
                      className={`w-11 h-6 rounded-full transition-all relative shrink-0 p-0.5 border ${
                        isActive
                          ? 'bg-cyan-500 border-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.5)]'
                          : 'bg-slate-800 border-slate-700'
                      }`}
                    >
                      <div
                        className={`w-4.5 h-4.5 rounded-full transition-transform ${
                          isActive
                            ? 'translate-x-5 bg-slate-950 shadow-md'
                            : 'translate-x-0.5 bg-slate-400'
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Model Confidence & Precision Slider Card */}
          <div className="rounded-2xl bg-slate-900/70 backdrop-blur-xl border border-white/[0.08] p-6 shadow-xl relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                <span>Detection Confidence Threshold</span>
              </h3>
              <span className="font-mono text-cyan-400 font-black text-base bg-cyan-950/80 px-3 py-0.5 rounded-lg border border-cyan-500/40 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                {localSettings.confidenceThreshold}%
              </span>
            </div>

            <p className="text-xs text-slate-400 mb-4 font-mono">
              Controls minimum score required for the YOLO pipeline to log bounding box telemetry.
            </p>

            <input
              type="range"
              min="50"
              max="99"
              value={localSettings.confidenceThreshold}
              onChange={(e) =>
                setLocalSettings({
                  ...localSettings,
                  confidenceThreshold: Number(e.target.value),
                })
              }
              className="w-full h-2.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-400 border border-white/10"
            />

            <div className="flex justify-between text-[11px] text-slate-400 font-mono mt-2.5">
              <span>50% (High Recall / Broad Alerting)</span>
              <span className="text-cyan-400 font-semibold">75% (Recommended Default)</span>
              <span>99% (Maximum Precision / Zero False)</span>
            </div>
          </div>
        </div>

        {/* Right Col: Dispatch Channels & Emergency Policies */}
        <div className="space-y-6">
          <div className="rounded-2xl bg-slate-900/70 backdrop-blur-xl border border-white/[0.08] p-6 shadow-xl relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider mb-4 pb-2 border-b border-white/[0.06] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>Alarm Dispatch Channels</span>
            </h3>

            <div className="space-y-3 font-mono text-xs">
              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-white/[0.05] cursor-pointer hover:border-cyan-500/30 transition-colors">
                <span className="text-slate-300">Slack / Discord Webhook</span>
                <input
                  type="checkbox"
                  checked={dispatchChannels.slack}
                  onChange={(e) =>
                    setDispatchChannels({ ...dispatchChannels, slack: e.target.checked })
                  }
                  className="rounded text-cyan-500 focus:ring-cyan-500 bg-slate-900 border-white/20 w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-white/[0.05] cursor-pointer hover:border-cyan-500/30 transition-colors">
                <span className="text-slate-300">SMS / Pager Emergency Uplink</span>
                <input
                  type="checkbox"
                  checked={dispatchChannels.sms}
                  onChange={(e) =>
                    setDispatchChannels({ ...dispatchChannels, sms: e.target.checked })
                  }
                  className="rounded text-cyan-500 focus:ring-cyan-500 bg-slate-900 border-white/20 w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-white/[0.05] cursor-pointer hover:border-cyan-500/30 transition-colors">
                <span className="text-slate-300">Browser Audio Siren Beacon</span>
                <input
                  type="checkbox"
                  checked={dispatchChannels.audioSiren}
                  onChange={(e) =>
                    setDispatchChannels({ ...dispatchChannels, audioSiren: e.target.checked })
                  }
                  className="rounded text-cyan-500 focus:ring-cyan-500 bg-slate-900 border-white/20 w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-white/[0.05] cursor-pointer hover:border-cyan-500/30 transition-colors">
                <span className="text-slate-300">Hazard Engine REST API</span>
                <input
                  type="checkbox"
                  checked={dispatchChannels.webhook}
                  onChange={(e) =>
                    setDispatchChannels({ ...dispatchChannels, webhook: e.target.checked })
                  }
                  className="rounded text-cyan-500 focus:ring-cyan-500 bg-slate-900 border-white/20 w-4 h-4"
                />
              </label>
            </div>

            <div className="pt-4 border-t border-white/[0.06] mt-4 text-[10px] font-mono text-slate-500 leading-relaxed">
              Dispatches use HTTPS Bearer authentication and end-to-end cryptographic hashing.
            </div>
          </div>

          {/* Neural Engine System Specs */}
          <div className="rounded-2xl bg-slate-900/70 backdrop-blur-xl border border-white/[0.08] p-6 shadow-xl relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider mb-4 pb-2 border-b border-white/[0.06] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>Edge AI Diagnostics</span>
            </h3>

            <div className="space-y-2.5 font-mono text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Inference Runtime:</span>
                <span className="text-cyan-400 font-bold">ONNX + TensorRT</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Hardware Acceleration:</span>
                <span className="text-emerald-400 font-bold">CUDA 12.2 Active</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Frame Slicing:</span>
                <span className="text-slate-200">SAHI 640x640</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Model Checkpoint:</span>
                <span className="text-cyan-300 font-mono">yolo11x-safety-v3.pt</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
