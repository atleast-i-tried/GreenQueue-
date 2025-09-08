"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";

// --- Icons (unchanged) ---
const ICONS = {
  Logo: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.5 12.5C17.5 15.2614 15.2614 17.5 12.5 17.5H6.5V11.5H12.5C15.2614 11.5 17.5 9.26142 17.5 6.5C17.5 3.73858 15.2614 1.5 12.5 1.5H2.5V22.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  UploadCloud: ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
      <path d="M12 12v9" />
      <path d="m16 16-4-4-4 4" />
    </svg>
  ),
  File: ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  ),
  X: ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  Loader: ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="2" x2="12" y2="6" />
      <line x1="12" y1="18" x2="12" y2="22" />
      <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
      <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
      <line x1="2" y1="12" x2="6" y2="12" />
      <line x1="18" y1="12" x2="22" y2="12" />
      <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
      <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
    </svg>
  ),
  CheckCircle: ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  Download: ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  ),
};

// --- Mock API (unchanged) ---
const mockApi = {
  upload: (file) => new Promise((res) => setTimeout(() => res({ filePath: `s3://mock-bucket/${file.name}` }), 1000)),
  launch: (filePath, priority) => new Promise((res) => setTimeout(() => res({ jobId: `job_${Date.now()}`, region: "us-east-1", status: "Pending" }), 1000)),
  checkStatus: (jobId) => new Promise((res) => setTimeout(() => {
    const statuses = ["Processing", "Processing", "Completed", "Failed"];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    res({ status: randomStatus, outputLink: randomStatus === "Completed" ? `https://mock-output.com/${jobId}-result.zip` : null });
  }, 1500)),
};

// --- Helpers ---
const formatBytes = (bytes) => {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  let i = 0;
  let value = bytes;
  while (value >= 1024 && i < units.length - 1) {
    value /= 1024;
    i++;
  }
  return `${Math.round(value * 10) / 10} ${units[i]}`;
};

// UI primitives
const Card = ({ children, className = "" }) => (
  <div className={`bg-white border border-green-200 rounded-2xl p-6 sm:p-8 ${className}`}>
    {children}
  </div>
);

// File uploader
const FileUploader = ({ file, setFile, disabled }) => {
  const [isDragging, setIsDragging] = useState(false);
  const handleDrag = (e, val) => { e.preventDefault(); e.stopPropagation(); if (!disabled) setIsDragging(val); };
  const handleDrop = (e) => { handleDrag(e, false); if (e.dataTransfer.files?.[0]) setFile(e.dataTransfer.files[0]); };
  const handleFileChange = (e) => { if (e.target.files?.[0]) setFile(e.target.files[0]); };

  return (
    <div>
      <h3 className="text-lg font-semibold text-green-800 mb-4">1. Upload File</h3>

      {!file ? (
        <label
          htmlFor="file-upload"
          className={`relative flex flex-col items-center justify-center w-full p-8 border-2 border-green-200 border-dashed rounded-2xl cursor-pointer transition-all duration-200 ${isDragging ? "bg-green-50 scale-[1.01] shadow" : "bg-white hover:bg-green-50"} ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
          onDragEnter={(e) => handleDrag(e, true)} onDragOver={(e) => handleDrag(e, true)} onDragLeave={(e) => handleDrag(e, false)} onDrop={handleDrop}
        >
          <ICONS.UploadCloud className="w-12 h-12 text-green-600 mb-3" />
          <p className="text-sm text-green-700"><span className="font-semibold text-green-700">Submit a Job</span> or drag and drop</p>
          <p className="text-xs text-green-600 mt-1">.</p>
          <input id="file-upload" type="file" className="sr-only" onChange={handleFileChange} disabled={disabled} />
        </label>
      ) : (
        <div className="flex items-center justify-between p-4 border border-green-200 rounded-xl bg-green-50">
          <div className="flex items-center space-x-3 overflow-hidden">
            <ICONS.File className="h-6 w-6 text-green-700 flex-shrink-0" />
            <div className="flex flex-col">
              <span className="text-sm font-medium text-green-800 truncate">{file.name}</span>
              <span className="text-xs text-green-600">{formatBytes(file.size)} • {file.type || 'unknown'}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setFile(null)} className="p-2 text-green-700 rounded-md hover:bg-green-100 transition-colors" aria-label="Remove file" disabled={disabled}>
              <ICONS.X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Priority selector
const PrioritySelector = ({ priority, setPriority, disabled }) => {
  const priorities = [
    { id: "Green", label: "Eco", icon: ICONS.CheckCircle },
    { id: "Cheap", label: "Budget", icon: ICONS.Download },
    { id: "Fast", label: "Urgent", icon: ICONS.Loader },
  ];

  return (
    <div>
      <h3 className="text-lg font-semibold text-green-800 mb-4">2. Set Priority</h3>
      <div className="grid grid-cols-3 gap-3">
        {priorities.map(({ id, label, icon: Icon }) => {
          const isActive = priority === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setPriority(id)}
              disabled={disabled}
              className={`group flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 transform ${isActive ? 'border-green-700 bg-green-50 shadow' : 'border-green-200 bg-white hover:bg-green-50'} ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              <Icon className={`h-7 w-7 mb-2 ${isActive ? 'text-green-800' : 'text-green-600'}`} />
              <span className={`text-sm font-semibold ${isActive ? 'text-green-800' : 'text-green-700'}`}>{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// Service selector
const ServiceSelector = ({ service, setService, disabled }) => {
  const services = [
    { id: "Instances", label: "Compute Instances" },
    { id: "Storage", label: "Storage (S3/EBS)" },
    { id: "Databases", label: "Databases" },
  ];

  return (
    <div className="mt-4">
      <label className="block text-sm font-medium text-green-700 mb-2">Choose service to compare costs</label>
      <div className="relative">
        <select
          value={service || ""}
          onChange={(e) => setService(e.target.value || null)}
          disabled={disabled}
          className="w-full rounded-lg border border-green-200 bg-white py-3 px-4 pr-10 text-green-700 focus:outline-none focus:ring-2 focus:ring-green-100"
        >
          <option value="">— Select a service —</option>
          {services.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
      </div>
    </div>
  );
};

// InstanceType selector
const InstanceTypeSelector = ({ instanceType, setInstanceType, disabled }) => {
  const types = ["t3.micro", "t3.small", "t2.micro", "m5.large"];
  return (
    <div className="mt-3">
      <label className="block text-sm font-medium text-green-700 mb-2">Select instance type</label>
      <select value={instanceType || ""} onChange={(e) => setInstanceType(e.target.value || null)} disabled={disabled}
        className="w-full rounded-lg border border-green-200 bg-white py-2 px-3 text-green-700">
        <option value="">— Select instance type —</option>
        {types.map(t => <option key={t} value={t}>{t}</option>)}
      </select>
    </div>
  );
};

// DB instance class selector
const DBClassSelector = ({ dbInstanceClass, setDbInstanceClass, disabled }) => {
  const classes = ["db.t3.micro", "db.t3.small", "db.t2.micro", "db.m5.large"];
  return (
    <div className="mt-3">
      <label className="block text-sm font-medium text-green-700 mb-2">Select DB instance class (optional)</label>
      <select value={dbInstanceClass || ""} onChange={(e) => setDbInstanceClass(e.target.value || null)} disabled={disabled}
        className="w-full rounded-lg border border-green-200 bg-white py-2 px-3 text-green-700">
        <option value="">— select (default db.t3.micro) —</option>
        {classes.map(c => <option key={c} value={c}>{c}</option>)}
      </select>
    </div>
  );
};

// ---------------------------
// Simplified CostPanel (your pasted simple version)
// shows single region/location/price returned by /api/schedule
// ---------------------------
const CostPanel = ({ costResult, loading, error }) => {
  if (loading) {
    return (
      <div className="mt-4 p-4 rounded-lg border border-green-100 bg-green-50 text-center text-green-700">
        Loading pricing info...
      </div>
    );
  }
  if (error) {
    return (
      <div className="mt-4 p-4 rounded-lg border-l-4 border-green-700 bg-green-50 text-sm text-green-800">
        {error}
      </div>
    );
  }
  if (!costResult) return null;

  return (
    <div className="mt-4 p-4 rounded-lg border border-green-100 bg-white">
      <h4 className="text-sm font-semibold text-green-800 mb-2">Pricing Info</h4>
      <div className="text-sm text-green-700">
        <p><strong>Region:</strong> {costResult.region || "unknown"}</p>
        <p><strong>Location:</strong> {costResult.location || "unknown"}</p>
        <p><strong>Price:</strong> ${costResult.price != null ? (Number(costResult.price).toFixed(4)) : "unknown"}</p>
      </div>
    </div>
  );
};

// Job tracker (unchanged)
const JobTracker = ({ job, onCheckStatus, isCheckingStatus }) => {
  const statusMap = useMemo(() => ({ Pending: { text: 'Job Submitted', step: 1 }, Processing: { text: 'Processing Data', step: 2 }, Completed: { text: 'Completed', step: 3 }, Failed: { text: 'Failed', step: 3 } }), []);

  const getStatusStyles = (status) => {
    switch (status) {
      case 'Pending':
      case 'Processing':
        return { badgeBg: 'bg-green-50', badgeText: 'text-green-700' };
      case 'Completed':
        return { badgeBg: 'bg-green-100', badgeText: 'text-green-800' };
      case 'Failed':
        return { badgeBg: 'bg-green-50', badgeText: 'text-green-800' };
      default:
        return { badgeBg: 'bg-white', badgeText: 'text-green-700' };
    }
  };

  const current = statusMap[job?.status] || { text: 'Unknown', step: 0 };
  const { badgeBg, badgeText } = getStatusStyles(job?.status);
  const timelineSteps = ['Job Submitted', 'Processing', 'Finished'];

  return (
    <Card className="mt-8">
      <h2 className="text-xl font-bold text-green-800 mb-2">Job Tracker</h2>

      {job ? (
        <>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-green-700" aria-live="polite">ID: <span className="font-mono px-2 py-1 rounded border border-green-200 bg-green-50">{job.jobId}</span></p>
              <p className="text-sm text-green-700 mt-2">Scheduled Region: <span className="font-mono px-2 py-1 rounded border border-green-200 bg-green-50">{job.region}</span></p>
            </div>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${badgeBg} ${badgeText}`}>{current.text}</span>
          </div>

          <div className="relative w-full mb-6">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-green-100" />
            <div className="absolute top-1/2 left-0 h-0.5 bg-green-700 transition-all duration-500" style={{ width: `${((current.step - 1) / (timelineSteps.length - 1)) * 100}%` }} />

            <div className="relative flex justify-between">
              {timelineSteps.map((step, i) => {
                const stepIndex = i + 1;
                const isCompleted = current.step > stepIndex;
                const isActive = current.step === stepIndex;
                return (
                  <div key={i} className="flex flex-col items-center text-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${isCompleted ? 'bg-green-700 border-green-700' : isActive ? 'bg-white border-green-700 scale-110 shadow' : 'bg-white border-green-200'}`}>
                      {isCompleted ? <ICONS.CheckCircle className="w-6 h-6 text-white" /> : <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-green-700' : 'bg-green-200'}`} />}
                    </div>
                    <span className={`mt-2 text-xs font-semibold w-28 ${isActive ? 'text-green-800' : 'text-green-700'}`}>{step}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mb-4 text-sm text-green-700">
            <p><strong>Priority:</strong> {job.priority || '—'}</p>
            <p className="mt-1"><strong>Carbon:</strong> {job.details?.carbon ?? '—'} gCO₂/kWh • <strong>Cost:</strong> ${job.details?.cost ?? '—'} • <strong>Speed:</strong> {job.details?.speed ?? '—'}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button onClick={onCheckStatus} disabled={isCheckingStatus} className="w-full flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg shadow-sm text-white bg-green-700 hover:bg-green-800 disabled:bg-green-300 transition-all">
              {isCheckingStatus ? <><ICONS.Loader className="animate-spin h-5 w-5" /> Refreshing...</> : '🔄 Refresh Status'}
            </button>

            {job.status === 'Failed' && (
              <div className="w-full flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg text-green-800 bg-green-50">
                <ICONS.CheckCircle className="h-5 w-5" /> Job failed — try again
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="text-center py-8">
          <p className="text-green-700">Submit a job to see its status here.</p>
        </div>
      )}
    </Card>
  );
};

// ---------------------------
// Main dashboard component
// (keeps your original UI intact, but calls /api/schedule in the simplified way when Cheap)
// ---------------------------
export default function GreenQueue_Dashboard() {
  const [file, setFile] = useState(null);
  const [priority, setPriority] = useState('Green');
  const [service, setService] = useState(null);
  const [instanceType, setInstanceType] = useState(null);
  const [dbInstanceClass, setDbInstanceClass] = useState(null);

  const [costResult, setCostResult] = useState(null);
  const [costLoading, setCostLoading] = useState(false);
  const [costError, setCostError] = useState("");

  const [job, setJob] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleApiError = (message, err) => { console.error(err); setError(message); };

  // Reset service and cost data when switching away from Cheap
  useEffect(() => {
    if (priority !== "Cheap") {
      setService(null);
      setInstanceType(null);
      setDbInstanceClass(null);
      setCostResult(null);
      setCostError("");
    }
  }, [priority]);

  // handle form submit: upload -> if Cheap call pricing backend; else use mock launch
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setError("");
    setCostError("");
    setCostResult(null);

    // basic validations
    if (!file) { setError('Please select a file to upload.'); return; }
    if (priority === "Cheap" && !service) { setError('Please select a service for cost comparison.'); return; }
    if (priority === "Cheap" && service === "Instances" && !instanceType) { setError('Please pick an instance type to compare costs.'); return; }

    setIsLoading(true);
    setJob(null);
    setUploadProgress(0);

    const progressInterval = setInterval(() =>
      setUploadProgress((p) => Math.min(90, Math.round(p + Math.random() * 15)))
    , 300);

    try {
      // simulate upload (or you can keep your real upload logic)
      const { filePath } = await mockApi.upload(file);
      clearInterval(progressInterval);
      setUploadProgress(100);

      if (priority === "Cheap") {
        // --- simplified pricing call per your last pasted snippet ---
        setCostLoading(true);
        setCostResult(null);
        setCostError("");

        try {
          // Build minimal payload expected by your simple /api/schedule route
          // when service === "Instances" we send instanceType
          const payload = {};
          if (service === "Instances") payload.instanceType = instanceType || "t3.micro";
          else payload.service = service || "Storage";

          const res = await fetch("/api/schedule", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

          const data = await res.json();

          if (!res.ok) {
            const msg = data?.error || data?.message || "Failed to fetch pricing";
            setCostError(msg);
            throw new Error(msg);
          }

          // route.js (your last working version) returns { region, location, price } for best region
          const region = data.region || data.regionName || data.scheduledRegion || null;
          const location = data.location || data.locationName || null;
          const price = (data.price != null) ? Number(data.price) : (data.pricePerUnit ? Number(data.pricePerUnit) : null);

          const simpleCost = { region, location, price };
          setCostResult(simpleCost);

          // set Job with scheduled region from pricing API
          const newJob = {
            jobId: `job_${Date.now()}`,
            region: region || "unknown",
            status: 'Pending', // job will show pending then processing
            priority,
            details: { scheduledBy: "pricing-api", raw: data },
          };
          setJob(newJob);

          // optional: immediately move to Processing state for UI feedback
          setTimeout(() => setJob((j) => j ? { ...j, status: 'Processing' } : j), 800);

        } catch (err) {
          console.error("Pricing call failed:", err);
          if (!costError) setCostError(err.message || "Failed to fetch pricing. See console for details.");
        } finally {
          setCostLoading(false);
        }
      } else {
        // Non-Cheap: use mock launcher (unchanged)
        const launch = await mockApi.launch(filePath, priority);
        const newJob = {
          jobId: launch.jobId,
          region: launch.region || "us-east-1",
          status: launch.status || 'Pending',
          priority,
          details: {},
        };
        setJob(newJob);
      }

      setUploadProgress(0);
    } catch (err) {
      handleApiError('Failed to launch job. Please try again.', err);
      setUploadProgress(0);
    } finally {
      setIsLoading(false);
      clearInterval(progressInterval);
    }
  }, [file, priority, service, instanceType, dbInstanceClass, costError]);

  const checkStatus = useCallback(async () => {
    if (!job?.jobId) return;
    setIsCheckingStatus(true); setError('');
    try { const { status } = await mockApi.checkStatus(job.jobId); setJob((prev) => ({ ...prev, status })); }
    catch (err) { handleApiError('Failed to retrieve job status.', err); }
    finally { setIsCheckingStatus(false); }
  }, [job?.jobId]);

  useEffect(() => { if (job?.status === 'Processing') { const t = setTimeout(checkStatus, 3000); return () => clearTimeout(t); } }, [job?.status, checkStatus]);

  // UI: when service changes we only set state; no immediate pricing fetch
  const onServiceChange = (svc) => {
    setService(svc);
    // reset dependent selectors
    setInstanceType(null);
    setDbInstanceClass(null);
    setCostResult(null);
    setCostError("");
  };

  return (
    <div className="min-h-screen w-full bg-white text-green-800 font-sans antialiased">
      <div className="absolute top-0 left-0 -z-10 h-full w-full bg-white">
        <div className="absolute top-0 z-[-2] h-screen w-screen bg-[radial-gradient(100%_50%_at_50%_0%,rgba(16,185,129,0.10)_0,rgba(255,255,255,0)_55%,rgba(255,255,255,0)_100%)]" />
      </div>

      <header className="fixed top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-white border-b border-green-200">
        <div className="flex items-center gap-3">
          <ICONS.Logo className="h-7 w-7 text-green-700" />
          <h1 className="text-xl font-bold tracking-tight">GreenQueue</h1>
        </div>
      </header>

      <main className="pt-28 pb-12 px-4 flex flex-col items-center">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-green-800 tracking-tight sm:text-4xl">Sustainable Job Processing</h2>
            <p className="mt-3 max-w-xl mx-auto text-base text-green-700 sm:text-lg">Powerful computing that's easy on the planet. Upload, prioritize, and process — optimized for quick testing.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <div className="space-y-6">
                <FileUploader file={file} setFile={setFile} disabled={isLoading} />
                <PrioritySelector priority={priority} setPriority={setPriority} disabled={isLoading} />

                {priority === "Cheap" && (
                  <div>
                    <ServiceSelector service={service} setService={onServiceChange} disabled={isLoading || costLoading} />

                    {service === "Instances" && (
                      <InstanceTypeSelector instanceType={instanceType} setInstanceType={setInstanceType} disabled={isLoading || costLoading} />
                    )}

                    {service === "Databases" && (
                      <DBClassSelector dbInstanceClass={dbInstanceClass} setDbInstanceClass={setDbInstanceClass} disabled={isLoading || costLoading} />
                    )}

                    {/* Show the simplified cost panel after submit */}
                    <CostPanel costResult={costResult} loading={costLoading} error={costError} />
                  </div>
                )}

                {isLoading && (
                  <div className="w-full bg-green-50 rounded-lg overflow-hidden">
                    <div className="flex items-center justify-between px-3 py-2 text-xs text-green-700">
                      <span>Uploading — {uploadProgress}%</span>
                      <span>{formatBytes(file?.size)}</span>
                    </div>
                    <div className="h-2 w-full bg-green-100">
                      <div className="h-2 bg-green-700 transition-all" style={{ width: `${uploadProgress}%` }} />
                    </div>
                  </div>
                )}
              </div>
            </Card>

            <div>
              {error && (
                <div className="bg-green-50 border-l-4 border-green-700 p-4 mb-6 rounded-r-lg" role="alert">
                  <p className="text-sm font-medium text-green-800">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || !file || (priority === "Cheap" && !service) || (priority === "Cheap" && service === "Instances" && !instanceType)}
                className="w-full group inline-flex items-center justify-center gap-2 rounded-xl px-6 py-4 text-lg font-semibold text-white bg-green-700 shadow-lg hover:bg-green-800 disabled:bg-green-300 transition-all duration-200"
              >
                {isLoading ? <><ICONS.Loader className="animate-spin h-6 w-6" /> Processing...</> : <>🍃 Launch Green Job</>}
              </button>
            </div>
          </form>

          <JobTracker job={job} onCheckStatus={checkStatus} isCheckingStatus={isCheckingStatus} />
        </div>
      </main>
    </div>
  );
}
