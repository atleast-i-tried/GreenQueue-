"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";

// --- Icons ---
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

// --- Mock API --- (unchanged)
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

// --- UI primitives: strictly white + green shades only ---
const Card = ({ children, className = "" }) => (
  <div className={`bg-white border border-green-200 rounded-2xl p-6 sm:p-8 ${className}`}>
    {children}
  </div>
);

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
          <p className="text-sm text-green-700"><span className="font-semibold text-green-700">Click to upload</span> or drag and drop</p>
          <p className="text-xs text-green-600 mt-1">Up to 50MB. Files are processed locally (mock).</p>
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

const JobTracker = ({ job, onCheckStatus, isCheckingStatus }) => {
  const statusMap = useMemo(() => ({ Pending: { text: 'Job Pending', step: 1 }, Processing: { text: 'Processing Data', step: 2 }, Completed: { text: 'Completed', step: 3 }, Failed: { text: 'Failed', step: 3 } }), []);

  const getStatusStyles = (status) => {
    // only green/white shades
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
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-green-700" aria-live="polite">ID: <span className="font-mono px-2 py-1 rounded border border-green-200 bg-green-50">{job.jobId}</span></p>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${badgeBg} ${badgeText}`}>{current.text}</span>
          </div>

          <div className="relative w-full mb-8">
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

          <div className="flex flex-col sm:flex-row gap-3">
            <button onClick={onCheckStatus} disabled={isCheckingStatus} className="w-full flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg shadow-sm text-white bg-green-700 hover:bg-green-800 disabled:bg-green-300 transition-all">
              {isCheckingStatus ? <><ICONS.Loader className="animate-spin h-5 w-5" /> Refreshing...</> : '🔄 Refresh Status'}
            </button>

            {job.status === 'Completed' && (
              <a href={job.outputLink} target="_blank" rel="noopener noreferrer" className="w-full flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg text-green-800 bg-green-50 hover:bg-green-100 no-underline">
                <ICONS.Download className="h-5 w-5" /> Download Result
              </a>
            )}

            {job.status === 'Failed' && (
              <div className="w-full flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg text-green-800 bg-green-50">
                <ICONS.CheckCircle className="h-5 w-5" /> Please try again
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

export default function GreenQueue_Dashboard() {
  const [file, setFile] = useState(null);
  const [priority, setPriority] = useState('Green');
  const [job, setJob] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleApiError = (message, err) => { console.error(err); setError(message); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) { setError('Please select a file to upload.'); return; }
    setError(''); setIsLoading(true); setJob(null); setUploadProgress(0);

    const progressInterval = setInterval(() => setUploadProgress((p) => Math.min(90, Math.round(p + Math.random() * 15))), 300);

    try {
      const { filePath } = await mockApi.upload(file);
      clearInterval(progressInterval);
      setUploadProgress(100);
      await new Promise((r) => setTimeout(r, 300));
      if (!filePath) throw new Error('File path not returned.');
      const jobData = await mockApi.launch(filePath, priority);
      setJob(jobData);
      setUploadProgress(0);
    } catch (err) {
      handleApiError('Failed to launch job. Please try again.', err);
      setUploadProgress(0);
    } finally { setIsLoading(false); }
  };

  const checkStatus = useCallback(async () => {
    if (!job?.jobId) return;
    setIsCheckingStatus(true); setError('');
    try { const { status, outputLink } = await mockApi.checkStatus(job.jobId); setJob((prev) => ({ ...prev, status, outputLink })); }
    catch (err) { handleApiError('Failed to retrieve job status.', err); }
    finally { setIsCheckingStatus(false); }
  }, [job?.jobId]);

  useEffect(() => { if (job?.status === 'Processing') { const t = setTimeout(checkStatus, 3000); return () => clearTimeout(t); } }, [job?.status, checkStatus]);

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

              <button type="submit" disabled={isLoading || !file} className="w-full group inline-flex items-center justify-center gap-2 rounded-xl px-6 py-4 text-lg font-semibold text-white bg-green-700 shadow-lg hover:bg-green-800 disabled:bg-green-300 transition-all duration-200">
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
