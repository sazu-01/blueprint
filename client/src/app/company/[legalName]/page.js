"use client"
import { useParams } from 'next/navigation';
import Link from 'next/link';
import useCompanyStore from '@/app/store/UseCompanieStore';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { FiCalendar, FiMapPin, FiUsers, FiBriefcase } from "react-icons/fi";
import { FaLocationArrow } from "react-icons/fa";
import { MdOutlineArrowOutward } from "react-icons/md";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import useAuthStore from '@/app/store/UseauthStore';
import Logout from '@/app/layout/Logout';
import PostsByCompany from '@/app/layout/PostsByCompany';

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
    { id: "opportunity", label: "Opppotunity"}
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

        const isMobile = window.innerWidth < 768;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveTab(entry.target.dataset.tabId);
                    }
                });
            },
            {
                rootMargin: isMobile ? "-130px 0px -60% 0px" : "-100px 0px -60% 0px",
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
        // mobile has the sticky tab bar under the top nav, so it needs a bigger offset
        const offset = window.innerWidth < 768 ? 120 : 70;
        const top = el.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: "smooth" });
        setActiveTab(tabId);
    };

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Something went wrong: {error}</p>;
    if (!company) return <p>Company not found.</p>;

    const isOwner =
        !!user?._id && user._id.toString() === company?.createdBy?.toString();

    return (
        <div className={`max-w-5xl mx-auto mt-3 md:mt-5 px-3 md:px-0 ${isOwner ? "pb-8" : "pb-24"} md:pb-0`}>
            {/* Profile card */}
            <div className='company-card flex flex-wrap gap-3 p-3 md:flex-nowrap md:gap-4 md:p-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow'>
                <div className='shrink-0'>
                    {company?.logo ? (
                        <Image
                            src={company.logo}
                            width={130}
                            height={130}
                            loading="eager"
                            alt={`${company.legalName || 'Company'} logo`}
                            className='rounded-lg object-cover w-[72px] h-[72px] sm:w-24 sm:h-24 md:w-[130px] md:h-[130px] border border-slate-100'
                        />
                    ) : (
                        <Image
                            src='/non_company_profile.png'
                            loading="eager"
                            width={130}
                            height={130}
                            alt='Default company logo'
                            className='rounded-lg object-cover w-[72px] h-[72px] sm:w-24 sm:h-24 md:w-[130px] md:h-[130px] border border-slate-100'
                        />
                    )}
                </div>

                {/* On mobile this wrapper disappears (contents) so its children flow inside the card */}
                <div className='contents md:flex md:flex-col md:gap-3 md:flex-1 md:min-w-0'>
                    {/* Name + badge + slogan */}
                    <div className='flex items-center gap-x-2 gap-y-1 flex-wrap flex-1 min-w-0 md:flex-none'>
                        <h2 className='order-1 md:order-none text-base md:text-lg font-semibold text-slate-900 break-words'>{company.name}</h2>
                        <span className='hidden md:inline text-slate-400'>—</span>
                        <span className='order-3 md:order-none w-full md:w-auto text-xs md:text-sm text-slate-500'>{company.slogan}</span>
                        <RiVerifiedBadgeFill className='order-2 md:order-none text-blue-600 text-base shrink-0' />
                    </div>

                    {/* Meta: 2-column grid on mobile, original row on desktop */}
                    <div className='w-full md:w-auto grid grid-cols-2 gap-x-3 gap-y-2 md:flex md:items-center md:gap-x-5 md:gap-y-2 md:flex-wrap md:mt-4 text-xs md:text-sm text-slate-600'>
                        <span className='flex items-center gap-1.5 min-w-0'>
                            <FiBriefcase className='text-slate-400 shrink-0' />
                            {company.companyType}
                        </span>
                        <span className='hidden md:block w-px h-4 bg-slate-200' />
                        <span className='flex items-center gap-1.5 min-w-0'>
                            <FiCalendar className='text-slate-400 shrink-0' />
                            Founded {company.foundedYear}
                        </span>
                        <span className='hidden md:block w-px h-4 bg-slate-200' />
                        <span className='flex items-center gap-1.5 min-w-0'>
                            <FiMapPin className='text-slate-400 shrink-0' />
                            {company.city}, {company.country}
                        </span>
                        <span className='hidden md:block w-px h-4 bg-slate-200' />
                        <span className='flex items-center gap-1.5 min-w-0'>
                            <FiUsers className='text-slate-400 shrink-0' />
                            {company.companySize}
                        </span>
                    </div>

                    {/* Industry */}
                    <div className='w-full md:w-auto flex flex-row gap-2'>
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
                    </div>

                    {/* Mobile-only: Edit button for the owner */}
                    {isOwner && (
                        <Link
                            href="/company/update"
                            className="md:hidden w-full flex items-center justify-center gap-1.5 min-h-[44px] rounded-md border border-slate-200 bg-white text-sm font-medium text-slate-700 active:bg-slate-50"
                        >
                            Edit company
                            <MdOutlineArrowOutward />
                        </Link>
                    )}
                </div>
            </div>

            {/* Tabs + content (mobile: tabs on top, desktop: left sidebar) */}
            <div className="flex flex-col md:flex-row gap-3 md:gap-8 mt-3 md:mt-6">

                {/* Tabs wrapper: sticky bar on mobile, sidebar column on desktop */}
                <div className="sticky top-16 z-20 md:static md:z-auto md:w-44 md:shrink-0">
                    <div className="md:sticky bg-[#ffffff] md:top-20 flex flex-row md:flex-col gap-1 p-1 md:px-0 md:py-3 overflow-x-auto md:overflow-visible rounded-xl border border-slate-200 shadow-sm md:shadow-none">
                        {TABS.map((tab) => (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => handleTabClick(tab.id)}
                                className={`relative flex-1 md:flex-none shrink-0 whitespace-nowrap min-h-[40px] md:min-h-0 text-center md:text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === tab.id
                                    ? "bg-blue-50 text-blue-600"
                                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                                    }`}
                            >
                                {activeTab === tab.id && (
                                    <span className="absolute bg-blue-600 rounded-full left-2 right-2 bottom-0 h-0.5 md:left-0 md:right-auto md:top-1 md:bottom-1 md:w-0.5 md:h-auto" />
                                )}
                                {tab.label}
                            </button>
                        ))}

                        {/* Desktop only: Edit + Logout stay in the sidebar */}
                        {isOwner && (
                            <Link
                                className="relative hidden md:inline-flex items-center gap-1 text-slate-500"
                                href="/company/update"
                            >
                                <p className="text-left pl-3 py-2 rounded-md text-sm font-medium  underline">
                                    Edit Company
                                </p>

                                <MdOutlineArrowOutward className='top-2 absolute left-25' />
                            </Link>
                        )}

                        {isOwner && (
                            <div className="hidden md:contents">
                                <Logout />
                            </div>
                        )}
                    </div>
                </div>

                {/* Right content sections */}
                <div className="flex-1 bg-[#ffffff] min-w-0 space-y-8 md:space-y-10 p-4 md:p-5 rounded-xl border border-slate-200" >
                    <section id="overview"
                        data-tab-id="overview"
                        ref={(el) => (sectionRefs.current.overview = el)}
                        className="space-y-2"
                    >
                        <h3 className="text-base font-semibold text-slate-900">Overview</h3>
                        <p className="text-sm text-slate-600 leading-relaxed break-words">
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

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-4 text-sm break-words">
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
                                    <Link
                                        href={company.webLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 font-medium hover:underline break-all"
                                    >
                                        {company.webLink}
                                    </Link>
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

                <section id="opportunity"
                        data-tab-id="opportunity"
                        ref={(el) => (sectionRefs.current.opportunity = el)}
                        className="space-y-2"
                    >
                        <h3 className="text-base font-semibold text-slate-900">Oportunities</h3>
                         <PostsByCompany company={company} />
                    </section>

                </div>

            </div>

            {/* Mobile-only: Logout at the bottom for the owner */}
            {isOwner && (
                <div className="md:hidden mt-4">
                    <Logout />
                </div>
            )}

            {/* Mobile-only: sticky Send proposal bar for visitors */}
            {!isOwner && (
                <div className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-white border-t border-slate-200 p-3">
                    <Link
                        href={`/proposal/new?legalName=${encodeURIComponent(company.legalName || "")}`}
                        className="w-full flex items-center justify-center gap-2 min-h-[44px] text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-sm shadow-sm transition-colors"
                    >
                        <FaLocationArrow size={14} />
                        <span>Send proposal</span>
                    </Link>
                </div>
            )}
        </div>
    );
};

export default CompanyProfilePage;