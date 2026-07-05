"use client"
import { useParams } from 'next/navigation';
import Link from 'next/link';
import useCompanyStore from '@/app/store/UseCompanieStore';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { FiCalendar, FiMapPin, FiUsers, FiBriefcase } from "react-icons/fi";
import { MdOutlineArrowOutward } from "react-icons/md";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import useAuthStore from '@/app/store/UseauthStore';
import Logout from '@/app/layout/Logout';

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

const TABS = [
    { id: "overview", label: "Overview" },
    { id: "company-info", label: "Company info" },
];

const CompanyProfilePage = () => {
    const { legalName } = useParams();
    const { companies, fetchAllCompanies, isLoading, error } = useCompanyStore();
    const { user } = useAuthStore();
    const [activeTab, setActiveTab] = useState("overview");
    const sectionRefs = useRef({});

    useEffect(() => {
        fetchAllCompanies();
    }, [fetchAllCompanies]);

    const company = companies.find(
        (c) =>
            c.legalName?.trim().toLowerCase() ===
            decodeURIComponent(legalName || "").trim().toLowerCase()
    );

    useEffect(() => {
        if (!company) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveTab(entry.target.dataset.tabId);
                    }
                });
            },
            {
                rootMargin: "-100px 0px -60% 0px",
                threshold: 0,
            }
        );

        Object.values(sectionRefs.current).forEach((el) => {
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, [company]);

    const handleTabClick = (tabId) => {
        const el = sectionRefs.current[tabId];
        if (!el) return;
        const offset = 70; // sticky header height
        const top = el.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: "smooth" });
        setActiveTab(tabId);
    };

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Something went wrong: {error}</p>;
    if (!company) return <p>Company not found.</p>;

    return (
        <div className="max-w-5xl mx-auto mt-5">
            {/* Profile card */}
            <div className='company-card flex gap-4 p-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow'>
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
                <div className='flex flex-col gap-3 flex-1 min-w-0'>
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
                    <div className='flex flex-row gap-2'>
                        <div className='flex flex-wrap gap-1.5 items-center'>
                            <p className="text-xs font-semibold text-slate-500 uppercase mr-1">Industry</p>
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
                        <div className='flex flex-wrap gap-1.5 items-center'>
                            <p className="text-xs font-semibold text-slate-500 uppercase mr-1">Looking for</p>
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

            {/* Left tabs + right content */}
            <div className="flex gap-8 mt-6">

                {/* Left sidebar tabs */}
                <div className="w-44 shrink-0">
                    <div className="sticky top-20 flex flex-col gap-1">
                        {TABS.map((tab) => (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => handleTabClick(tab.id)}
                                className={`relative text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === tab.id
                                    ? "bg-blue-50 text-blue-600"
                                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                                    }`}
                            >
                                {activeTab === tab.id && (
                                    <span className="absolute left-0 top-1 bottom-1 w-0.5 bg-blue-600 rounded-full" />
                                )}
                                {tab.label}
                            </button>
                        ))}

                        <Link
                            className="relative inline-flex items-center gap-1 text-slate-500"
                            href="/company/update"
                        >
                            <p className="text-left pl-3 py-2 rounded-md text-sm font-medium  underline">
                                Edit Company
                            </p>

                            <MdOutlineArrowOutward className='top-2 absolute left-25' />
                        </Link>
                        {user?._id?.toString() === company?.createdBy?.toString() && <Logout />}
                    </div>


                </div>

                {/* Right content sections */}
                <div className="flex-1 min-w-0 space-y-10 pb-10">
                    <section id="overview"
                        data-tab-id="overview"
                        ref={(el) => (sectionRefs.current.overview = el)}
                        className="space-y-2"
                    >
                        <h3 className="text-base font-semibold text-slate-900">Overview</h3>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            {company.description || "No description provided yet."}
                        </p>
                    </section>



                    <section
                        id="company-info"
                        data-tab-id="company-info"
                        ref={(el) => (sectionRefs.current["company-info"] = el)}
                        className="space-y-6"
                    >
                        <h3 className="text-base font-semibold text-slate-900">Company Info</h3>

                        <div className="grid grid-cols-2 gap-y-5 gap-x-4 text-sm">
                            <div>
                                <p className="text-xs text-slate-400 uppercase tracking-wide">
                                    Legal Name
                                </p>
                                <p className="text-slate-700 font-medium">
                                    {company.legalName || "—"}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-slate-400 uppercase tracking-wide">
                                    Country
                                </p>
                                <p className="text-slate-700 font-medium">
                                    {company.country || "—"}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-slate-400 uppercase tracking-wide">
                                    Address
                                </p>
                                <p className="text-slate-700 font-medium">
                                    {company.address || "—"}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-slate-400 uppercase tracking-wide">
                                    Company Type
                                </p>
                                <p className="text-slate-700 font-medium">
                                    {company.companyType || "—"}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-slate-400 uppercase tracking-wide">
                                    Company Size
                                </p>
                                <p className="text-slate-700 font-medium">
                                    {company.companySize || "—"}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-slate-400 uppercase tracking-wide">
                                    Founded Year
                                </p>
                                <p className="text-slate-700 font-medium">
                                    {company.foundedYear || "—"}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-slate-400 uppercase tracking-wide">
                                    Funding Stage
                                </p>
                                <p className="text-slate-700 font-medium">
                                    {company.fundingStaged || "—"}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-slate-400 uppercase tracking-wide">
                                    Official Domain
                                </p>
                                <p className="text-slate-700 font-medium">
                                    {company.officialDomain || "—"}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-slate-400 uppercase tracking-wide">
                                    Web Link
                                </p>

                                {company.webLink ? (
                                    <a
                                        href={company.webLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 font-medium hover:underline break-all"
                                    >
                                        {company.webLink}
                                    </a>
                                ) : (
                                    <p className="text-slate-700 font-medium">—</p>
                                )}
                            </div>

                            <div>
                                <p className="text-xs text-slate-400 uppercase tracking-wide">
                                    Verification Status
                                </p>
                                <p className="text-slate-700 font-medium">
                                    {company.verificationStatus || "—"}
                                </p>
                            </div>
                        </div>

                        {/* Array fields */}
                        <div className="space-y-4 pt-2">
                            {parseTagArray(company.industryVertical).length > 0 && (
                                <div>
                                    <p className="text-xs text-slate-400 uppercase tracking-wide mb-1.5">
                                        Industry Vertical
                                    </p>

                                    <div className="flex flex-wrap gap-1.5">
                                        {parseTagArray(company.industryVertical).map((tag, i) => (
                                            <span
                                                key={i}
                                                className="px-2.5 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-700 border border-slate-200"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {parseTagArray(company.businessActivity).length > 0 && (
                                <div>
                                    <p className="text-xs text-slate-400 uppercase tracking-wide mb-1.5">
                                        Business Activity
                                    </p>

                                    <div className="flex flex-wrap gap-1.5">
                                        {parseTagArray(company.businessActivity).map((tag, i) => (
                                            <span
                                                key={i}
                                                className="px-2.5 py-1 text-xs font-medium rounded-full bg-blue-50 text-blue-700 border border-blue-100"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {parseTagArray(company.interestedIndustries).length > 0 && (
                                <div>
                                    <p className="text-xs text-slate-400 uppercase tracking-wide mb-1.5">
                                        Interested Industries
                                    </p>

                                    <div className="flex flex-wrap gap-1.5">
                                        {parseTagArray(company.interestedIndustries).map((tag, i) => (
                                            <span
                                                key={i}
                                                className="px-2.5 py-1 text-xs font-medium rounded-full bg-green-50 text-green-700 border border-green-100"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>

                </div>

            </div>
        </div>
    );
};

export default CompanyProfilePage;