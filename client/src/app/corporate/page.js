"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import useCompanyStore from "../store/UseCompanieStore";
import Link from "next/link";Link
import { FiCalendar, FiMapPin, FiUsers, FiBriefcase } from "react-icons/fi";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import useAuthStore from "../store/UseauthStore";

const CorporatePage = () => {
  const { companies, fetchAllCompanies, isLoading, error } =
    useCompanyStore();
  const { user } = useAuthStore();  

  useEffect(() => {
    fetchAllCompanies();
  }, [fetchAllCompanies]);

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

    const otherCompanies = companies.filter(
    (company) => company.createdBy?.toString() !== user?._id?.toString()
  );

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center py-10">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-4">
      {otherCompanies?.map((company) => (
        <div
          key={company._id}
          className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md transition-all"
        >
          <div className="flex gap-4">
            {/* Logo */}
            <div className="shrink-0">
              <Image
                src={company.logo || "/non_company_profile.png"}
                width={120}
                height={120}
                alt={company.name}
                className="w-[120px] h-[120px] rounded-lg object-cover border"
              />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">

              {/* Header */}
              <div className="flex items-center gap-2 flex-wrap">
                <Link href={`/company/${company.legalName}`} className="font-semibold text-lg text-slate-900">
                  {company.name}
                </Link>

                <RiVerifiedBadgeFill className="text-blue-600" />

                {company.slogan && (
                  <>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-500 text-sm">
                      {company.slogan}
                    </span>
                  </>
                )}
              </div>

              {/* Meta */}
              <div className="flex flex-wrap gap-x-5 gap-y-2 mt-3 text-sm text-slate-600">
                <span className="flex items-center gap-1">
                  <FiBriefcase />
                  {company.companyType}
                </span>

                <span className="flex items-center gap-1">
                  <FiCalendar />
                  Founded {company.foundedYear}
                </span>

                <span className="flex items-center gap-1">
                  <FiMapPin />
                  {company.city}, {company.country}
                </span>

                <span className="flex items-center gap-1">
                  <FiUsers />
                  {company.companySize}
                </span>
              </div>

              {/* Industry */}
              <div className="flex mt-4">
                <p className="text-xs font-semibold text-slate-500 mb-2 uppercase">
                  Industry
                </p>

                <div className="flex flex-wrap gap-2">
                  {parseTagArray(company.industryVertical).map(
                    (industry, idx) => (
                      <span
                        key={idx}
                        className="flex px-3 py-1 rounded-full text-xs bg-slate-100 border border-slate-200"
                      >
                        {industry}
                      </span>
                    )
                  )}
                </div>
              </div>

              {/* Looking For */}
              <div className="mt-3 flex items-center">
                <div className="text-xs font-semibold text-slate-500 mb-2 uppercase m-0">
                  Looking For
                </div>

                <div className="flex flex-wrap gap-2">
                  {parseTagArray(company.businessActivity).map(
                    (activity, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-full text-xs bg-blue-50 text-blue-700 border border-blue-100"
                      >
                        {activity}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Action */}
            <div className="hidden md:flex items-start">
              <Link href={`/company/${company.legalName}`} className="px-4 py-2 rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium">
                View Profile
              </Link>

    
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CorporatePage;