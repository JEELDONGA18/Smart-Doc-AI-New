"use client";

import { useState, useRef } from "react";
import TopNav from "@/app/components/dashboard/TopNav";
import { useSidebarToggle } from "@/app/(dashboard)/layout";
import { useToast } from "@/app/components/ui/Toast";

const ALLOWED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
  "text/csv",
];

const ALLOWED_EXTENSIONS = ["pdf", "docx", "txt", "csv"];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

const typeColors = {
  pdf: "text-red-400 bg-red-400/10",
  docx: "text-blue-400 bg-blue-400/10",
  txt: "text-zinc-400 bg-zinc-400/10",
  csv: "text-emerald-400 bg-emerald-400/10",
};

const typeIcons = {
  pdf: "PDF",
  docx: "DOC",
  txt: "TXT",
  csv: "CSV",
};

const mockDocuments = [
  { id: 1, name: "Q4-Financial-Report.pdf", size: 2_450_000, type: "pdf", uploadedAt: "2026-05-27" },
  { id: 2, name: "Project-Proposal-Draft.docx", size: 890_000, type: "docx", uploadedAt: "2026-05-26" },
  { id: 3, name: "Meeting-Notes-May.txt", size: 12_400, type: "txt", uploadedAt: "2026-05-25" },
  { id: 4, name: "Customer-Data-Export.csv", size: 5_600_000, type: "csv", uploadedAt: "2026-05-24" },
  { id: 5, name: "Legal-Contract-v2.pdf", size: 1_230_000, type: "pdf", uploadedAt: "2026-05-23" },
  { id: 6, name: "Product-Requirements.docx", size: 445_000, type: "docx", uploadedAt: "2026-05-22" },
];

function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

function getExtension(filename) {
  return filename.split(".").pop().toLowerCase();
}

export default function UploadPage() {
  const toggleSidebar = useSidebarToggle();
  const toast = useToast();
  const fileInputRef = useRef(null);

  const [files, setFiles] = useState(mockDocuments);
  const [uploading, setUploading] = useState([]);
  const [dragActive, setDragActive] = useState(false);

  function validateFile(file) {
    const ext = getExtension(file.name);
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      toast.error(`Invalid file type: .${ext}. Only PDF, DOCX, TXT, CSV are allowed.`);
      return false;
    }
    if (file.size > MAX_SIZE) {
      toast.error(`${file.name} exceeds 10MB limit.`);
      return false;
    }
    return true;
  }

  function simulateUpload(file) {
    const uploadId = Date.now() + Math.random();
    const ext = getExtension(file.name);

    const uploadItem = {
      id: uploadId,
      name: file.name,
      size: file.size,
      progress: 0,
    };

    setUploading((prev) => [...prev, uploadItem]);

    const interval = setInterval(() => {
      setUploading((prev) =>
        prev.map((u) =>
          u.id === uploadId ? { ...u, progress: Math.min(u.progress + 5, 100) } : u
        )
      );
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      setUploading((prev) => prev.filter((u) => u.id !== uploadId));
      setFiles((prev) => [
        {
          id: Date.now(),
          name: file.name,
          size: file.size,
          type: ext,
          uploadedAt: new Date().toISOString().split("T")[0],
        },
        ...prev,
      ]);
      toast.success(`${file.name} uploaded successfully`);
    }, 2200);
  }

  function handleFiles(fileList) {
    const incoming = Array.from(fileList);
    incoming.forEach((file) => {
      if (validateFile(file)) {
        simulateUpload(file);
      }
    });
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files.length) {
      handleFiles(e.dataTransfer.files);
    }
  }

  function handleDragOver(e) {
    e.preventDefault();
    setDragActive(true);
  }

  function handleDragLeave(e) {
    e.preventDefault();
    setDragActive(false);
  }

  function cancelUpload(id) {
    setUploading((prev) => prev.filter((u) => u.id !== id));
  }

  function deleteFile(id) {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    toast.success("Document deleted");
  }

  return (
    <>
      <TopNav title="Documents" onMenuClick={toggleSidebar} />

      <div className="px-6 py-8 max-w-5xl mx-auto">
        {/* Upload Zone */}
        <div
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${
            dragActive
              ? "border-indigo-500/50 bg-indigo-500/[0.04]"
              : "border-white/[0.08] hover:border-indigo-500/30 hover:bg-indigo-500/[0.02]"
          }`}
        >
          <svg
            className="w-12 h-12 mx-auto mb-4 text-zinc-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>

          <p className="text-zinc-400 mb-1">Drag and drop files here</p>
          <p className="text-indigo-400 text-sm font-medium mb-2">or click to browse</p>
          <p className="text-xs text-zinc-600">PDF, DOCX, TXT, CSV — Max 10MB</p>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.docx,.txt,.csv"
            className="hidden"
            onChange={(e) => {
              if (e.target.files.length) handleFiles(e.target.files);
              e.target.value = "";
            }}
          />
        </div>

        {/* Upload Progress */}
        {uploading.length > 0 && (
          <div className="mt-6 space-y-3">
            {uploading.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-white truncate">{item.name}</span>
                    <span className="text-xs text-zinc-500 ml-2 shrink-0">
                      {formatFileSize(item.size)}
                    </span>
                  </div>
                  <div className="h-1 rounded-full bg-white/[0.06] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-indigo-500 transition-all duration-200"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                </div>
                <button
                  onClick={() => cancelUpload(item.id)}
                  className="text-zinc-500 hover:text-zinc-300 transition p-1"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Uploaded Documents */}
        <div className="mt-8">
          <div className="flex items-center gap-3 mb-5">
            <h2 className="text-base font-medium text-white">Uploaded Documents</h2>
            <span className="text-xs bg-white/[0.06] text-zinc-400 px-2.5 py-1 rounded-full">
              {files.length}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {files.map((doc) => (
              <div
                key={doc.id}
                className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 group hover:bg-white/[0.04] hover:border-white/[0.1] transition"
              >
                <div className="flex items-start justify-between mb-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold ${
                      typeColors[doc.type] || typeColors.txt
                    }`}
                  >
                    {typeIcons[doc.type] || "FILE"}
                  </div>
                  <button
                    onClick={() => deleteFile(doc.id)}
                    className="text-zinc-500 hover:text-red-400 transition p-1 opacity-0 group-hover:opacity-100"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                </div>
                <p className="text-sm text-white truncate mb-1">{doc.name}</p>
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  <span>{formatFileSize(doc.size)}</span>
                  <span>·</span>
                  <span>{doc.uploadedAt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
