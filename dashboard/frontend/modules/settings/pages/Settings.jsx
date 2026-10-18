import { useState, useEffect } from "react";
import PageHeader from "../../../shared/components/PageHeader";
import { api } from "../../../services/api";

export default function Settings() {
  const [settings, setSettings] = useState({
    ppeDetection: true,
    intrusionDetection: true,
    fireDetection: true,
    crowdEvaluation: true,
    proximityWarning: false,
    confidenceThreshold: 85,
    autoEscalate: true,
    smsNotifications: true
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function load() {
      const res = await api.getSettings();
      if (res) setSettings(res);
    }
    load();
  }, []);

  const toggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    await api.updateSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <PageHeader
          title="Safety Operations Center — System & Rule Settings"
          subtitle="Configure computer vision safety rule toggles, confidence scores, and alert dispatch channels."
        />

        <button
          onClick={handleSave}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-colors shadow-lg shadow-blue-600/20"
        >
          {saved ? "✓ Settings Saved" : "Save Changes"}
        </button>
      </div>

      {/* Screen 12 Toggle Controls Grid */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6 shadow-lg shadow-black/20">
        <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-200 uppercase tracking-wider">
          AI Detection Rule Toggles (Screen 12 Controls)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { key: "ppeDetection", label: "PPE Detection Engine", desc: "Helmet, Vest, Gloves, Safety Boots" },
            { key: "intrusionDetection", label: "Intrusion Detection", desc: "Restricted Zone Boundary Breach" },
            { key: "fireDetection", label: "Fire & Smoke Detection", desc: "Thermal and Visual Flame Recognition" },
            { key: "crowdEvaluation", label: "Crowd & Occupancy Evaluation", desc: "Overcrowding & Gathering Risk" },
            { key: "proximityWarning", label: "Proximity Hazard Warning", desc: "Worker-to-Forklift Distance Monitoring" },
            { key: "autoEscalate", label: "Auto-Escalate Unacknowledged Alerts", desc: "Convert to Incident after 5 min" }
          ].map((item) => (
            <div
              key={item.key}
              className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between"
            >
              <div>
                <h4 className="text-xs font-bold text-slate-800">{item.label}</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">{item.desc}</p>
              </div>

              <button
                onClick={() => toggle(item.key)}
                className={`w-12 h-6 rounded-full transition-colors relative ${
                  settings[item.key] ? "bg-blue-600" : "bg-slate-700"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-slate-50 absolute top-0.5 transition-transform ${
                    settings[item.key] ? "translate-x-6" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>

        {/* Confidence Slider */}
        <div className="pt-4 border-t border-slate-200 max-w-xl space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-slate-700 font-bold">Minimum AI Detection Confidence Threshold</span>
            <span className="font-mono text-blue-600 font-bold">{settings.confidenceThreshold}%</span>
          </div>
          <input
            type="range"
            min="50"
            max="99"
            value={settings.confidenceThreshold}
            onChange={(e) => setSettings({ ...settings, confidenceThreshold: Number(e.target.value) })}
            className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>
      </div>
    </div>
  );
}
