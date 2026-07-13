"use client";
import React from 'react';
import Link from 'next/link';
import { RiBuilding2Line } from "react-icons/ri";
import { FiChevronRight } from "react-icons/fi";
import useAuthStore from '../store/UseauthStore';
import useCompanyStore from '../store/UseCompanieStore';
import { useEffect } from 'react';

const NotificationsPage = () => {
  const { isAuthenticated, user } = useAuthStore();
  const { companies, fetchAllCompanies } = useCompanyStore();

  useEffect(() => {
    if (isAuthenticated) fetchAllCompanies();
  }, [isAuthenticated, fetchAllCompanies]);

  const myCompany = companies.find(
    (c) => c.createdBy?.toString() === user?._id?.toString()
  );

 
  return (
    <div className="max-w-2xl mx-auto pb-16 mt-5">
      {/* <h1 className="text-lg font-semibold text-slate-900 mb-4">Notifications</h1> */}

      {isAuthenticated  ? (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <Link
            href="/register/company"
            className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors"
          >
            <div className="shrink-0 w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
              <RiBuilding2Line size={22} className="text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900">
                Register your business on Blueprint
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                Complete your profile by registering your company to start connecting with partners.
              </p>
            </div>
            <FiChevronRight className="text-slate-400 shrink-0" />
          </Link>
        </div>
      ) : (
        <div className="flex h-[50vh] items-center justify-center">
        <Link href="/login" className="cursor-pointer font-bold inline-flex items-center justify-center px-4 py-2 text-base leading-6 text-white whitespace-no-wrap bg-blue-600 border border-blue-700 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" data-rounded="rounded-md" data-primary="blue-600" data-primary-reset="{}">
          Please login first
        </Link>
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;