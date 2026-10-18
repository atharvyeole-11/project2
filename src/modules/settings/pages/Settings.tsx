import React, { useState } from 'react';
import { useSafety } from '../../../context/SafetyContext';
import { SettingsConfig } from '../../../types';
import PageHeader from '../../../shared/components/PageHeader';

export default function Settings() {
  const { settings, updateSettings } = useSafety();
  const [localSettings, setLocalSettings] = useState<SettingsConfig>(settings);
  const [saved, setSaved] = useState<boolean>(false);

  const toggle = (key: keyof SettingsConfig) => {
    setLocalSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = () => {
    updateSettings(localSettings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const ruleItems: { key: keyof SettingsConfig; label: string; desc: string }[] = [
    { key: 'ppeDetection', label: 'PPE Detection Engine', desc: 'Helmet, Vest, Gloves, Safety Boots' },
    { key: 'intrusionDetection', label: 'Intrusion Detection', desc: 'Restricted Zone Boundary Breach' },
    { key: 'fireDetection', label: 'Fire & Smoke Detection', desc: 'Thermal and Visual Flame Recognition' },
    { key: 'crowdEvaluation', label: 'Crowd & Occupancy Evaluation', desc: 'Overcrowding & Gathering Risk' },
    { key: 'proximityWarning', label: 'Proximity Hazard Warning', desc: 'Worker-to-Forklift Distance Monitoring' },
    { key: 'autoEscalate', label: 'Auto-Escalate Unacknowledged Alerts', desc: 'Convert to Incident after 5 min' },
    { key: 'smsNotifications', label: 'SMS & Pager Emergency Broadcast', desc: 'Dispatch SMS to safety supervisors' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeader
          title="Safety Operations Center — System & Rule Settings"
          subtitle="Configure computer vision safety rule toggles, confidence scores, and alert dispatch channels."
        />

        <button
          onClick={handleSave}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-blue-600/20 cursor-pointer self-start sm:self-auto"
        >
          {saved ? '✓ Settings Saved' : 'Save Changes'}
        </button>
      </div>

      {saved && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-xl animate-fade-in flex items-center gap-2">
          <span>✓</span>
          <span>Computer vision safety rules and thresholds successfully saved.</span>
        </div>
      )}

      {/* Screen 12 Toggle Controls Grid */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-6 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 uppercase tracking-wider">
          AI Detection Rule Toggles
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ruleItems.map((item) => (
            <div
              key={item.key}
              className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/70 flex items-center justify-between gap-4"
            >
              <div>
                <h4 className="text-xs font-bold text-slate-900">{item.label}</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">{item.desc}</p>
              </div>

              <button
                type="button"
                onClick={() => toggle(item.key)}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                  localSettings[item.key] ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-sm absolute top-0.5 transition-transform ${
                    localSettings[item.key] ? 'translate-x-6.5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>

        {/* Confidence Slider */}
        <div className="pt-4 border-t border-slate-100 max-w-xl space-y-3">
          <div className="flex justify-between text-xs">
            <span className="text-slate-800 font-bold">
              Minimum AI Detection Confidence Threshold
            </span>
            <span className="font-mono text-blue-600 font-bold text-sm">
              {localSettings.confidenceThreshold}%
            </span>
          </div>
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
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>50% (High Recall)</span>
            <span>75% (Balanced)</span>
            <span>99% (High Precision)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
