"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { FiBriefcase, FiClock, FiEdit2 } from "react-icons/fi";
import usePostStore from '../store/UsePostStore';
import useAuthStore from '../store/UseauthStore';
import useCompanyStore from '../store/UseCompanieStore';
import Link from 'next/link';


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

const AllPost = () => {
  const { user } = useAuthStore();
  const { companies, fetchAllCompanies } = useCompanyStore();
  const { posts, pagination, isLoading, error, fetchAllPosts } = usePostStore();

  const [showCompose, setShowCompose] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchAllCompanies();
  }, [fetchAllCompanies]);

  useEffect(() => {
    fetchAllPosts({ page });
  }, [page, fetchAllPosts]);

  const myCompany = companies.find(
    (c) => c.createdBy?.toString() === user?._id?.toString()
  );


  return (
    <div className="grid grid-cols-12 gap-4 max-w-7xl mx-auto pb-16 mt-5 ">
        <div className='col-span-12 lg:col-span-7 ml-8'>


        <Link 
          href={`/post`}
          className="w-full flex items-center gap-3 bg-white border border-slate-200 rounded-2xl shadow-sm px-5 py-4 mb-6 hover:border-blue-300 transition-colors text-left"
        >
          <Image
            src={myCompany?.logo || "/non_company_profile.png"}
            width={36}
            height={36}
            alt={myCompany?.name || "Your company"}
            className="rounded-lg object-cover w-9 h-9 border border-slate-100 shrink-0"
          />
          <span className="text-sm text-slate-400">
            Share an update, opportunity, or what you're looking for...
          </span>
        </Link>
 

      {/* Loading */}
      {isLoading && posts.length === 0 && (
        <div className="flex h-[40vh] items-center justify-center">
          <p className="text-slate-500">Loading...</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex h-[40vh] items-center justify-center">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !error && posts.length === 0 && (
        <div className="flex h-[50vh] items-center justify-center">
          <h1 className="text-xl font-semibold text-slate-400">
            No posts yet
          </h1>
        </div>
      )}

      {/* Feed */}
      <div className="space-y-4 ">
        {posts.map((post) => {
          const isMine = post.author?._id?.toString() === user?._id?.toString();

          return (
            <div
              key={post._id}
              className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5"
            >
              {/* Header */}
              <div className="flex items-start gap-3">
                <Image
                  src={post.company?.logo || "/non_company_profile.png"}
                  width={40}
                  height={40}
                  alt={post.company?.name || "Company"}
                  className="rounded-lg object-cover w-10 h-10 border border-slate-100 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {post.company?.name}
                    </p>
                    {isMine && (
                      <FiEdit2 className="text-slate-300 shrink-0" size={12} />
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                    <span className="flex items-center gap-1">
                      <FiClock size={11} />
                      {timeAgo(post.createdAt)}
                    </span>
                    {post.isEdited && <span>· Edited</span>}
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
          );
        })}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="text-sm px-4 py-2 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-sm text-slate-400">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
            disabled={page === pagination.totalPages}
            className="text-sm px-4 py-2 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
      </div>
      
    </div>
  );
};

export default AllPost;