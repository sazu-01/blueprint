
"use client";
import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FiPaperclip, FiX } from "react-icons/fi";
import useAuthStore from '@/app/store/UseauthStore';
import useCompanyStore from '@/app/store/UseCompanieStore';
import useProposalStore from '@/app/store/UseProposalStore';
import { PROPOSAL_TYPES } from '@/app/lib/proposalType';


const normalize = (str) => (str || "").trim().toLowerCase();

const NewProposalForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuthStore();
  const { companies, fetchAllCompanies } = useCompanyStore();
  const { createProposal, isLoading, error } = useProposalStore();

  const [legalName, setLegalName] = useState("");
  const [isLegalNameLocked, setIsLegalNameLocked] = useState(false);
  const [proposalType, setProposalType] = useState("");
  const [bodyText, setBodyText] = useState("");
  const [file, setFile] = useState(null);
  const [formError, setFormError] = useState("");

  useEffect(() => { fetchAllCompanies(); }, [fetchAllCompanies]);

  // Auto-fill + lock when arriving from AllPost "Propose" button
  useEffect(() => {
    const paramLegalName = searchParams.get("legalName");
    if (paramLegalName) {
      setLegalName(paramLegalName);
      setIsLegalNameLocked(true);
    }
  }, [searchParams]);

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
    if (!legalName.trim() || !proposalType) {
      setFormError("Please enter the receiving company's legal name and select a proposal type.");
      return;
    }
    if (!bodyText.trim() && !file) {
      setFormError("Please add a message or attach a document.");
      return;
    }

    // Match legalName against companies list (case-insensitive)
    const matchedCompany = otherCompanies.find(
      (c) => normalize(c.legalName) === normalize(legalName)
    );

    if (!matchedCompany) {
      window.alert("there is no company with this legalName");
      return;
    }

    const formData = new FormData();
    formData.append("fromCompany", myCompany._id);
    formData.append("toCompany", matchedCompany._id);
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
            <label htmlFor="toLegalName" className="text-sm text-slate-400 w-16 shrink-0">To</label>
            <input
              id="toLegalName"
              type="text"
              value={legalName}
              onChange={(e) => !isLegalNameLocked && setLegalName(e.target.value)}
              disabled={isLegalNameLocked}
              placeholder="Enter recipient company's legal name"
              className={`flex-1 text-sm outline-none ${
                isLegalNameLocked
                  ? "bg-slate-50 text-slate-500 cursor-not-allowed"
                  : "text-slate-800 bg-transparent"
              }`}
              required
            />
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
              rows={8}
              placeholder="Write your proposal here..."
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
              className="text-sm text-red-500 hover:text-red-700 cursor-pointer font-medium"
              onClick={()=> {
                const confirmed =window.confirm("Are you sure you want to discard?")
                if(confirmed) router.back();
              }}
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

export default NewProposalForm;