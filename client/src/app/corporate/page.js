"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import useCompanyStore from "../store/UseCompanieStore";
import Link from "next/link";
import { FiCalendar, FiMapPin, FiUsers, FiBriefcase } from "react-icons/fi";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import useAuthStore from "../store/UseauthStore";


  const parseTagArray = (value) => {
    if (!Array.isArray(value)) return [];

    if (
      value.length === 1 &&
      typeof value[0] === "string" &&
      value[0].startsWith("[")
    ) {
      try {
        return JSON.parse(value[0]);
      } catch {
        return value;
      }
    }

    return value;
  };


  const MetaItem = ({icon: Icon, children}) => (
    <span className="flex items-center gap-1.5 min-w-0">
     <Icon className="shrink-0 " />
    <span className="truncate">{children}</span>
    </span>
  )


  const CardSkeleton = () => (
  <div className="bg-white border border-[#dddcdc] rounded-xl p-3 sm:p-4 animate-pulse">
    <div className="flex gap-3 sm:gap-4">
      <div className="w-16 h-16 sm:w-24 sm:h-24 lg:w-[120px] lg:h-[120px] rounded-lg bg-slate-200" />
      <div className="flex-1 space-y-3">
        <div className="h-5 w-2/3 bg-slate-200 rounded" />
        <div className="h-4 w-full bg-slate-100 rounded" />
        <div className="h-4 w-1/2 bg-slate-100 rounded" />
      </div>
    </div>
  </div>
);


const CorporatePage = () => {
  const { companies, fetchAllCompanies, isLoading, error } =
    useCompanyStore();
  const { user } = useAuthStore();  

  useEffect(() => {
    fetchAllCompanies();
  }, [fetchAllCompanies]);



  const otherCompanies = (companies || []).filter(
    (company) => company.createdBy?.toString() !== user?._id?.toString()
  );

if (isLoading) {
  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-4 py-4 space-y-3 sm:space-y-4">
      {[...Array(4)].map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

if (error) {
  return (
    <div className="text-red-500 text-center py-10 px-4 text-sm sm:text-base">
      {error}
    </div>
  );
}

if (otherCompanies.length === 0) {
  return (
    <div className="text-center text-slate-500 py-16 px-4 text-sm sm:text-base">
      No companies found.
    </div>
  );
}

  return (
<div className="max-w-5xl mx-auto px-3 sm:px-4 py-4 pb-24 md:pb-6 space-y-3 sm:space-y-4">
      {otherCompanies.map((company) => {
        const profileHref = `/company/${encodeURIComponent(company.legalName)}`;
        const industries = parseTagArray(company.industryVertical);

        return (
          <div
            key={company._id}
            className="bg-white border border-[#dddcdc] rounded-xl p-3 sm:p-4 transition-shadow hover:shadow-sm"
          >
            <div className="flex gap-3 sm:gap-4">
              {/* Logo */}
              <div className="shrink-0">
                <Image
                  src={company.logo || "/non_company_profile.png"}
                  width={120}
                  height={120}
                  alt={company.name || "Company logo"}
                  className="w-16 h-16 sm:w-24 sm:h-24 lg:w-[120px] lg:h-[120px] rounded-lg object-cover border"
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                {/* Header */}
                <div className="flex items-center gap-x-2 gap-y-0.5 flex-wrap">
                  <Link
                    href={profileHref}
                    className="font-semibold text-base sm:text-lg text-slate-900 break-words"
                  >
                    {company.name}
                  </Link>
                  <RiVerifiedBadgeFill className="text-blue-600 shrink-0" />
                </div>

                {company.slogan && (
                  <p className="text-xs sm:text-sm mt-0.5 line-clamp-2">
                    {company.slogan}
                  </p>
                )}

                {/* Meta (desktop/tablet: beside logo) */}
                <div className="hidden sm:grid grid-cols-2 lg:flex lg:flex-wrap gap-x-5 gap-y-2 mt-3 text-sm">
                  <MetaItem icon={FiBriefcase}>{company.companyType}</MetaItem>
                  <MetaItem icon={FiCalendar}>Founded {company.foundedYear}</MetaItem>
                  <MetaItem icon={FiMapPin}>
                    {company.city}, {company.country}
                  </MetaItem>
                  <MetaItem icon={FiUsers}>{company.companySize}</MetaItem>
                </div>

                {/* Industry (desktop/tablet) */}
                {industries.length > 0 && (
                  <div className="hidden sm:flex items-start mt-4 gap-2">
                    <p className="text-xs font-semibold uppercase pt-1.5 shrink-0">
                      Industry
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {industries.map((industry, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 rounded-full text-xs bg-slate-100 border border-slate-200"
                        >
                          {industry}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action (tablet/desktop) */}
              <div className="hidden md:flex items-start shrink-0">
                <Link
                  href={profileHref}
                  className="px-4 py-2 rounded-sm border border-blue-[#EBF3FC] bg-white text-[#104D8A] font-medium hover:bg-[#EFF6FF] active:bg-[#E0EDFB] whitespace-nowrap"
                >
                  View profile
                </Link>
              </div>
            </div>

            {/* Mobile-only: meta + industry below the logo row (full width) */}
            <div className="sm:hidden mt-3 space-y-3">
              <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs text-slate-600">
                <MetaItem icon={FiBriefcase}>{company.companyType}</MetaItem>
                <MetaItem icon={FiCalendar}>Founded {company.foundedYear}</MetaItem>
                <MetaItem icon={FiMapPin}>
                  {company.city}, {company.country}
                </MetaItem>
                <MetaItem icon={FiUsers}>{company.companySize}</MetaItem>
              </div>

              {industries.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {industries.map((industry, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-full text-[11px] bg-slate-100 border border-slate-200"
                    >
                      {industry}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile-only: full-width, thumb-friendly button */}
            <Link
              href={profileHref}
              className="md:hidden mt-3 flex items-center justify-center min-h-[44px] w-full rounded-sm border border-blue-[#EBF3FC] bg-white text-[#104D8A] font-sm hover:bg-[#EFF6FF] active:bg-[#E0EDFB]"
            >
              View profile
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default CorporatePage;



/*
            <div className="hidden md:flex items-start">
              <Link href={`/company/${company.legalName}`} className="px-4 py-2 rounded-sm border border-blue-[#EBF3FC] bg-white text-[#104D8A] font-medium hover:bg-[#EFF6FF]">
                View profile
              </Link>

    
            </div>

*/