"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { GoHomeFill } from "react-icons/go";
import { FaBuilding } from "react-icons/fa";
import { IoDocumentTextSharp } from "react-icons/io5";
import { IoMdNotifications } from "react-icons/io";
import useAuthStore from '../store/UseauthStore';
import useCompanyStore from '../store/UseCompanieStore';
const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { isAuthenticated, user } = useAuthStore();
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

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-300 bg-white">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link href="/" className="shrink-0">
            <div className="relative h-9 w-9 overflow-hidden rounded-md">
              <Image src="/logo.png" alt="Blueprint" className="object-cover" width={100} height={100} />
            </div>

          </Link>
          <h1 className='font-bold'>BLUEPRINT</h1>
        </div>

        {/* Desktop Navigation - icon over label, like LinkedIn */}
        <div className="hidden flex-1 items-center justify-center gap-3 md:flex">
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

        {isAuthenticated ? (
          <Link href={`/company/${UserCompany[0]?.legalName}`} className="flex items-center gap-2">
            {UserCompany.length > 0 ? (
              <span className="text-sm font-medium text-gray-700">
                {UserCompany[0].name ?? UserCompany[0].legalName}
              </span>
            ) : (
              <span className="text-sm text-gray-500">No company yet</span>
            )}
          </Link>
        ) : (
          <div className="flex items-center gap-3">
            ...
          </div>
        )}

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
          <Link
            href="/register/company"
            onClick={() => setIsOpen(false)}
            className="block w-full rounded-full bg-blue-600 py-2.5 text-center font-semibold text-white"
          >
            Create a Company
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;