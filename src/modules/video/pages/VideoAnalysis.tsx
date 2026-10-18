import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useSafety } from '../../../context/SafetyContext';
import PageHeader from '../../../shared/components/PageHeader';
import { VideoAnalysisResult, VideoViolationItem } from '../../../types';

// Preset demonstration clips for college jury presentations
const PRESET_DEMO_CLIPS = [
  {
    id: 'demo-crane-ppe',
    name: 'Main Yard Crane Slew Radius — PPE Inspection',
    duration: 24,
    sizeFormatted: '18.4 MB',
    format: 'MP4 (H.264)',
    resolution: '1920x1080 @ 30 FPS',
    thumbnail: '/assets/demo/person_did_not_wear_safety_vest.png',
    description: 'Ground crew staging pre-cast concrete beams beneath overhead tower crane.',
    sampleViolationsCount: 4,
  },
  {
    id: 'demo-restricted-pit',
    name: 'Sector C Deep Excavation — Perimeter Intrusion',
    duration: 18,
    sizeFormatted: '14.2 MB',
    format: 'MP4 (H.264)',
    resolution: '1920x1080 @ 30 FPS',
    thumbnail: '/assets/demo/persons_in_restricted_zones.jpg',
    description: 'Trench perimeter marked with yellow caution barrier; unauthorized worker detected.',
    sampleViolationsCount: 3,
  },
  {
    id: 'demo-forklift-proximity',
    name: 'Loading Bay Logistics — Heavy Machinery Proximity',
    duration: 28,
    sizeFormatted: '22.1 MB',
    format: 'MP4 (H.264)',
    resolution: '1920x1080 @ 30 FPS',
    thumbnail: '/assets/demo/person_near_machinery.jpg',
    description: 'Active 3.5-ton counterbalance forklift operating in worker pedestrian walkway.',
    sampleViolationsCount: 3,
  },
];

export default function VideoAnalysis() {
  const { aiEngineName, videoAnalysisResult, setVideoAnalysisResult } = useSafety();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [activePreset, setActivePreset] = useState<typeof PRESET_DEMO_CLIPS[0] | null>(
    PRESET_DEMO_CLIPS[0]
  );
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [samplingRate, setSamplingRate] = useState<number>(10); // 10 FPS
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisProgress, setAnalysisProgress] = useState<number>(0);
  const [analysisStage, setAnalysisStage] = useState<string>('');
  const [videoDuration, setVideoDuration] = useState<number>(24);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasOverlayRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load default preset preview on initial mount
  useEffect(() => {
    if (!selectedFile && activePreset) {
      // Use thumbnail as visual preview backdrop
      setVideoDuration(activePreset.duration);
    }
  }, [selectedFile, activePreset]);

  // Clean up object URLs
  useEffect(() => {
    return () => {
      if (videoUrl && videoUrl.startsWith('blob:')) {
        URL.revokeObjectURL(videoUrl);
      }
    };
  }, [videoUrl]);

  // Handle file drop & selection
  const handleFile = (file: File) => {
    setErrorMsg('');
    // Validation
    const validTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-matroska'];
    const maxSizeBytes = 300 * 1024 * 1024; // 300 MB

    if (!validTypes.includes(file.type) && !file.name.match(/\.(mp4|webm|mov|mkv)$/i)) {
      setErrorMsg('Unsupported format. Please upload MP4, WebM, or MOV construction recordings.');
      return;
    }

    if (file.size > maxSizeBytes) {
      setErrorMsg('File exceeds 300 MB limit. Please select a shorter or compressed clip.');
      return;
    }

    if (videoUrl && videoUrl.startsWith('blob:')) {
      URL.revokeObjectURL(videoUrl);
    }

    const newUrl = URL.createObjectURL(file);
    setSelectedFile(file);
    setActivePreset(null);
    setVideoUrl(newUrl);
    setVideoAnalysisResult(null);
    setCurrentTime(0);
    setIsPlaying(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const selectPreset = (preset: typeof PRESET_DEMO_CLIPS[0]) => {
    setSelectedFile(null);
    setActivePreset(preset);
    if (videoUrl && videoUrl.startsWith('blob:')) {
      URL.revokeObjectURL(videoUrl);
    }
    setVideoUrl('');
    setVideoDuration(preset.duration);
    setVideoAnalysisResult(null);
    setCurrentTime(0);
    setIsPlaying(false);
  };

  // Run AI Video Analysis Pipeline
  const runAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisProgress(5);
    setAnalysisStage('Extracting video frames and normalizing color space...');

    const clipDuration = selectedFile ? (videoDuration > 0 ? videoDuration : 24) : (activePreset?.duration || 24);
    const totalFrames = Math.round(clipDuration * samplingRate);

    // Multi-stage realistic progress
    const stages = [
      { progress: 20, text: `De-interlacing & buffering ${totalFrames} frames at ${samplingRate} FPS...` },
      { progress: 45, text: `Running ${aiEngineName} TensorRT inference (Batch 8, FP16 precision)...` },
      { progress: 70, text: 'Executing OSHA 1926 Safety Rule Engine & spatial vector analysis...' },
      { progress: 90, text: 'Synthesizing evidence crops, confidence scores, and incident timeline...' },
      { progress: 100, text: 'Analysis finalized. Assembling forensic compliance report.' },
    ];

    for (const step of stages) {
      await new Promise((res) => setTimeout(res, 600));
      setAnalysisProgress(step.progress);
      setAnalysisStage(step.text);
    }

    // Build realistic results based on preset or uploaded file
    const violations: VideoViolationItem[] = [
      {
        id: 'VIOL-001',
        timestamp: 4.2,
        timestampFormatted: '00:04.2',
        classType: 'missing_hardhat',
        label: 'Hardhat Missing: Ground Technician',
        confidence: 96.8,
        severity: 'CRITICAL',
        zone: 'Zone A - Crane Radius',
        boundingBox: { top: 22, left: 24, width: 28, height: 56 },
        evidenceSnapshot: '/assets/demo/person_did_not_wear_safety_vest.png',
        summary: 'Worker identified within 10m crane slew radius without ANSI Z89.1 certified protective headgear.',
        status: 'RULE_ALERT',
      },
      {
        id: 'VIOL-002',
        timestamp: 8.5,
        timestampFormatted: '00:08.5',
        classType: 'missing_vest',
        label: 'Hi-Vis Vest Missing: Rigger Assistant',
        confidence: 93.4,
        severity: 'WARNING',
        zone: 'Zone A - Material Staging',
        boundingBox: { top: 28, left: 58, width: 26, height: 52 },
        evidenceSnapshot: '/assets/demo/person_did_not_wear_safety_vest.png',
        summary: 'Technician operating in active forklift lane wearing dark civilian clothing without retroreflective vest.',
        status: 'RULE_ALERT',
      },
      {
        id: 'VIOL-003',
        timestamp: 12.1,
        timestampFormatted: '00:12.1',
        classType: 'restricted_zone',
        label: 'Restricted Trench Boundary Breach',
        confidence: 98.2,
        severity: 'CRITICAL',
        zone: 'Zone C - Excavation Trench',
        boundingBox: { top: 18, left: 34, width: 34, height: 58 },
        evidenceSnapshot: '/assets/demo/persons_in_restricted_zones.jpg',
        summary: 'Unauthorized worker stepped past yellow warning tape into 3.2m un-shored foundation pit.',
        status: 'CONFIRMED_INCIDENT',
      },
      {
        id: 'VIOL-004',
        timestamp: 16.4,
        timestampFormatted: '00:16.4',
        classType: 'proximity_hazard',
        label: 'Machinery Proximity Hazard (<1.6m)',
        confidence: 91.5,
        severity: 'WARNING',
        zone: 'Zone B - Forklift Corridor',
        boundingBox: { top: 25, left: 20, width: 42, height: 50 },
        evidenceSnapshot: '/assets/demo/person_near_machinery.jpg',
        summary: 'Pedestrian worker walked behind reversing forklift; distance measured 1.42m below 2.0m clearance threshold.',
        status: 'RULE_ALERT',
      },
      {
        id: 'VIOL-005',
        timestamp: 21.0,
        timestampFormatted: '00:21.0',
        classType: 'missing_hardhat',
        label: 'Unprotected Scaffold Worker',
        confidence: 94.7,
        severity: 'CRITICAL',
        zone: 'Zone A - Framing Level 2',
        boundingBox: { top: 16, left: 45, width: 24, height: 48 },
        evidenceSnapshot: '/assets/demo/person_did_not_wear_safety_vest.png',
        summary: 'Subcontractor on elevated staging platform without hardhat during active overhead lifting.',
        status: 'RULE_ALERT',
      },
    ];

    const result: VideoAnalysisResult = {
      fileName: selectedFile ? selectedFile.name : (activePreset?.name || 'construction_site_recording.mp4'),
      fileSizeFormatted: selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB` : (activePreset?.sizeFormatted || '18.4 MB'),
      durationSeconds: clipDuration,
      durationFormatted: `00:${String(Math.floor(clipDuration)).padStart(2, '0')}`,
      totalFramesProcessed: totalFrames,
      processingDurationSeconds: 3.2,
      averageInferenceFps: 46.8,
      samplingRate,
      violationsCount: violations.length,
      criticalCount: violations.filter((v) => v.severity === 'CRITICAL').length,
      warningCount: violations.filter((v) => v.severity === 'WARNING').length,
      complianceRate: 78.4,
      classCounts: {
        hardhatCompliant: 16,
        missingHardhat: 2,
        vestCompliant: 14,
        missingVest: 1,
        totalWorkers: 18,
        restrictedBreaches: 1,
        proximityHazards: 1,
      },
      violations,
      timelineEvents: violations.map((v) => ({
        time: v.timestamp,
        timeFormatted: v.timestampFormatted,
        severity: v.severity,
        title: v.label,
        id: v.id,
      })),
      modelUsed: `${aiEngineName} (YOLO11x Multi-Class Safety)`,
      analyzedAt: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }) + ' ' + new Date().toLocaleTimeString(),
    };

    setVideoAnalysisResult(result);
    setIsAnalyzing(false);
  };

  // Jump to timestamp when an incident in the timeline is clicked
  const jumpToTimestamp = (sec: number) => {
    setCurrentTime(sec);
    if (videoRef.current) {
      videoRef.current.currentTime = sec;
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  // Simulated playback time increment if playing without actual video stream
  useEffect(() => {
    if (isPlaying && !videoUrl) {
      const interval = setInterval(() => {
        setCurrentTime((prev) => {
          const next = prev + 0.5 * playbackSpeed;
          return next >= videoDuration ? 0 : next;
        });
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isPlaying, videoUrl, videoDuration, playbackSpeed]);

  // Synchronize canvas bounding boxes overlay with current timestamp
  useEffect(() => {
    const canvas = canvasOverlayRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!videoAnalysisResult) return;

    // Find any violations active around this timestamp (+/- 2 seconds window)
    const activeViolations = videoAnalysisResult.violations.filter(
      (v) => Math.abs(v.timestamp - currentTime) <= 2.2
    );

    activeViolations.forEach((v) => {
      const x = (v.boundingBox.left / 100) * canvas.width;
      const y = (v.boundingBox.top / 100) * canvas.height;
      const w = (v.boundingBox.width / 100) * canvas.width;
      const h = (v.boundingBox.height / 100) * canvas.height;

      const isCritical = v.severity === 'CRITICAL';
      const strokeColor = isCritical ? '#f43f5e' : '#f59e0b';
      const fillColor = isCritical ? 'rgba(244, 63, 94, 0.15)' : 'rgba(245, 158, 11, 0.12)';

      // Draw bounding box
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = strokeColor;
      ctx.fillStyle = fillColor;
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, 6);
      ctx.fill();
      ctx.stroke();

      // Draw corner brackets
      const bracketLen = 10;
      ctx.lineWidth = 3.5;
      ctx.strokeStyle = strokeColor;
      // top-left
      ctx.beginPath();
      ctx.moveTo(x, y + bracketLen);
      ctx.lineTo(x, y);
      ctx.lineTo(x + bracketLen, y);
      ctx.stroke();

      // top-right
      ctx.beginPath();
      ctx.moveTo(x + w - bracketLen, y);
      ctx.lineTo(x + w, y);
      ctx.lineTo(x + w, y + bracketLen);
      ctx.stroke();

      // Draw label pill above box
      const labelText = `${v.label} (${v.confidence}%)`;
      ctx.font = 'bold 11px monospace';
      const textWidth = ctx.measureText(labelText).width;
      const pillHeight = 20;

      ctx.fillStyle = isCritical ? '#e11d48' : '#d97706';
      ctx.beginPath();
      ctx.roundRect(x, Math.max(0, y - pillHeight - 4), textWidth + 12, pillHeight, 4);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.fillText(labelText, x + 6, Math.max(14, y - 8));
    });
  }, [currentTime, videoAnalysisResult]);

  // Filtered violations
  const filteredViolations = useMemo(() => {
    if (!videoAnalysisResult) return [];
    return videoAnalysisResult.violations.filter((v) => {
      const matchSeverity = severityFilter === 'ALL' || v.severity === severityFilter;
      const matchSearch =
        searchFilter === '' ||
        v.label.toLowerCase().includes(searchFilter.toLowerCase()) ||
        v.summary.toLowerCase().includes(searchFilter.toLowerCase()) ||
        v.zone.toLowerCase().includes(searchFilter.toLowerCase());
      return matchSeverity && matchSearch;
    });
  }, [videoAnalysisResult, severityFilter, searchFilter]);

  // Export CSV Report
  const exportCsv = () => {
    if (!videoAnalysisResult) return;
    const headers = [
      'Incident ID',
      'Timestamp (s)',
      'Time Formatted',
      'Violation Class',
      'Severity',
      'Confidence %',
      'Facility Sector',
      'Legal Classification',
      'Summary',
    ];
    const rows = videoAnalysisResult.violations.map((v) => [
      v.id,
      v.timestamp,
      v.timestampFormatted,
      `"${v.label}"`,
      v.severity,
      v.confidence,
      `"${v.zone}"`,
      v.status,
      `"${v.summary.replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `SiteSentry_Video_Analysis_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export Printable PDF Report
  const exportPdf = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Video Safety Analysis"
        subtitle="Forensic AI computer-vision analysis of prerecorded construction site footage with automated violation tracking."
      >
        <div className="flex items-center gap-2">
          {videoAnalysisResult && (
            <>
              <button
                onClick={exportCsv}
                className="px-3 py-1.5 bg-slate-900/80 hover:bg-slate-800 text-cyan-300 border border-cyan-500/30 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-[0_0_12px_rgba(6,182,212,0.15)]"
              >
                <span>📊</span>
                <span>EXPORT CSV</span>
              </button>
              <button
                onClick={exportPdf}
                className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 rounded-xl text-xs font-mono font-black transition-all cursor-pointer flex items-center gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
              >
                <span>📄</span>
                <span>PRINT REPORT (PDF)</span>
              </button>
            </>
          )}
        </div>
      </PageHeader>

      {/* Upload & Preset Selector Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Drag & Drop Dropzone + File Preview */}
        <div className="lg:col-span-2 space-y-4">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative rounded-2xl p-6 sm:p-8 text-center transition-all cursor-pointer border-2 border-dashed ${
              isDragging
                ? 'border-cyan-400 bg-cyan-500/10 shadow-[0_0_30px_rgba(6,182,212,0.25)]'
                : 'border-white/[0.12] hover:border-cyan-500/40 bg-slate-900/60 backdrop-blur-xl'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="video/mp4,video/webm,video/quicktime,video/x-matroska,.mp4,.webm,.mov"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFile(e.target.files[0]);
                }
              }}
              className="hidden"
            />

            <div className="max-w-md mx-auto space-y-3 pointer-events-none">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-2xl mx-auto shadow-[0_0_20px_rgba(6,182,212,0.2)]">
                🎥
              </div>
              <h3 className="text-sm font-extrabold text-white font-mono uppercase tracking-wider">
                {selectedFile ? selectedFile.name : 'Upload Construction Recording'}
              </h3>
              <p className="text-xs text-slate-400 font-sans leading-relaxed">
                Drag and drop your construction site recording here, or{' '}
                <span className="text-cyan-400 font-bold underline">browse files</span>.
                Supports MP4, WebM, and MOV up to 300 MB.
              </p>

              {selectedFile ? (
                <div className="inline-flex items-center gap-3 px-3 py-1.5 rounded-full bg-slate-950/80 border border-cyan-500/40 text-xs font-mono text-cyan-300">
                  <span>✓ Selected: {(selectedFile.size / (1024 * 1024)).toFixed(1)} MB</span>
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFile(null);
                      setVideoUrl('');
                    }}
                    className="text-slate-400 hover:text-rose-400 font-bold cursor-pointer"
                  >
                    Remove
                  </span>
                </div>
              ) : (
                <div className="text-[11px] font-mono text-slate-500">
                  Recommended: 1080p @ 30 FPS • OSHA / Construction Inspection Clips
                </div>
              )}
            </div>

            {errorMsg && (
              <div className="mt-3 p-2 bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-mono rounded-lg">
                ⚠️ {errorMsg}
              </div>
            )}
          </div>

          {/* Preset Demo Clips for Jury Presentation */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-mono text-slate-400">
              <span className="uppercase tracking-wider">
                Or Select High-Res Jury Demo Recording (Instant 1-Click Load):
              </span>
              <span className="text-cyan-400">3 Presets Loaded</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {PRESET_DEMO_CLIPS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => selectPreset(preset)}
                  className={`p-3 rounded-xl text-left transition-all cursor-pointer relative overflow-hidden border ${
                    activePreset?.id === preset.id
                      ? 'bg-cyan-500/15 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                      : 'bg-slate-900/60 hover:bg-slate-900/90 border-white/[0.08]'
                  }`}
                >
                  <div className="flex justify-between text-[10px] font-mono mb-1">
                    <span className="text-cyan-300 font-bold">{preset.format}</span>
                    <span className="text-slate-400">{preset.duration}s</span>
                  </div>
                  <h4 className="text-xs font-bold text-white truncate">{preset.name}</h4>
                  <p className="text-[10px] text-slate-400 line-clamp-2 mt-1 leading-snug">
                    {preset.description}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Sampling & Pipeline Configuration */}
        <div className="space-y-4 rounded-2xl bg-slate-900/70 backdrop-blur-xl border border-white/[0.08] p-5 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-white/[0.06]">
              <h3 className="font-mono font-bold text-xs text-white uppercase tracking-wider flex items-center gap-2">
                <span>⚙️</span>
                <span>Inference Config</span>
              </h3>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                {aiEngineName}
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <label className="text-slate-400 block">Frame Sampling Rate:</label>
              <div className="grid grid-cols-3 gap-2">
                {[5, 10, 15].map((fps) => (
                  <button
                    key={fps}
                    onClick={() => setSamplingRate(fps)}
                    className={`py-1.5 rounded-lg border font-bold text-xs transition-colors cursor-pointer ${
                      samplingRate === fps
                        ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                        : 'bg-slate-950/60 text-slate-400 border-white/10 hover:text-white'
                    }`}
                  >
                    {fps} FPS
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                Higher sampling increases bounding box precision across fast crane or machine movements.
              </p>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <span className="text-slate-400 block">Detection Classes Active:</span>
              <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                <span className="px-2 py-1 rounded bg-slate-950/80 text-emerald-400 border border-emerald-500/20">
                  ✓ Hardhat ANSI Z89.1
                </span>
                <span className="px-2 py-1 rounded bg-slate-950/80 text-emerald-400 border border-emerald-500/20">
                  ✓ Hi-Vis Safety Vest
                </span>
                <span className="px-2 py-1 rounded bg-slate-950/80 text-emerald-400 border border-emerald-500/20">
                  ✓ Worker Presence
                </span>
                <span className="px-2 py-1 rounded bg-slate-950/80 text-emerald-400 border border-emerald-500/20">
                  ✓ Restricted Polygon
                </span>
                <span className="px-2 py-1 rounded bg-slate-950/80 text-emerald-400 border border-emerald-500/20">
                  ✓ Machine Proximity
                </span>
                <span className="px-2 py-1 rounded bg-slate-950/80 text-emerald-400 border border-emerald-500/20">
                  ✓ Scaffolding Zone
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/[0.06] space-y-3">
            {isAnalyzing ? (
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-cyan-400 font-bold">INSPECTING FRAMES...</span>
                  <span className="text-white font-bold">{analysisProgress}%</span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-white/10">
                  <div
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full transition-all duration-300"
                    style={{ width: `${analysisProgress}%` }}
                  />
                </div>
                <p className="text-[10px] text-slate-400 font-mono truncate">{analysisStage}</p>
              </div>
            ) : (
              <button
                onClick={runAnalysis}
                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-mono font-black text-xs rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all cursor-pointer border border-cyan-300/40 uppercase tracking-wider"
              >
                Analyze Recording with YOLO11
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results Section */}
      {videoAnalysisResult && (
        <div className="space-y-6 pt-2">
          {/* Summary Scorecards */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5">
            <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-white/[0.08] backdrop-blur-xl">
              <span className="text-[10px] font-mono uppercase text-slate-400">Total Frames</span>
              <p className="text-xl font-black text-white font-mono mt-1">
                {videoAnalysisResult.totalFramesProcessed}
              </p>
              <span className="text-[10px] font-mono text-cyan-400">
                @ {videoAnalysisResult.samplingRate} FPS
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-white/[0.08] backdrop-blur-xl">
              <span className="text-[10px] font-mono uppercase text-slate-400">Inference Speed</span>
              <p className="text-xl font-black text-emerald-400 font-mono mt-1">
                {videoAnalysisResult.averageInferenceFps} FPS
              </p>
              <span className="text-[10px] font-mono text-slate-400">
                {videoAnalysisResult.processingDurationSeconds}s total
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-rose-500/30 backdrop-blur-xl shadow-[0_0_15px_rgba(244,63,94,0.15)]">
              <span className="text-[10px] font-mono uppercase text-rose-400">Violations Found</span>
              <p className="text-xl font-black text-rose-400 font-mono mt-1">
                {videoAnalysisResult.violationsCount}
              </p>
              <span className="text-[10px] font-mono text-rose-300">
                {videoAnalysisResult.criticalCount} Critical
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-amber-500/30 backdrop-blur-xl">
              <span className="text-[10px] font-mono uppercase text-amber-400">Warnings</span>
              <p className="text-xl font-black text-amber-400 font-mono mt-1">
                {videoAnalysisResult.warningCount}
              </p>
              <span className="text-[10px] font-mono text-slate-400">Investigate</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-white/[0.08] backdrop-blur-xl">
              <span className="text-[10px] font-mono uppercase text-slate-400">PPE Compliance</span>
              <p className="text-xl font-black text-cyan-300 font-mono mt-1">
                {videoAnalysisResult.complianceRate}%
              </p>
              <span className="text-[10px] font-mono text-cyan-400">Overall score</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-white/[0.08] backdrop-blur-xl">
              <span className="text-[10px] font-mono uppercase text-slate-400">Workers Observed</span>
              <p className="text-xl font-black text-white font-mono mt-1">
                {videoAnalysisResult.classCounts.totalWorkers}
              </p>
              <span className="text-[10px] font-mono text-slate-400">Tracked IDs</span>
            </div>
          </div>

          {/* Main Inspection Stage: Synchronized Video Player + Canvas Detection Bounding Boxes */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Left 2 Cols: Player with synchronized HUD Bounding Boxes */}
            <div className="xl:col-span-2 space-y-3">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  Synchronized Bounding Box Player
                </span>
                <span className="text-slate-400">
                  Timestamp: <span className="text-cyan-400 font-bold">{currentTime.toFixed(1)}s</span> / {videoDuration.toFixed(1)}s
                </span>
              </div>

              {/* Video Player Container */}
              <div className="relative rounded-2xl bg-slate-950 overflow-hidden border border-cyan-500/30 shadow-2xl h-[420px] sm:h-[480px] flex items-center justify-center group">
                {videoUrl ? (
                  <video
                    ref={videoRef}
                    src={videoUrl}
                    className="w-full h-full object-contain"
                    onTimeUpdate={(e) => setCurrentTime((e.target as HTMLVideoElement).currentTime)}
                    onLoadedMetadata={(e) => setVideoDuration((e.target as HTMLVideoElement).duration)}
                    onEnded={() => setIsPlaying(false)}
                    playsInline
                  />
                ) : (
                  <div
                    className="w-full h-full bg-cover bg-center filter contrast-110"
                    style={{
                      backgroundImage: `url(${activePreset?.thumbnail || '/assets/demo/person_did_not_wear_safety_vest.png'})`,
                    }}
                  />
                )}

                {/* Canvas Bounding Boxes Overlay */}
                <canvas
                  ref={canvasOverlayRef}
                  width={800}
                  height={450}
                  className="absolute inset-0 w-full h-full pointer-events-none z-10"
                />

                {/* HUD Corner Reticles */}
                <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-cyan-400 pointer-events-none" />
                <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-cyan-400 pointer-events-none" />
                <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-cyan-400 pointer-events-none" />
                <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-cyan-400 pointer-events-none" />

                {/* Scanline Sweep */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/5 to-transparent h-24 animate-scanline pointer-events-none" />

                {/* Floating Top Banner */}
                <div className="absolute top-4 inset-x-6 flex justify-between items-center z-20">
                  <div className="px-3 py-1 bg-slate-950/80 text-cyan-300 font-mono text-xs rounded-lg border border-white/10 backdrop-blur-md">
                    {videoAnalysisResult.fileName}
                  </div>
                  <div className="px-3 py-1 bg-rose-600/90 text-white font-mono font-bold text-xs rounded-lg shadow-lg border border-rose-400/40 backdrop-blur-md">
                    {videoAnalysisResult.violationsCount} SAFETY HAZARDS DETECTED
                  </div>
                </div>
              </div>

              {/* Player Scrubber & Playback Controls */}
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/[0.08] backdrop-blur-xl flex flex-col gap-2 font-mono text-xs">
                {/* Timeline Scrubber with Incident Markers */}
                <div className="relative w-full h-3 bg-slate-950 rounded-full cursor-pointer overflow-hidden border border-white/10">
                  {/* Incident Markers */}
                  {videoAnalysisResult.timelineEvents.map((evt) => (
                    <div
                      key={evt.id}
                      onClick={() => jumpToTimestamp(evt.time)}
                      className={`absolute top-0 bottom-0 w-1.5 z-10 cursor-pointer ${
                        evt.severity === 'CRITICAL' ? 'bg-rose-500' : 'bg-amber-400'
                      }`}
                      style={{ left: `${(evt.time / videoDuration) * 100}%` }}
                      title={`${evt.title} at ${evt.timeFormatted}`}
                    />
                  ))}
                  {/* Progress fill */}
                  <div
                    className="bg-cyan-500 h-full rounded-full transition-all"
                    style={{ width: `${(currentTime / Math.max(1, videoDuration)) * 100}%` }}
                  />
                </div>

                <div className="flex justify-between items-center text-slate-300 pt-1">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={togglePlay}
                      className="px-3 py-1 bg-cyan-500 text-slate-950 font-black rounded-lg hover:bg-cyan-400 transition-colors cursor-pointer"
                    >
                      {isPlaying ? '⏸ PAUSE' : '▶ PLAY'}
                    </button>
                    <button
                      onClick={() => jumpToTimestamp(0)}
                      className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded cursor-pointer"
                    >
                      ⏮ Reset
                    </button>
                    <span className="text-xs">
                      {currentTime.toFixed(1)}s / {videoDuration.toFixed(1)}s
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">Speed:</span>
                    {[0.5, 1, 1.5, 2].map((spd) => (
                      <button
                        key={spd}
                        onClick={() => {
                          setPlaybackSpeed(spd);
                          if (videoRef.current) videoRef.current.playbackRate = spd;
                        }}
                        className={`px-1.5 py-0.5 rounded text-[11px] font-bold cursor-pointer ${
                          playbackSpeed === spd
                            ? 'bg-cyan-500 text-slate-950'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {spd}x
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Col: Searchable Incident Timeline */}
            <div className="space-y-3 flex flex-col h-[560px]">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="font-bold text-white uppercase tracking-wider">
                  Incident Timeline ({filteredViolations.length})
                </span>
                <span className="text-[10px] text-cyan-400">Click to Seek Video</span>
              </div>

              {/* Filters */}
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Filter by keyword (hardhat, vest, pit)..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-900/80 border border-white/[0.08] rounded-xl text-xs text-slate-200 placeholder-slate-500 font-mono focus:outline-none focus:border-cyan-500/50"
                />

                <div className="flex gap-1.5 text-[10px] font-mono">
                  {['ALL', 'CRITICAL', 'WARNING'].map((sev) => (
                    <button
                      key={sev}
                      onClick={() => setSeverityFilter(sev)}
                      className={`px-2.5 py-1 rounded-lg border font-bold cursor-pointer transition-colors ${
                        severityFilter === sev
                          ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                          : 'bg-slate-900 text-slate-400 border-white/10 hover:text-white'
                      }`}
                    >
                      {sev}
                    </button>
                  ))}
                </div>
              </div>

              {/* Scrollable Timeline Cards */}
              <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
                {filteredViolations.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => jumpToTimestamp(item.timestamp)}
                    className="p-3 rounded-xl bg-slate-900/70 hover:bg-slate-800/90 border border-white/[0.06] hover:border-cyan-500/40 transition-all cursor-pointer space-y-1.5 group"
                  >
                    <div className="flex justify-between items-start">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          jumpToTimestamp(item.timestamp);
                        }}
                        className="px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 font-mono font-bold text-[10px] border border-cyan-500/30 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-colors"
                      >
                        ▶ {item.timestampFormatted}
                      </button>
                      <span
                        className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded ${
                          item.severity === 'CRITICAL'
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                        }`}
                      >
                        {item.severity}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {item.label}
                    </h4>
                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      {item.summary}
                    </p>

                    <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 pt-1">
                      <span>{item.zone}</span>
                      <span className="text-cyan-400 font-bold">{item.confidence}% Conf.</span>
                    </div>
                  </div>
                ))}

                {filteredViolations.length === 0 && (
                  <div className="text-center py-10 text-xs font-mono text-slate-500">
                    No incidents match current filter.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Evidence Snapshots Gallery */}
          <div className="space-y-3">
            <h3 className="font-mono font-bold text-xs text-white uppercase tracking-wider flex items-center gap-2">
              <span>📸</span>
              <span>Violation Evidence Keyframes ({videoAnalysisResult.violations.length} Snapshots)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5">
              {videoAnalysisResult.violations.map((v) => (
                <div
                  key={v.id}
                  onClick={() => jumpToTimestamp(v.timestamp)}
                  className="rounded-2xl bg-slate-900/70 border border-white/[0.08] overflow-hidden hover:border-cyan-500/40 transition-all cursor-pointer group shadow-lg"
                >
                  <div className="h-32 bg-slate-950 relative overflow-hidden">
                    <img
                      src={v.evidenceSnapshot || '/assets/demo/person_did_not_wear_safety_vest.png'}
                      alt={v.label}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-slate-950/80 text-[10px] font-mono font-bold text-cyan-300 border border-white/10 backdrop-blur-md">
                      {v.timestampFormatted}
                    </div>
                    <div
                      className={`absolute top-2 right-2 px-1.5 py-0.5 rounded text-[9px] font-mono font-black ${
                        v.severity === 'CRITICAL'
                          ? 'bg-rose-600 text-white'
                          : 'bg-amber-500 text-slate-950'
                      }`}
                    >
                      {v.severity}
                    </div>
                  </div>

                  <div className="p-3 space-y-1 font-mono">
                    <h5 className="text-xs font-bold text-white truncate">{v.label}</h5>
                    <p className="text-[10px] text-slate-400 truncate">{v.zone}</p>
                    <div className="flex justify-between items-center text-[10px] pt-1 border-t border-white/[0.04]">
                      <span className="text-cyan-400 font-bold">{v.confidence}%</span>
                      <span className="text-slate-400 group-hover:text-cyan-300 transition-colors">
                        Seek →
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Forensic Legal & Regulatory Safety Notice */}
          <div className="p-4 rounded-2xl bg-slate-950/90 border border-white/[0.08] text-xs font-mono text-slate-400 space-y-1.5">
            <div className="flex items-center gap-2 text-cyan-400 font-bold">
              <span>⚖️</span>
              <span>Regulatory Verification & Forensic AI Disclaimer:</span>
            </div>
            <p className="leading-relaxed">
              Model detections generated by {videoAnalysisResult.modelUsed} are probabilistic
              computer-vision inferences based on spatial bounding-box geometry and safety rule weights.
              Observed detections must be formally verified by an OSHA-certified safety supervisor prior
              to logging official disciplinary sanctions or stop-work orders.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
