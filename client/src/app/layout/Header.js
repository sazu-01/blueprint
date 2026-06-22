
"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { GoHomeFill } from "react-icons/go";
import { FaBuilding, FaBars, FaTimes   } from "react-icons/fa";
import { IoDocumentTextSharp } from "react-icons/io5";
import { IoMdNotifications, IoIosLogOut } from "react-icons/io";
import useAuthStore from '../store/UseauthStore';
import useCompanyStore from '../store/UseCompanieStore';

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();
  const { companies, fetchAllCompanies } = useCompanyStore();

  useEffect(() => {
    fetchAllCompanies();
  }, [fetchAllCompanies])

  const UserCompany = companies.filter(
    (company) => company.createdBy?.toString() === user?._id?.toString()
  );

  console.log(UserCompany)

  const navLinks = [
    { href: "/", label: "Home", icon: <GoHomeFill size={22} /> },
    { href: "/corporate", label: "Corporate", icon: <FaBuilding size={20} /> },
    { href: "/proposal", label: "Proposal", icon: <IoDocumentTextSharp size={20} /> },
    { href: "/notifications", label: "Notifications", icon: <IoMdNotifications size={22} />, badge: true },
  ];

  const handleLogout = async () => {
    try {
      const res = await fetch(`${apiBaseUrl}/auth/logout/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || "Logout failed. Please try again.");
      }
      logout(); // clear Zustand + localStorage state
    } catch (error) {
      console.log(error);
    }
  };

  return (

    <header className="sticky top-0 z-50 w-full border-b border-gray-300 bg-white py-2">
  <div className="mx-auto grid h-14 max-w-7xl grid-cols-12 items-center gap-4 px-4 sm:px-6 lg:px-8">

    {/* Logo — 2 cols on desktop, 6 on mobile (paired with hamburger) */}
    <div className="col-span-6 flex items-center gap-2 md:col-span-2">
      <Link href="/" className="shrink-0">
        <div className="relative h-9 w-9 overflow-hidden rounded-md">
          <Image src="/logo.png" alt="Blueprint" className="object-cover" width={100} height={100} />
        </div>
      </Link>
      <h1 className="font-bold">BLUEPRINT</h1>
    </div>

    {/* Desktop Navigation — 7 cols, hidden below md */}
    <div className="col-span-7 hidden items-center justify-center gap-3 md:flex">
      {navLinks.map((link) => (
        <Link
          key={link.label}
          href={link.href}
          className="flex flex-col items-center gap-0.5 px-3 py-1.5 text-gray-600 transition-colors hover:text-gray-900"
        >
          <span className="relative">
            {link.icon}
            {link.badge && (
              <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-red-500" />
            )}
          </span>
          <span className="text-xs">{link.label}</span>
        </Link>
      ))}
    </div>

    {/* Actions — 3 cols on desktop, 6 on mobile (logo + this = 12) */}
<div className="col-span-6 flex items-center justify-end md:col-span-3">

  {/* Desktop auth/action buttons — hidden below md */}
  <div className="hidden w-full items-center justify-between md:flex">
    {!isAuthenticated ? (
      <>
        <Link href="/login" className="rounded bg-blue-600 px-5 py-2 text-center font-semibold text-white">
          Login
        </Link>
        <Link href="/register/user" className="rounded bg-blue-600 px-5 py-2 text-center font-semibold text-white">
          Create an account
        </Link>
      </>
    ) : UserCompany.length > 0 ? (
      <>
        <Link href="/proposal/new" className="rounded bg-blue-600 px-5 py-2 text-center font-semibold text-white">
          + Proposal
        </Link>
        <Link href={`/company/${UserCompany[0]?.legalName}`} className="flex items-center gap-2">
          <Image
            src={UserCompany[0]?.logo || "/non_company_profile.png"}
            alt={`${UserCompany[0]?.legalName || "Company"} logo`}
            width={35}
            height={35}
            className="rounded-md object-cover w-[35px] h-[35px]"
          />
          <span className="text-sm font-medium text-gray-700 truncate max-w-[100px]">
            {UserCompany[0].name ?? UserCompany[0].legalName}
          </span>
        </Link>
      </>
    ) : (
      <>
        <Link href="/register/company" className="rounded bg-blue-600 px-5 py-2 text-center font-semibold text-white">
          Create Company
        </Link>
        <button
          className="flex cursor-pointer items-center justify-center gap-1 border-2 px-3  py-2 rounded bg-blue-600 text-white font-semibold"
          onClick={handleLogout}
        >
          <IoIosLogOut className='' />
          <span>Logout</span>
        </button>
      </>
    )}
  </div>

  {/* Mobile hamburger toggle — visible below md */}
  <button
    className="p-2 text-gray-700 md:hidden"
    onClick={() => setIsOpen(!isOpen)}
    aria-label="Toggle menu"
  >
    {isOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
  </button>
</div>
  </div>

  {/* Mobile Menu Dropdown */}
  {isOpen && (
    <div className="space-y-1 border-b border-gray-200 bg-white p-4 md:hidden">
      {navLinks.map((link) => (
        <Link
          key={link.label}
          href={link.href}
          onClick={() => setIsOpen(false)}
          className="flex items-center gap-3 rounded-lg p-2 text-gray-700 hover:bg-gray-50"
        >
          {link.icon}
          <span className="font-medium">{link.label}</span>
          {link.badge && <span className="ml-auto h-2 w-2 rounded-full bg-red-500" />}
        </Link>
      ))}

      {/* Auth/action links, mirrored for mobile */}
      <div className="pt-2 space-y-2">
        {!isAuthenticated ? (
          <>
            <Link href="/login" onClick={() => setIsOpen(false)} className="block w-full rounded-full bg-blue-600 py-2.5 text-center font-semibold text-white">
              Login
            </Link>
            <Link href="/register/user" onClick={() => setIsOpen(false)} className="block w-full rounded-full bg-blue-600 py-2.5 text-center font-semibold text-white">
              Create an account
            </Link>
          </>
        ) : UserCompany.length > 0 ? (
          <>
            <Link href="/proposal/new" onClick={() => setIsOpen(false)} className="block w-full rounded-full bg-blue-600 py-2.5 text-center font-semibold text-white">
              + Proposal
            </Link>
            <Link
              href={`/company/${UserCompany[0]?.legalName}`}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 rounded-lg p-2 text-gray-700 hover:bg-gray-50"
            >
              <Image
                src={UserCompany[0]?.logo || "/non_company_profile.png"}
                alt={`${UserCompany[0]?.legalName || "Company"} logo`}
                width={32}
                height={32}
                className="rounded-md object-cover w-8 h-8"
              />
              <span className="text-sm font-medium">
                {UserCompany[0].name ?? UserCompany[0].legalName}
              </span>
            </Link>
          </>
        ) : (
          <>
            <Link href="/register/company" onClick={() => setIsOpen(false)} className="block w-full rounded-full bg-blue-600 py-2.5 text-center font-semibold text-white">
              Create Company
            </Link>
            <button
              onClick={() => { setIsOpen(false); handleLogout(); }}
              className="flex w-full items-center justify-center gap-1 rounded-lg border-2 py-2.5 font-semibold text-gray-700"
            >
              <IoIosLogOut />
              <span>Logout</span>
            </button>
          </>
        )}
      </div>
      
    </div>
  )}
</header>
  );
};

export default Header;