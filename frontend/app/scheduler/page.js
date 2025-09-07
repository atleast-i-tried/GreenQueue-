"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";

// --- Custom Hook for Dark Mode ---
const useDarkMode = () => {
    const [theme, setTheme] = useState('light'); // Default to light theme as requested

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
    };

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove(theme === 'light' ? 'dark' : 'light');
        root.classList.add(theme);
        // Add a class to body for theme-specific global styles if needed
        document.body.className = `theme-${theme}`;
    }, [theme]);

    return [theme, toggleTheme];
};


// --- Enhanced SVG Icon Components ---
const ICONS = {
    Logo: ({ className }) => (<svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17.5 12.5C17.5 15.2614 15.2614 17.5 12.5 17.5H6.5V11.5H12.5C15.2614 11.5 17.5 9.26142 17.5 6.5C17.5 3.73858 15.2614 1.5 12.5 1.5H2.5V22.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>),
    UploadCloud: ({ className }) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" /><path d="M12 12v9" /><path d="m16 16-4-4-4 4" /></svg>),
    File: ({ className }) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /></svg>),
    X: ({ className }) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>),
    Loader: ({ className }) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="2" x2="12" y2="6" /><line x1="12" y1="18" x2="12" y2="22" /><line x1="4.93" y1="4.93" x2="7.76" y2="7.76" /><line x1="16.24" y1="16.24" x2="19.07" y2="19.07" /><line x1="2" y1="12" x2="6" y2="12" /><line x1="18" y1="12" x2="22" y2="12" /><line x1="4.93" y1="19.07" x2="7.76" y2="16.24" /><line x1="16.24" y1="7.76" x2="19.07" y2="4.93" /></svg>),
    Leaf: ({ className }) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 4 13V8a5 5 0 0 1 10 0v5a7 7 0 0 1-7 7Zm8-16a5 5 0 0 0-10 0v5a7 7 0 0 0 14 0V8a5 5 0 0 0-4-4Z" /></svg>),
    DollarSign: ({ className }) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="2" x2="12" y2="22" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H9.5" /></svg>),
    Zap: ({ className }) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>),
    Sun: ({ className }) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m4.93 19.07 1.41-1.41" /><path d="m17.66 6.34 1.41-1.41" /></svg>),
    Moon: ({ className }) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" /></svg>),
    CheckCircle: ({ className }) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>),
    AlertCircle: ({ className }) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>),
    Download: ({ className }) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>),
};

// --- Mock API with Failure State ---
const mockApi = {
    upload: (file) => new Promise(res => setTimeout(() => res({ filePath: `s3://mock-bucket/${file.name}` }), 1000)),
    launch: (filePath, priority) => new Promise(res => setTimeout(() => res({ jobId: `job_${Date.now()}`, region: "us-east-1", status: "Pending" }), 1000)),
    checkStatus: (jobId) => new Promise(res => setTimeout(() => {
        const statuses = ["Processing", "Processing", "Completed", "Failed"];
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        res({
            status: randomStatus,
            outputLink: randomStatus === "Completed" ? `https://mock-output.com/${jobId}-result.zip` : null,
        });
    }, 1500)),
};


// --- Child Components ---

const Card = ({ children, className = '' }) => (
    <div className={`bg-white/60 dark:bg-gray-800/40 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg rounded-3xl p-6 sm:p-8 ${className}`}>
        {children}
    </div>
);

const FileUploader = ({ file, setFile, disabled }) => {
    const [isDragging, setIsDragging] = useState(false);
    const handleDrag = (e, val) => { e.preventDefault(); e.stopPropagation(); if (!disabled) setIsDragging(val); };
    const handleDrop = (e) => {
        handleDrag(e, false);
        if (e.dataTransfer.files?.[0]) setFile(e.dataTransfer.files[0]);
    };
    const handleFileChange = (e) => { if (e.target.files?.[0]) setFile(e.target.files[0]); };

    return (
        <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">1. Upload File</h3>
            {!file ? (
                <label
                    htmlFor="file-upload"
                    className={`relative flex flex-col items-center justify-center w-full p-8 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-2xl cursor-pointer transition-all duration-300
                    ${isDragging ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20" : "bg-gray-50 dark:bg-gray-800/80 hover:bg-gray-100 dark:hover:bg-gray-700/80"}
                    ${disabled ? "cursor-not-allowed !bg-gray-100 dark:!bg-gray-800" : ""}`}
                    onDragEnter={(e) => handleDrag(e, true)} onDragOver={(e) => handleDrag(e, true)} onDragLeave={(e) => handleDrag(e, false)} onDrop={handleDrop}
                >
                    <ICONS.UploadCloud className="w-10 h-10 text-gray-400 dark:text-gray-500 mb-3" />
                    <p className="text-sm text-gray-600 dark:text-gray-400"><span className="font-semibold text-emerald-600 dark:text-emerald-400">Click to upload</span> or drag and drop</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Maximum file size: 50MB</p>
                    <input id="file-upload" type="file" className="sr-only" onChange={handleFileChange} disabled={disabled} />
                </label>
            ) : (
                <div className="flex items-center justify-between p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                    <div className="flex items-center space-x-3 overflow-hidden">
                        <ICONS.File className="h-6 w-6 text-emerald-500 dark:text-emerald-400 flex-shrink-0" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">{file.name}</span>
                    </div>
                    <button onClick={() => setFile(null)} className="p-1 text-gray-500 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 hover:text-gray-700 dark:hover:text-gray-200 transition-colors" aria-label="Remove file" disabled={disabled}>
                        <ICONS.X className="h-5 w-5" />
                    </button>
                </div>
            )}
        </div>
    );
};

const PrioritySelector = ({ priority, setPriority, disabled }) => {
    const priorities = [
        { id: "Green", label: "Eco", icon: ICONS.Leaf },
        { id: "Cheap", label: "Budget", icon: ICONS.DollarSign },
        { id: "Fast", label: "Urgent", icon: ICONS.Zap },
    ];
    return (
        <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">2. Set Priority</h3>
            <div className="grid grid-cols-3 gap-3">
                {priorities.map(({ id, label, icon: Icon }) => (
                    <button
                        key={id} type="button" onClick={() => setPriority(id)} disabled={disabled}
                        className={`group flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 transform hover:-translate-y-1
                        ${priority === id ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 shadow-lg" : "border-gray-300 dark:border-gray-700 bg-transparent hover:border-gray-400 dark:hover:border-gray-500"}
                        ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
                    >
                        <Icon className={`h-7 w-7 mb-2 transition-colors ${priority === id ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200'}`} />
                        <span className={`text-sm font-semibold transition-colors ${priority === id ? 'text-emerald-700 dark:text-emerald-300' : 'text-gray-600 dark:text-gray-300 group-hover:text-gray-800 dark:group-hover:text-gray-100'}`}>{label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

const JobTracker = ({ job, onCheckStatus, isCheckingStatus }) => {
    const statusMap = useMemo(() => ({
        Pending: { text: "Job Pending", color: "amber", step: 1 },
        Processing: { text: "Processing Data", color: "sky", step: 2 },
        Completed: { text: "Completed", color: "emerald", step: 3 },
        Failed: { text: "Failed", color: "rose", step: 3 },
    }), []);

    const currentStatus = statusMap[job?.status] || { text: "Unknown", color: "gray", step: 0 };
    const timelineSteps = ["Job Submitted", "Processing", "Finished"];

    return (
        <Card className="mt-8 transition-opacity duration-500 animate-fade-in">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">Job Tracker</h2>
            {job ? (
                <>
                    <div className="flex items-center justify-between mb-6">
                        <p className="text-sm text-gray-500 dark:text-gray-400">ID: <span className="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{job.jobId}</span></p>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-${currentStatus.color}-100 dark:bg-${currentStatus.color}-500/20 text-${currentStatus.color}-800 dark:text-${currentStatus.color}-300`}>
                            {currentStatus.text}
                        </span>
                    </div>
                    {/* Timeline */}
                    <div className="relative w-full mb-8">
                        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 dark:bg-gray-700" />
                        <div className="absolute top-1/2 left-0 h-0.5 bg-emerald-500 transition-all duration-500" style={{ width: `${((currentStatus.step -1) / (timelineSteps.length -1)) * 100}%` }}/>
                        <div className="relative flex justify-between">
                            {timelineSteps.map((step, i) => {
                                const stepIndex = i + 1;
                                const isCompleted = currentStatus.step > stepIndex;
                                const isActive = currentStatus.step === stepIndex;
                                return (
                                <div key={i} className="flex flex-col items-center text-center">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                                        isCompleted ? 'bg-emerald-500 border-emerald-500' : 
                                        isActive ? 'bg-white dark:bg-gray-800 border-emerald-500 scale-110 shadow-lg' : 
                                        'bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600'
                                    }`}>
                                      {isCompleted ? <ICONS.CheckCircle className="w-6 h-6 text-white" /> : <div className={`w-3 h-3 rounded-full transition-colors ${isActive ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>}
                                    </div>
                                    <span className={`mt-2 text-xs font-semibold w-20 ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-500 dark:text-gray-400'}`}>{step}</span>
                                </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <button onClick={onCheckStatus} disabled={isCheckingStatus} className="w-full flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:bg-emerald-400 dark:focus:ring-offset-gray-900 disabled:cursor-not-allowed transition-all">
                            {isCheckingStatus ? <><ICONS.Loader className="animate-spin h-5 w-5" /> Refreshing...</> : '🔄 Refresh Status'}
                        </button>
                        {job.status === 'Completed' && (
                            <a href={job.outputLink} target="_blank" rel="noopener noreferrer" className="w-full flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg text-gray-700 dark:text-gray-200 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:focus:ring-offset-gray-900 transition-all">
                                <ICONS.Download className="h-5 w-5" /> Download Result
                            </a>
                        )}
                         {job.status === 'Failed' && (
                            <div className="w-full flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-500/20">
                               <ICONS.AlertCircle className="h-5 w-5" /> Please try again
                            </div>
                        )}
                    </div>
                </>
            ) : (
                <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">Submit a job to see its status here.</p>
                </div>
            )}
        </Card>
    );
};


// --- Main Application Component ---

export default function GreenQueue_Dashboard() {
    const [file, setFile] = useState(null);
    const [priority, setPriority] = useState("Green");
    const [job, setJob] = useState(null);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isCheckingStatus, setIsCheckingStatus] = useState(false);
    const [theme, toggleTheme] = useDarkMode();

    const handleApiError = (message, err) => { console.error(err); setError(message); };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) { setError("Please select a file to upload."); return; }
        setError(""); setIsLoading(true); setJob(null);
        try {
            const { filePath } = await mockApi.upload(file);
            if (!filePath) throw new Error("File path not returned.");
            const jobData = await mockApi.launch(filePath, priority);
            setJob(jobData);
        } catch (err) {
            handleApiError("Failed to launch job. Please try again.", err);
        } finally {
            setIsLoading(false);
        }
    };

    const checkStatus = useCallback(async () => {
        if (!job?.jobId) return;
        setIsCheckingStatus(true); setError("");
        try {
            const { status, outputLink } = await mockApi.checkStatus(job.jobId);
            setJob(prev => ({ ...prev, status, outputLink }));
        } catch (err) {
            handleApiError("Failed to retrieve job status.", err);
        } finally {
            setIsCheckingStatus(false);
        }
    }, [job?.jobId]);
    
    // Auto-refresh when processing
    useEffect(() => {
        if (job?.status === 'Processing') {
            const timer = setTimeout(checkStatus, 3000);
            return () => clearTimeout(timer);
        }
    }, [job?.status, checkStatus]);

    return (
        <div className="min-h-screen w-full bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans transition-colors duration-300">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 -z-10 h-full w-full bg-white dark:bg-gray-900">
                <div className="absolute top-0 z-[-2] h-screen w-screen bg-[radial-gradient(100%_50%_at_50%_0%,rgba(16,185,129,0.1)_0,rgba(255,255,255,0)_50%,rgba(255,255,255,0)_100%)] dark:bg-[radial-gradient(100%_50%_at_50%_0%,rgba(16,185,129,0.2)_0,rgba(10,10,10,0)_50%,rgba(10,10,10,0)_100%)]"></div>
            </div>
            
            <header className="fixed top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200/80 dark:border-gray-800/80">
                <div className="flex items-center gap-3">
                    <ICONS.Logo className="h-7 w-7 text-emerald-600"/>
                    <h1 className="text-xl font-bold tracking-tight text-gray-800 dark:text-white">GreenQueue</h1>
                </div>
                <button onClick={toggleTheme} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    {theme === 'dark' ? <ICONS.Sun className="h-5 w-5" /> : <ICONS.Moon className="h-5 w-5" />}
                </button>
            </header>

            <main className="pt-28 pb-12 px-4 flex flex-col items-center">
                <div className="w-full max-w-2xl">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight sm:text-4xl">
                            Sustainable Job Processing
                        </h2>
                        <p className="mt-3 max-w-xl mx-auto text-base text-gray-500 dark:text-gray-400 sm:text-lg">
                           Powerful computing that's easy on the planet. Upload, prioritize, and process.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <Card>
                            <div className="space-y-6">
                                <FileUploader file={file} setFile={setFile} disabled={isLoading} />
                                <PrioritySelector priority={priority} setPriority={setPriority} disabled={isLoading} />
                            </div>
                        </Card>

                        <div>
                             {error && (
                                <div className="bg-rose-50 dark:bg-rose-500/10 border-l-4 border-rose-400 dark:border-rose-500 p-4 mb-6 rounded-r-lg" role="alert">
                                    <p className="text-sm font-medium text-rose-700 dark:text-rose-300">{error}</p>
                                </div>
                            )}
                            <button
                                type="submit"
                                disabled={isLoading || !file}
                                className="w-full group inline-flex items-center justify-center gap-2 rounded-xl px-6 py-4 text-lg font-semibold text-white bg-emerald-600 shadow-lg shadow-emerald-500/30 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 dark:focus:ring-offset-gray-900 disabled:bg-emerald-400 disabled:shadow-none disabled:cursor-not-allowed transition-all duration-300 transform hover:-translate-y-1"
                            >
                                {isLoading ? (
                                    <><ICONS.Loader className="animate-spin h-6 w-6" /> Submitting Job...</>
                                ) : (
                                    <>🍃 Launch Green Job <span className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">→</span></>
                                )}
                            </button>
                        </div>
                    </form>

                    <JobTracker job={job} onCheckStatus={checkStatus} isCheckingStatus={isCheckingStatus} />
                </div>
            </main>
        </div>
    );
}

