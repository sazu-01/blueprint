
"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/app/store/UseauthStore';
import useCompanyStore from '@/app/store/UseCompanieStore';
import useProposalStore from '@/app/store/UseProposalStore';

const PROPOSAL_TYPES = [
  "Acquisition",
  "Collaboration",
  "Distribution",
  "Investment",
  "Joint Venture",
  "Networking",
  "Partnership",
  "Project",
  "Vendor search",
];

const NewProposalPage = () => {
  const router = useRouter();
  const { user } = useAuthStore();
  const { companies, fetchAllCompanies } = useCompanyStore();
  const { createProposal, isLoading, error } = useProposalStore();

  const [toCompany, setToCompany] = useState("");
  const [proposalType, setProposalType] = useState("");
  const [file, setFile] = useState(null);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    fetchAllCompanies();
  }, [fetchAllCompanies]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!myCompany?._id) {
      setFormError("You need a registered company before sending proposals.");
      return;
    }
    if (!toCompany || !proposalType || !file) {
      setFormError("Please fill in all fields and attach a document.");
      return;
    }

    const formData = new FormData();
    formData.append("fromCompany", myCompany._id);
    formData.append("toCompany", toCompany);
    formData.append("proposalType", proposalType);
    formData.append("file", file);

    try {
      await createProposal(formData);
      router.push("/proposal");
    } catch {
      // error already captured in store's `error` state
    }
  };

  return (
    <div className="min-h-[80vh] flex items-start justify-center pt-10 px-4">
      <div className="w-full max-w-xl bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

        {/* Header bar — Gmail-style */}
        <div className="flex items-center justify-between bg-slate-800 px-5 py-3">
          <h1 className="text-white text-sm font-medium">New Proposal</h1>
          <button
            type="button"
            onClick={() => router.back()}
            className="text-slate-300 hover:text-white text-sm"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="divide-y divide-slate-100">

          {/* From — read-only, derived from logged-in user's company */}
          <div className="flex items-center gap-3 px-5 py-3">
            <span className="text-sm text-slate-400 w-16 shrink-0">From</span>
            <span className="text-sm text-slate-700 truncate">
              {myCompany?.name || "No company found"}
            </span>
          </div>

          {/* To — select receiving company */}
          <div className="flex items-center gap-3 px-5 py-3">
            <label htmlFor="toCompany" className="text-sm text-slate-400 w-16 shrink-0">
              To
            </label>
            <select
              id="toCompany"
              value={toCompany}
              onChange={(e) => setToCompany(e.target.value)}
              className="flex-1 text-sm text-slate-800 bg-transparent outline-none cursor-pointer"
              required
            >
              <option value="" disabled>Select a company</option>
              {otherCompanies.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Proposal type */}
          <div className="flex items-center gap-3 px-5 py-3">
            <label htmlFor="proposalType" className="text-sm text-slate-400 w-16 shrink-0">
              Type
            </label>
            <select
              id="proposalType"
              value={proposalType}
              onChange={(e) => setProposalType(e.target.value)}
              className="flex-1 text-sm text-slate-800 bg-transparent outline-none cursor-pointer"
              required
            >
              <option value="" disabled>Select proposal type</option>
              {PROPOSAL_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Body / attachment area */}
          <div className="px-5 py-5 min-h-[160px]">
            <label
              htmlFor="proposalFile"
              className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-slate-200 rounded-xl py-8 cursor-pointer hover:border-blue-300 hover:bg-blue-50/30 transition-colors"
            >
              <span className="text-sm text-slate-500">
                {file ? file.name : "Click to attach proposal document"}
              </span>
              <span className="text-xs text-slate-400">PDF or DOCX, up to 5MB</span>
              <input
                id="proposalFile"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          {(formError || error) && (
            <div className="px-5 py-2">
              <p className="text-sm text-red-600">{formError || error}</p>
            </div>
          )}

          {/* Footer — Gmail send-bar style */}
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
              className="cursor-pointer font-semibold inline-flex items-center justify-center px-5 py-2 text-sm text-white bg-blue-600 border border-blue-700 rounded-full shadow-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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