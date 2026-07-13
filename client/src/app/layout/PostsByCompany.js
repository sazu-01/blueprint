"use client";
import React, { useEffect } from 'react';
import Image from 'next/image';
import { FiBriefcase, FiClock } from "react-icons/fi";
import usePostStore from '../store/UsePostStore';

const postTypeStyles = {
  Partnership: "bg-blue-50 text-blue-700",
  Investment: "bg-green-50 text-green-700",
  Collaboration: "bg-purple-50 text-purple-700",
  Project: "bg-amber-50 text-amber-700",
  "Vendor Search": "bg-orange-50 text-orange-700",
  Procurement: "bg-cyan-50 text-cyan-700",
  Networking: "bg-pink-50 text-pink-700",
  Distribution: "bg-indigo-50 text-indigo-700",
  Acquisition: "bg-rose-50 text-rose-700",
  "Joint Venture": "bg-teal-50 text-teal-700",
};

const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  const intervals = [
    { label: "y", secs: 31536000 },
    { label: "mo", secs: 2592000 },
    { label: "d", secs: 86400 },
    { label: "h", secs: 3600 },
    { label: "m", secs: 60 },
  ];
  for (const i of intervals) {
    const count = Math.floor(seconds / i.secs);
    if (count >= 1) return `${count}${i.label} ago`;
  }
  return "just now";
};

const PostsByCompany = ({ company }) => {
  const { posts, isLoading, error, fetchPostsByCompany, clearPosts } = usePostStore();

  useEffect(() => {
    if (company?._id) {
      fetchPostsByCompany(company._id);
    }
    return () => clearPosts();
  }, [company?._id, fetchPostsByCompany, clearPosts]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <p className="text-slate-500 text-sm">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center py-10">
        <p className="text-red-500 text-sm">{error}</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-2">
        <p className="text-slate-400 text-sm">No opportunities posted yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div
          key={post._id}
          className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <Image
                src={post.company?.logo || "/non_company_profile.png"}
                width={36}
                height={36}
                alt={post.company?.name || "Company"}
                className="rounded-lg object-cover w-9 h-9 border border-slate-100 shrink-0"
              />
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">
                  {post.company?.name}
                </p>
                <span className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                  <FiClock size={11} />
                  {timeAgo(post.createdAt)}
                  {post.isEdited && <span>· Edited</span>}
                </span>
              </div>
            </div>
            <span
              className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${
                postTypeStyles[post.postType] || "bg-slate-100 text-slate-600"
              }`}
            >
              {post.postType}
            </span>
          </div>

          {/* Content */}
          <p className="text-sm text-slate-700 mt-3 whitespace-pre-wrap leading-relaxed">
            {post.content}
          </p>

          {/* Related industries */}
          {post.relatedIndustry?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {post.relatedIndustry.map((tag, i) => (
                <span
                  key={i}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full bg-slate-50 text-slate-600 border border-slate-200"
                >
                  <FiBriefcase size={10} />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PostsByCompany;