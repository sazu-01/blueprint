"use client";
import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import useProposalStore from '../store/UseProposalStore';
import useAuthStore from '../store/UseauthStore';
import useCompanyStore from '../store/UseCompanieStore';

const statusStyles = {
  draft: "bg-slate-100 text-slate-600",
  sent: "bg-blue-50 text-blue-700",
  reviewing: "bg-amber-50 text-amber-700",
  negotiate: "bg-purple-50 text-purple-700",
  accepted: "bg-green-50 text-green-700",
  rejected: "bg-red-50 text-red-700",
};

const ProposalPage = () => {
  const { user } = useAuthStore();
  const { companies, fetchAllCompanies } = useCompanyStore();
  const { proposals, isLoading, error, fetchCompanyProposals } = useProposalStore();

  useEffect(() => {
    fetchAllCompanies();
  }, [fetchAllCompanies]);

  const myCompany = companies.find(
    (c) => c.createdBy?.toString() === user?._id?.toString()
  );

  
  
  useEffect(() => {
    if (myCompany?._id) {
      fetchCompanyProposals(myCompany._id);
    }
  }, [myCompany?._id, fetchCompanyProposals]);

  if (isLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <p className="text-slate-500">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

 
  if(user === null){
    return <div>
      <Link href="/login" className="cursor-pointer font-bold inline-flex items-center justify-center px-4 py-2 text-base leading-6 text-white whitespace-no-wrap bg-blue-600 border border-blue-700 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" data-rounded="rounded-md" data-primary="blue-600" data-primary-reset="{}">
         Login
        </Link>
        <span></span>
    </div>
  }

  if(myCompany === undefined) {
    return <div className="flex h-[80vh] items-center justify-center">
      <Link href="/register/company" className="cursor-pointer font-bold inline-flex items-center justify-center px-4 py-2 text-base leading-6 text-white whitespace-no-wrap bg-blue-600 border border-blue-700 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" data-rounded="rounded-md" data-primary="blue-600" data-primary-reset="{}">
         + Create Company
        </Link>
    </div>
  }

    if (!proposals || proposals.length === 0) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Link href="/proposal/new" className="cursor-pointer font-bold inline-flex items-center justify-center px-4 py-2 text-base leading-6 text-white whitespace-no-wrap bg-blue-600 border border-blue-700 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" data-rounded="rounded-md" data-primary="blue-600" data-primary-reset="{}">
          + Create A Proposal
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl bg-white overflow-hidden">
        {proposals.map((proposal) => {
          const isSender = proposal.fromCompany?._id?.toString() === myCompany?._id?.toString();
          const counterparty = isSender ? proposal.toCompany : proposal.fromCompany;

          return (
            <Link
              key={proposal._id}
              href={`/proposal/${proposal._id}`}
              className="flex items-center gap-4 px-5 py-5 hover:bg-slate-50 transition-colors"
            >
              <div className="shrink-0">
                <Image
                  src={counterparty?.logo || "/non_company_profile.png"}
                  width={44}
                  height={44}
                  alt={counterparty?.name || "Company"}
                  className="rounded-lg object-cover w-11 h-11 border border-slate-100"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-slate-900 truncate">
                    {counterparty?.name || "Unknown company"}
                  </p>
                  <span className="text-xs text-slate-400 shrink-0">
                    {isSender ? "→ Sent" : "← Received"}
                  </span>
                </div>
                <p className="text-sm text-slate-500 truncate">
                  {proposal.proposalType} · {proposal.proposalId}
                </p>
              </div>

              <div className="flex flex-col items-end gap-1.5 shrink-0">
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusStyles[proposal.status] || "bg-slate-100 text-slate-600"
                    }`}
                >
                  {proposal.status}
                </span>
                <span className="text-xs text-slate-400">
                  {new Date(proposal.createdAt).toLocaleDateString()}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default ProposalPage;