'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, Send, CheckCircle2, Paperclip, Clock, Download, ChevronLeft, ChevronRight } from 'lucide-react';

export default function DocumentUploadPage() {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [documentTitle, setDocumentTitle] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  // Mock history state matching the pink accent styling
  const [history, setHistory] = useState([
    { id: 1, title: 'Medical Report PDF', size: '2.4 MB', date: 'July 01, 2026', status: 'Delivered' },
    { id: 2, title: 'Flight Itinerary Trip', size: '840 KB', date: 'June 28, 2026', status: 'Delivered' },
    { id: 3, title: 'Orbit Access Key Token', size: '12 KB', date: 'June 15, 2026', status: 'Delivered' },
    { id: 4, title: 'Quarterly Financials', size: '4.1 MB', date: 'June 10, 2026', status: 'Delivered' },
    { id: 5, title: 'Lab Results Copy', size: '1.2 MB', date: 'June 02, 2026', status: 'Delivered' },
  ]);

  const fileInputRef = useRef(null);

  // Pagination Math
  const totalPages = Math.ceil(history.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = history.slice(indexOfFirstItem, indexOfLastItem);

  // Handle file selections
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      if (!documentTitle) setDocumentTitle(file.name.split('.')[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (!documentTitle) setDocumentTitle(file.name.split('.')[0]);
    }
  };

  // Simulate document submission
  const handleSendDocument = (e) => {
    e.preventDefault();
    if (!selectedFile || !documentTitle) return;

    setIsUploading(true);

    // Mimic API delay
    setTimeout(() => {
      const newDoc = {
        id: Date.now(),
        title: documentTitle,
        size: selectedFile.size > 1024 * 1024 
          ? `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB` 
          : `${(selectedFile.size / 1024).toFixed(0)} KB`,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
        status: 'Delivered'
      };

      setHistory([newDoc, ...history]);
      setSelectedFile(null);
      setDocumentTitle('');
      setIsUploading(false);
      setCurrentPage(1); // Reset to first page to see the newly added doc
    }, 1500);
  };

  // Simulate downloading a file
  const handleDownload = (doc) => {
    alert(`Starting download for: ${doc.title}`);
  };

  return (
    <div className="w-full overflow-x-hidden grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* LEFT: Upload & Send Form */}
      <div className="lg:col-span-1 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-950">Send Document</h1>
          <p className="text-sm text-gray-500">Securely drop files directly to her orbit.</p>
        </div>

        <form onSubmit={handleSendDocument} className="bg-white p-6 rounded-2xl border border-pink-100 shadow-sm space-y-4">
          {/* Custom File Dropzone */}
          <div 
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current.click()}
            className={`w-full p-8 border-2 border-dashed rounded-xl flex flex-col items-center text-center justify-center cursor-pointer transition-all ${
              dragActive 
                ? 'border-[#FF2E63] bg-[#FFF0F2]' 
                : 'border-pink-200 bg-[#FFF9FA] hover:bg-[#FFF0F2]/50'
            }`}
          >
            <input 
              ref={fileInputRef}
              type="file" 
              className="hidden" 
              onChange={handleFileChange}
            />
            <UploadCloud size={36} className="text-[#FF2E63] mb-2" />
            {selectedFile ? (
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-800 break-all px-2">
                <Paperclip size={16} className="shrink-0 text-gray-400" />
                {selectedFile.name}
              </div>
            ) : (
              <div>
                <p className="text-sm font-semibold text-gray-800">Click or drag file here</p>
                <p className="text-xs text-gray-400 mt-1">PDF, Word, Images up to 10MB</p>
              </div>
            )}
          </div>

          {/* Document Title input */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
              Document Title
            </label>
            <input 
              type="text"
              placeholder="e.g., Vacation Tickets"
              value={documentTitle}
              onChange={(e) => setDocumentTitle(e.target.value)}
              disabled={!selectedFile}
              className="w-full px-4 py-2.5 rounded-xl border border-pink-100 focus:outline-none focus:ring-2 focus:ring-[#FF2E63]/20 focus:border-[#FF2E63] text-sm transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={!selectedFile || !documentTitle || isUploading}
            className="w-full flex items-center justify-center gap-2 py-3 bg-[#FF2E63] hover:bg-[#e02454] disabled:bg-gray-200 text-white font-semibold text-sm rounded-xl transition-all shadow-sm"
          >
            {isUploading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <>
                <Send size={16} />
                Send
              </>
            )}
          </button>
        </form>
      </div>

      {/* RIGHT: Transmission History Log */}
      <div className="lg:col-span-2 space-y-6 flex flex-col justify-between">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-950 flex items-center gap-2">
              <Clock size={22} className="text-gray-400" />
              Document Log History
            </h2>
            <p className="text-sm text-gray-500">Review status logs for previously routed files.</p>
          </div>

          <div className="bg-white border border-pink-100 rounded-2xl shadow-sm overflow-hidden flex flex-col justify-between min-h-[290px]">
            <div className="divide-y divide-pink-50">
              {currentItems.length === 0 ? (
                <div className="p-8 text-center text-gray-400 text-sm">
                  No documents uploaded yet.
                </div>
              ) : (
                currentItems.map((doc) => (
                  <div key={doc.id} className="p-4 flex items-center justify-between hover:bg-[#FFF9FA]/50 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-3 bg-[#FFF0F2] text-[#FF2E63] rounded-xl shrink-0">
                        <FileText size={20} />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-semibold text-gray-900 text-sm truncate">{doc.title}</h4>
                        <p className="text-xs text-gray-400 mt-0.5">{doc.size} • Sent on {doc.date}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-semibold">
                        <CheckCircle2 size={12} />
                        {doc.status}
                      </div>
                      
                      {/* Action Button: Download */}
                      <button 
                        onClick={() => handleDownload(doc)}
                        className="p-2 text-gray-400 hover:text-[#FF2E63] hover:bg-[#FFF0F2] rounded-xl transition-all"
                        title="Download Document"
                      >
                        <Download size={18} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination Controls Footer */}
            {totalPages > 1 && (
              <div className="p-4 bg-gray-50/50 border-t border-pink-50 flex items-center justify-between text-sm">
                <span className="text-xs text-gray-500 font-medium">
                  Showing <span className="text-gray-800">{indexOfFirstItem + 1}</span> to{' '}
                  <span className="text-gray-800">{Math.min(indexOfLastItem, history.length)}</span> of{' '}
                  <span className="text-gray-800">{history.length}</span> entries
                </span>
                
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-1.5 border border-pink-100 rounded-lg bg-white text-gray-600 hover:bg-[#FFF0F2] hover:text-[#FF2E63] disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-gray-600 transition-all"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                        currentPage === page
                          ? 'bg-[#FF2E63] text-white shadow-sm'
                          : 'border border-pink-100 bg-white text-gray-600 hover:bg-[#FFF0F2] hover:text-[#FF2E63]'
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-1.5 border border-pink-100 rounded-lg bg-white text-gray-600 hover:bg-[#FFF0F2] hover:text-[#FF2E63] disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-gray-600 transition-all"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
    
  );
}