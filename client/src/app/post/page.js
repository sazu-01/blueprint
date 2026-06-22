"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { FiX } from "react-icons/fi";
import usePostStore from '../store/UsePostStore';
import useAuthStore from '../store/UseauthStore';
import useCompanyStore from '../store/UseCompanieStore';

const POST_TYPES = [
  "Partnership",
  "Investment",
  "Collaboration",
  "Project",
  "Vendor Search",
  "Procurement",
  "Networking",
  "Distribution",
  "Acquisition",
  "Joint Venture",
];

const MAX_LENGTH = 3000;

const PostPage = ({ onSuccess, onCancel }) => {
  const { user } = useAuthStore();
  const { companies, fetchAllCompanies } = useCompanyStore();
  const { createPost, isLoading: storeLoading, error: storeError } = usePostStore();

  const [content, setContent] = useState("");
  const [postType, setPostType] = useState("");
  const [industryInput, setIndustryInput] = useState("");
  const [relatedIndustry, setRelatedIndustry] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    fetchAllCompanies();
  }, [fetchAllCompanies]);

  const myCompany = companies.find(
    (c) => c.createdBy?.toString() === user?._id?.toString()
  );

  const handleAddIndustry = (e) => {
    if ((e.key === "Enter" || e.key === ",") && industryInput.trim()) {
      e.preventDefault();
      const value = industryInput.trim();
      if (!relatedIndustry.includes(value)) {
        setRelatedIndustry((prev) => [...prev, value]);
      }
      setIndustryInput("");
    }
  };

  const handleRemoveIndustry = (value) => {
    setRelatedIndustry((prev) => prev.filter((v) => v !== value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!myCompany?._id) {
      setFormError("You need a registered company before posting.");
      return;
    }
    if (!content.trim()) {
      setFormError("Post content cannot be empty.");
      return;
    }
    if (!postType) {
      setFormError("Please select a post type.");
      return;
    }

    setSubmitting(true);
    try {
      const post = await createPost({
        company: myCompany._id,
        content: content.trim(),
        postType,
        relatedIndustry,
      });
      setContent("");
      setPostType("");
      setRelatedIndustry([]);
      onSuccess?.(post);
    } catch (err) {
      setFormError(err.message || "Failed to create post");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
      <form onSubmit={handleSubmit}>

        {/* Header: company identity */}
        <div className="flex items-center gap-3 mb-3">
          <Image
            src={myCompany?.logo || "/non_company_profile.png"}
            width={40}
            height={40}
            alt={myCompany?.name || "Your company"}
            className="rounded-lg object-cover w-10 h-10 border border-slate-100"
          />
          <div>
            <p className="text-sm font-medium text-slate-800">
              {myCompany?.name || "No company found"}
            </p>
            <p className="text-xs text-slate-400">Posting publicly</p>
          </div>
        </div>

        {/* Content */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value.slice(0, MAX_LENGTH))}
          rows={4}
          placeholder="Share an update, opportunity, or what you're looking for..."
          className="w-full text-sm text-slate-800 border border-slate-200 rounded-xl p-3 outline-none focus:border-blue-300 resize-none"
        />
        <div className="flex justify-end mt-1">
          <span className="text-xs text-slate-400">
            {content.length}/{MAX_LENGTH}
          </span>
        </div>

        {/* Post type */}
        <div className="mt-3">
          <label htmlFor="postType" className="text-xs font-medium text-slate-500 mb-1.5 block">
            Post type
          </label>
          <select
            id="postType"
            value={postType}
            onChange={(e) => setPostType(e.target.value)}
            className="w-full text-sm text-slate-800 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-blue-300 cursor-pointer"
          >
            <option value="" disabled>Select a type</option>
            {POST_TYPES.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Related industries — type and press Enter or comma to add */}
        <div className="mt-3">
          <label htmlFor="industryInput" className="text-xs font-medium text-slate-500 mb-1.5 block">
            Related industries <span className="text-slate-400">(optional)</span>
          </label>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {relatedIndustry.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full bg-blue-50 text-blue-700 border border-blue-100"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveIndustry(tag)}
                  className="hover:text-blue-900"
                  aria-label={`Remove ${tag}`}
                >
                  <FiX size={12} />
                </button>
              </span>
            ))}
          </div>
          <input
            id="industryInput"
            type="text"
            value={industryInput}
            onChange={(e) => setIndustryInput(e.target.value)}
            onKeyDown={handleAddIndustry}
            placeholder="e.g. Fintech — press Enter to add"
            className="w-full text-sm text-slate-800 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-blue-300"
          />
        </div>

        {(formError || storeError) && (
          <p className="text-sm text-red-600 mt-3">{formError || storeError}</p>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 mt-4">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="text-sm text-slate-500 hover:text-slate-700 px-4 py-2"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={submitting || storeLoading}
            className="cursor-pointer font-semibold text-sm text-white bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-full shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {submitting ? "Posting..." : "Post"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostPage;