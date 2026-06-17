"use client"

import { useParams } from 'next/navigation';
import useCompanyStore from '@/app/store/UseCompanieStore';
import Image from 'next/image';
import { useEffect } from 'react';
import { FiCalendar, FiMapPin, FiUsers, FiBriefcase } from "react-icons/fi";
import { RiVerifiedBadgeFill } from "react-icons/ri";

const parseTagArray = (value) => {
  if (!Array.isArray(value)) return [];
  if (value.length === 1 && typeof value[0] === 'string' && value[0].startsWith('[')) {
    try {
      return JSON.parse(value[0]);
    } catch {
      return value;
    }
  }
  return value;
};

const CompanyProfilePage = () => {
   const { legalName } = useParams();
  const { companies, fetchAllCompanies, isLoading, error } = useCompanyStore();

  useEffect(() => {
    fetchAllCompanies();
  }, [fetchAllCompanies]);

  const company = companies.find(
    (c) =>
      c.legalName?.trim().toLowerCase() ===
      decodeURIComponent(legalName || "").trim().toLowerCase()
  );

    if (isLoading) return <p>Loading...</p>;
if (error) return <p>Something went wrong: {error}</p>;
if (!company) return <p>Company not found.</p>;

    return (
 <div className='company-card flex gap-4 p-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow'>
    {/* Column 1: Image */}
    <div className='shrink-0'>
        {company?.logo ? (
            <Image
                src={company.logo}
                width={130}
                height={130}
                loading="eager"
                alt={`${company.legalName || 'Company'} logo`}
                className='rounded-lg object-cover w-[130px] h-[130px] border border-slate-100'
            />
        ) : (
            <Image
                src='/non_company_profile.png'
                loading="eager"
                width={130}
                height={130}
                alt='Default company logo'
                className='rounded-lg object-cover w-[130px] h-[130px] border border-slate-100'
            />
        )}
    </div>

    {/* Column 2: Content (3 rows) */}
    <div className='flex flex-col gap-3 flex-1 min-w-0'>

        {/* Row 1: Headline */}
        <div className='flex items-center gap-2 flex-wrap'>
            <h2 className='text-lg font-semibold text-slate-900'>{company.name}</h2>
            <span className='text-slate-400'>—</span>
            <span className='text-sm text-slate-500'>{company.slogan}</span>
            <RiVerifiedBadgeFill className='text-blue-600 text-base shrink-0' />
        </div>


                    <div className='flex items-center gap-x-5 gap-y-2 flex-wrap mt-4 text-sm text-slate-600'>
                <span className='flex items-center gap-1.5'>
                    <FiBriefcase className='text-slate-400' />
                    {company.companyType}
                </span>
                <span className='w-px h-4 bg-slate-200' />
                <span className='flex items-center gap-1.5'>
                    <FiCalendar className='text-slate-400' />
                    Founded {company.foundedYear}
                </span>
                <span className='w-px h-4 bg-slate-200' />
                <span className='flex items-center gap-1.5'>
                    <FiMapPin className='text-slate-400' />
                    {company.city}, {company.country}
                </span>
                <span className='w-px h-4 bg-slate-200' />
                <span className='flex items-center gap-1.5'>
                    <FiUsers className='text-slate-400' />
                    {company.companySize}
                </span>
            </div>

        {/* Row 3: Tags */}
        <div className='flex flex-row gap-2'>
            <div className='flex flex-wrap gap-1.5'>
                <p>Industry</p>
                {parseTagArray(company.industryVertical).map((industry, index) => (
                    <button
                        key={index}
                        type="button"
                        className='px-2.5 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 transition-colors'
                    >
                        {industry}
                    </button>
                ))}
            </div>
            <div className='flex flex-wrap gap-1.5'>
             <p>Looking for</p>
                {parseTagArray(company.businessActivity).map((activity, index) => (
                    <button
                        key={index}
                        type="button"
                        className='px-2.5 py-1 text-xs font-medium rounded-full bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-100 transition-colors'
                    >
                        {activity}
                    </button>
                ))}
            </div>
        </div>

    </div>
</div>
    );
};

export default CompanyProfilePage;
