
"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiPaperclip, FiX } from "react-icons/fi";
import useAuthStore from '@/app/store/UseauthStore';
import useCompanyStore from '@/app/store/UseCompanieStore';
import useProposalStore from '@/app/store/UseProposalStore';

const PROPOSAL_TYPES = [
  "Acquisition", "Collaboration", "Distribution", "Investment",
  "Joint Venture", "Networking", "Partnership", "Project", "Vendor search",
];

const NewProposalPage = () => {
  const router = useRouter();
  const { user } = useAuthStore();
  const { companies, fetchAllCompanies } = useCompanyStore();
  const { createProposal, isLoading, error } = useProposalStore();

  const [toCompany, setToCompany] = useState("");
  const [proposalType, setProposalType] = useState("");
  const [bodyText, setBodyText] = useState("");
  const [file, setFile] = useState(null);
  const [formError, setFormError] = useState("");

  useEffect(() => { fetchAllCompanies(); }, [fetchAllCompanies]);

  const myCompany = companies.find(
    (c) => c.createdBy?.toString() === user?._id?.toString()
  );
  const otherCompanies = companies.filter(
    (c) => c._id?.toString() !== myCompany?._id?.toString()
  );

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected) setFile(selected);
  };

  const handleRemoveFile = () => setFile(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!myCompany?._id) {
      setFormError("You need a registered company before sending proposals.");
      return;
    }
    if (!toCompany || !proposalType) {
      setFormError("Please select a receiving company and proposal type.");
      return;
    }
    if (!bodyText.trim() && !file) {
      setFormError("Please add a message or attach a document.");
      return;
    }

    const formData = new FormData();
    formData.append("fromCompany", myCompany._id);
    formData.append("toCompany", toCompany);
    formData.append("proposalType", proposalType);
    if (bodyText.trim()) formData.append("text", bodyText.trim());
    if (file) formData.append("file", file);

    try {
      await createProposal(formData);
      router.push("/proposal");
    } catch {
      // error captured in store
    }
  };

  return (
    <div className="min-h-[80vh] flex items-start justify-center pt-10 px-4">
      <div className="w-full max-w-xl bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between bg-slate-800 px-5 py-3">
          <h1 className="text-white text-sm font-medium">New Proposal</h1>
          <button
            type="button"
            onClick={() => router.back()}
            className="text-slate-300 hover:text-white text-sm"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="divide-y divide-slate-100">

          {/* From */}
          <div className="flex items-center gap-3 px-5 py-3">
            <span className="text-sm text-slate-400 w-16 shrink-0">From</span>
            <span className="text-sm text-slate-700 truncate">
              {myCompany?.name || "No company found"}
            </span>
          </div>

          {/* To */}
          <div className="flex items-center gap-3 px-5 py-3">
            <label htmlFor="toCompany" className="text-sm text-slate-400 w-16 shrink-0">To</label>
            <select
              id="toCompany"
              value={toCompany}
              onChange={(e) => setToCompany(e.target.value)}
              className="flex-1 text-sm text-slate-800 bg-transparent outline-none cursor-pointer"
              required
            >
              <option value="" disabled>Select a company</option>
              {otherCompanies.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Type */}
          <div className="flex items-center gap-3 px-5 py-3">
            <label htmlFor="proposalType" className="text-sm text-slate-400 w-16 shrink-0">Type</label>
            <select
              id="proposalType"
              value={proposalType}
              onChange={(e) => setProposalType(e.target.value)}
              className="flex-1 text-sm text-slate-800 bg-transparent outline-none cursor-pointer"
              required
            >
              <option value="" disabled>Select proposal type</option>
              {PROPOSAL_TYPES.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Body text */}
          <div className="px-5 py-4">
            <textarea
              value={bodyText}
              onChange={(e) => setBodyText(e.target.value)}
              rows={5}
              placeholder="Write your proposal message here..."
              className="w-full text-sm text-slate-800 border border-slate-200 rounded-xl p-3 outline-none focus:border-blue-300 resize-none"
            />
          </div>

          {/* File attachment */}
          <div className="px-5 py-3">
            {file ? (
              <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg w-fit">
                <FiPaperclip className="text-slate-400 shrink-0" size={14} />
                <span className="text-xs text-slate-600 truncate max-w-[200px]">{file.name}</span>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="text-slate-400 hover:text-slate-600 shrink-0"
                >
                  <FiX size={14} />
                </button>
              </div>
            ) : (
              <label className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 cursor-pointer w-fit">
                <FiPaperclip size={16} />
                Attach document
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            )}
            <p className="text-xs text-slate-400 mt-1">
              PDF, Word, Excel, PowerPoint — up to 5MB
            </p>
          </div>

          {(formError || error) && (
            <div className="px-5 py-2">
              <p className="text-sm text-red-600">{formError || error}</p>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between px-5 py-3 bg-slate-50">
            <button
              type="button"
              onClick={() => router.back()}
              className="text-sm text-slate-500 hover:text-slate-700"
            >
              Discard
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Sending..." : "Send proposal"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewProposalPage;





