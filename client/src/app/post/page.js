"use client";
import React, { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { FiX, FiChevronDown, FiCheck, FiAlertCircle, FiSearch } from "react-icons/fi";
import usePostStore from '../store/UsePostStore';
import useAuthStore from '../store/UseauthStore';
import useCompanyStore from '../store/UseCompanieStore';
import { POST_TYPES, industries } from '../lib/proposalType';

const MAX_LENGTH = 3000;
const COUNTER_THRESHOLD = MAX_LENGTH * 0.85;

const PostPage = ({ onSuccess, onCancel }) => {
  const { user } = useAuthStore();
  const { companies, fetchAllCompanies } = useCompanyStore();
  const { createPost, isLoading: storeLoading, error: storeError } = usePostStore();

  const [content, setContent] = useState("");
  const [postType, setPostType] = useState("");
  const [relatedIndustry, setRelatedIndustry] = useState([]);
  const [industryQuery, setIndustryQuery] = useState("");
  const [openMenu, setOpenMenu] = useState(null); // 'type' | 'industry' | null
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const textareaRef = useRef(null);
  const typeMenuRef = useRef(null);
  const industryMenuRef = useRef(null);

  useEffect(() => {
    fetchAllCompanies();
  }, [fetchAllCompanies]);

  // Auto-grow the composer as content is typed
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [content]);

  // Close whichever menu is open on outside click or Escape
  useEffect(() => {
    const handleClick = (e) => {
      if (
        openMenu === 'type' &&
        typeMenuRef.current && !typeMenuRef.current.contains(e.target)
      ) setOpenMenu(null);
      if (
        openMenu === 'industry' &&
        industryMenuRef.current && !industryMenuRef.current.contains(e.target)
      ) setOpenMenu(null);
    };
    const handleKey = (e) => {
      if (e.key === "Escape") setOpenMenu(null);
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [openMenu]);

  const myCompany = companies.find(
    (c) => c.createdBy?.toString() === user?._id?.toString()
  );

  const filteredIndustries = useMemo(() => {
    const q = industryQuery.trim().toLowerCase();
    if (!q) return industries;
    return industries.filter((i) => i.toLowerCase().includes(q));
  }, [industryQuery]);

  const toggleIndustry = (value) => {
    setRelatedIndustry((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const handleRemoveIndustry = (value) => {
    setRelatedIndustry((prev) => prev.filter((v) => v !== value));
  };

  const handleSelectType = (type) => {
    setPostType(type);
    setOpenMenu(null);
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

  const showCounter = content.length >= COUNTER_THRESHOLD;
  const error = formError || storeError;

  return (
    <div className="bg-white border border-[#E4E7EC] rounded-xl shadow-[0_1px_2px_rgba(15,23,41,0.04)] p-6 sm:p-7">
      <form onSubmit={handleSubmit}>

        {/* Identity */}
        <div className="flex items-center gap-3 mb-4">
          <div className="relative shrink-0">
            <Image
              src={myCompany?.logo || "/non_company_profile.png"}
              width={40}
              height={40}
              alt={myCompany?.name || "Your company"}
              className="rounded-lg object-cover w-10 h-10 border border-[#E4E7EC]"
            />
            {myCompany?.isVerified && (
              <span
                className="absolute -bottom-1 -right-1 flex items-center justify-center w-4 h-4 rounded-full bg-[#12805C] ring-2 ring-white"
                title="Verified company"
              >
                <FiCheck size={10} className="text-white" strokeWidth={3} />
              </span>
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-[#0F1729]">
              {myCompany?.name || "No company found"}
            </p>
            <p className="text-xs text-[#5B6472]">Posting publicly</p>
          </div>
        </div>

        {/* Composer */}
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value.slice(0, MAX_LENGTH))}
          rows={3}
          placeholder="What kind of partner or deal are you looking for?"
          className="w-full text-sm text-[#0F1729] placeholder:text-[#9AA3AF] border border-[#dddcdc] rounded-lg p-3 outline-none focus:border-[#1F4B99] focus:ring-0.9 focus:ring-[#155DFC] resize-none transition-colors"
        />
        {showCounter && (
          <div className="flex justify-end mt-1">
            <span className={`text-xs tabular-nums ${content.length >= MAX_LENGTH ? "text-red-600" : "text-[#9AA3AF]"}`}>
              {content.length}/{MAX_LENGTH}
            </span>
          </div>
        )}

        {/* Attributes */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">

          {/* Post type — custom listbox, matches industry control */}
          <div ref={typeMenuRef} className="relative">
            <label className="text-xs font-medium text-[#5B6472] mb-1.5 block">
              Post type
            </label>
            <button
              type="button"
              onClick={() => setOpenMenu(openMenu === 'type' ? null : 'type')}
              aria-haspopup="listbox"
              aria-expanded={openMenu === 'type'}
              className="w-full flex items-center justify-between text-sm border border-[#dddcdc] rounded-lg px-3 py-2 outline-none focus:border-[#1F4B99] bg-white transition-colors"
            >
              <span className={postType ? "text-[#0F1729]" : "text-[#9AA3AF]"}>
                {postType || "Select a type"}
              </span>
              <FiChevronDown
                size={16}
                className={`text-[#9AA3AF] transition-transform ${openMenu === 'type' ? "rotate-180" : ""}`}
              />
            </button>

            {openMenu === 'type' && (
              <div
                role="listbox"
                className="absolute z-10 mt-1 w-full max-h-56 overflow-y-auto bg-white border border-[#E4E7EC] rounded-lg shadow-md py-1"
              >
                {POST_TYPES.map((type) => {
                  const selected = type === postType;
                  return (
                    <button
                      key={type}
                      type="button"
                      role="option"
                      aria-selected={selected}
                      onClick={() => handleSelectType(type)}
                      className={`w-full flex items-center justify-between px-3 py-2 text-sm text-left hover:bg-[#EEF3FC] transition-colors ${
                        selected ? "bg-[#EEF3FC] text-[#1F4B99] font-medium" : "text-[#0F1729]"
                      }`}
                    >
                      {type}
                      {selected && <FiCheck size={14} />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Related industries — searchable multi-select */}
          <div ref={industryMenuRef} className="relative">
            <label className="text-xs font-medium text-[#5B6472] mb-1.5 block">
              Related industries <span className="text-[#9AA3AF]">(optional)</span>
            </label>
            <button
              type="button"
              onClick={() => setOpenMenu(openMenu === 'industry' ? null : 'industry')}
              aria-haspopup="listbox"
              aria-expanded={openMenu === 'industry'}
              className="w-full flex items-center justify-between text-sm border border-[#dddcdc] rounded-lg px-3 py-2 outline-none focus:border-[#1F4B99] bg-white transition-colors"
            >
              <span className={relatedIndustry.length ? "text-[#0F1729]" : "text-[#9AA3AF]"}>
                {relatedIndustry.length ? `${relatedIndustry.length} selected` : "Select industries"}
              </span>
              <FiChevronDown
                size={16}
                className={`text-[#9AA3AF] transition-transform ${openMenu === 'industry' ? "rotate-180" : ""}`}
              />
            </button>

            {openMenu === 'industry' && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-[#E4E7EC] rounded-lg shadow-md">
                <div className="flex items-center gap-2 px-3 py-2 border-b border-[#E4E7EC]">
                  <FiSearch size={14} className="text-[#9AA3AF]" />
                  <input
                    autoFocus
                    value={industryQuery}
                    onChange={(e) => setIndustryQuery(e.target.value)}
                    placeholder="Search industries"
                    className="w-full text-sm outline-none placeholder:text-[#9AA3AF]"
                  />
                </div>
                <div role="listbox" aria-multiselectable="true" className="max-h-48 overflow-y-auto py-1">
                  {filteredIndustries.length === 0 ? (
                    <p className="px-3 py-2 text-sm text-[#9AA3AF]">No matches</p>
                  ) : (
                    filteredIndustries.map((industry) => {
                      const checked = relatedIndustry.includes(industry);
                      return (
                        <button
                          key={industry}
                          type="button"
                          role="option"
                          aria-selected={checked}
                          onClick={() => toggleIndustry(industry)}
                          className={`w-full flex items-center justify-between px-3 py-2 text-sm text-left hover:bg-[#EEF3FC] transition-colors ${
                            checked ? "text-[#1F4B99] font-medium" : "text-[#0F1729]"
                          }`}
                        >
                          {industry}
                          {checked && <FiCheck size={14} />}
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {relatedIndustry.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {relatedIndustry.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 pl-2.5 pr-1.5 py-1 text-xs font-medium rounded-md bg-[#EEF3FC] text-[#1F4B99]"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveIndustry(tag)}
                      className="hover:text-[#0F1729]"
                      aria-label={`Remove ${tag}`}
                    >
                      <FiX size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="flex items-start gap-2 mt-4 px-3 py-2 rounded-lg bg-red-50 border border-red-100">
            <FiAlertCircle size={16} className="text-red-500 mt-0.5 shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 mt-5 pt-4 border-t border-[#E4E7EC]">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="text-sm font-medium text-[#5B6472] hover:bg-slate-50 px-4 py-2 rounded-lg transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={submitting || storeLoading}
            className="text-sm font-medium text-white bg-[#155DFC] hover:bg-[#193C7C] px-4 py-2 rounded-lg shadow-sm disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1F4B99]/40 focus-visible:ring-offset-2"
          >
            {submitting ? "Posting…" : "Post"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostPage;