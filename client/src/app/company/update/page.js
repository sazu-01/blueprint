"use client";
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { FiX, FiChevronDown } from "react-icons/fi";
import useAuthStore from '@/app/store/UseauthStore';
import useCompanyStore from '@/app/store/UseCompanieStore';
import { industries, businessActivities } from '@/app/lib/proposalType';


const COMPANY_TYPES = [
  "Partnership",
  "Educational",
  "Privately held",
  "Government Agency",
  "Non Profit",
  "Public Company",
  "Self Employed",
  "Self Owned",
];

const REQUIRED_FIELDS = ["name", "legalName", "description", "industryVertical", "businessActivity", "interestedIndustries"];
const OPTIONAL_FIELDS = ["country", "address", "companyType", "webLink", "companySize", "foundedYear", "fundingStaged", "officialDomain"];

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


const buildFormState = (company) => ({
  name: company?.name || "",
  legalName: company?.legalName || "",
  description: company?.description || "",
  industryVertical: parseTagArray(company?.industryVertical) || [],
  businessActivity: parseTagArray(company?.businessActivity) || [],
  interestedIndustries: parseTagArray(company?.interestedIndustries) || [],
  country: company?.country || "",
  address: company?.address || "",
  companyType: company?.companyType || "",
  webLink: company?.webLink || "",
  companySize: company?.companySize || "",
  foundedYear: company?.foundedYear || "",
  fundingStaged: company?.fundingStaged || "",
  officialDomain: company?.officialDomain || "",
});


const MultiSelectDropdown = ({ label, options, values, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleOption = (option) => {
    if (values.includes(option)) {
      onChange(values.filter((v) => v !== option));
    } else {
      onChange([...values, option]);
    }
  };

  const removeTag = (value) => onChange(values.filter((v) => v !== value));

  return (
    <div className="relative" ref={ref}>
      <label className="text-xs font-medium text-slate-500 mb-1.5 block">{label}</label>

      {/* Selected tags */}
      <div className="flex flex-wrap gap-1.5 mb-2">
        {values.map((tag) => (
          <span key={tag} className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full bg-blue-50 text-blue-700 border border-blue-100">
            {tag}
            <button type="button" onClick={() => removeTag(tag)} className="hover:text-blue-900" aria-label={`Remove ${tag}`}>
              <FiX size={12} />
            </button>
          </span>
        ))}
      </div>

      {/* Dropdown trigger */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex items-center justify-between text-sm text-slate-600 border border-[#dddcdc] rounded-lg px-3 py-2 outline-none focus:border-blue-300 cursor-pointer"
      >
        <span>{values.length > 0 ? `${values.length} selected` : "Select options"}</span>
        <FiChevronDown className={`transition-transform ${open ? "rotate-180" : ""}`} size={16} />
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute z-10 mt-1 w-full max-h-56 overflow-y-auto bg-white border border-[#dddcdc] rounded-lg shadow-lg py-1">
          {options.map((option) => {
            const checked = values.includes(option);
            return (
              <label
                key={option}
                className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleOption(option)}
                  className="accent-blue-600"
                />
                {option}
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
};



const CompanyUpdatePage = () => {

  const { user } = useAuthStore();
  const { companies, fetchAllCompanies, updateCompany, isLoading, error } = useCompanyStore();

  const [original, setOriginal] = useState(null);
  const [form, setForm] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    fetchAllCompanies();
  }, [fetchAllCompanies]);

  const myCompany = companies.find(
    (c) => c.createdBy?.toString() === user?._id?.toString()
  );

  // Initialize form once myCompany is available — only runs once per company load
  useEffect(() => {
    if (myCompany && !form) {
      const initial = buildFormState(myCompany);
      setOriginal(initial);
      setForm(initial);
    }
  }, [myCompany, form]);

  const isDirty =
    form && original &&
    (JSON.stringify(form) !== JSON.stringify(original) || logoFile !== null);

  const handleField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleDiscard = () => {
    setForm(original);
    setLogoFile(null);
    setLogoPreview(null);
    setFormError("");
  };

  const handleUpdate = async () => {
    setFormError("");

    if (!form.name.trim() || !form.legalName.trim() || !form.description.trim()) {
      setFormError("Name, legal name, and description are required.");
      return;
    }
    if (form.industryVertical.length === 0 || form.businessActivity.length === 0 || form.interestedIndustries.length === 0) {
      setFormError("Industry vertical, business activity, and interested industries are required.");
      return;
    }

    const formData = new FormData();
    [...REQUIRED_FIELDS, ...OPTIONAL_FIELDS].forEach((key) => {
      const value = form[key];
      if (Array.isArray(value)) {
        value.forEach((v) => formData.append(key, v)); // backend reads as array via multer/body-parser
      } else if (value) {
        formData.append(key, value);
      }
    });
    if (logoFile) {
      formData.append("logo", logoFile);
    }

    setSubmitting(true);
    try {
      const updated = await updateCompany(myCompany._id, formData);
      const refreshed = buildFormState(updated);
      setOriginal(refreshed);
      setForm(refreshed);
      setLogoFile(null);
      setLogoPreview(null);
    } catch (err) {
      setFormError(err.message || "Failed to update company");
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading && !form) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <p className="text-slate-500">Loading...</p>
      </div>
    );
  }

  if (!myCompany) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <p className="text-slate-400">No company found for your account.</p>
      </div>
    );
  }

  if (!form) return null;

  return (
    <div className="max-w-2xl mx-auto pb-24">
      <h1 className="text-lg font-semibold text-slate-900 mb-6 mt-4">Update Company</h1>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-6">

        {/* Logo */}
        <div className="flex items-center gap-4">
          <Image
            src={logoPreview || myCompany.logo || "/non_company_profile.png"}
            width={64}
            height={64}
            alt="Company logo"
            className="rounded-lg object-cover w-16 h-16 border border-slate-100"
          />
          <label className="text-sm text-blue-600 font-medium cursor-pointer hover:text-blue-700">
            Change logo
            <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
          </label>
        </div>

        {/* Required fields */}
        <div className="border-t border-slate-100 pt-5 space-y-4">
          <p className="text-xs font-semibold text-slate-500 uppercase">Required</p>

          <div>
            <label className="text-xs font-medium text-slate-500 mb-1.5 block">Company name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleField("name", e.target.value)}
              className="w-full text-sm border border-[#dddcdc] rounded-lg px-3 py-2 outline-none focus:border-blue-300"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-500 mb-1.5 block">Legal name</label>
            <input
              type="text"
              value={form.legalName}
              onChange={(e) => handleField("legalName", e.target.value)}
              className="w-full text-sm border border-[#dddcdc] rounded-lg px-3 py-2 outline-none focus:border-blue-300"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-500 mb-1.5 block">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => handleField("description", e.target.value)}
              rows={4}
              className="w-full text-sm border border-[#dddcdc] rounded-lg p-3 outline-none focus:border-blue-300 resize-none"
            />
          </div>

          <MultiSelectDropdown
            label="Industry vertical"
            options={industries}
            values={form.industryVertical}
            onChange={(v) => handleField("industryVertical", v)}
          />
          <MultiSelectDropdown
            label="Business activity"
            options={businessActivities}
            values={form.businessActivity}
            onChange={(v) => handleField("businessActivity", v)}
          />
          <MultiSelectDropdown
            label="Interested industries"
            options={industries}
            values={form.interestedIndustries}
            onChange={(v) => handleField("interestedIndustries", v)}
          />
        </div>

        {/* Optional fields */}
        <div className="border-t border-slate-100 pt-5 space-y-4">
          <p className="text-xs font-semibold text-slate-500 uppercase">Optional</p>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1.5 block">Country</label>
              <input
                type="text"
                value={form.country}
                onChange={(e) => handleField("country", e.target.value)}
                className="w-full text-sm border border-[#dddcdc] rounded-lg px-3 py-2 outline-none focus:border-blue-300"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1.5 block">Address</label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => handleField("address", e.target.value)}
                className="w-full text-sm border border-[#dddcdc] rounded-lg px-3 py-2 outline-none focus:border-blue-300"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1.5 block">Company type</label>
              <select
                value={form.companyType}
                onChange={(e) => handleField("companyType", e.target.value)}
                className="w-full text-sm border border-[#dddcdc] rounded-lg px-3 py-2 outline-none focus:border-blue-300 cursor-pointer"
              >
                <option value="">Select type</option>
                {COMPANY_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1.5 block">Company size</label>
              <input
                type="text"
                value={form.companySize}
                onChange={(e) => handleField("companySize", e.target.value)}
                className="w-full text-sm border border-[#dddcdc] rounded-lg px-3 py-2 outline-none focus:border-blue-300"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1.5 block">Founded year</label>
              <input
                type="text"
                value={form.foundedYear}
                onChange={(e) => handleField("foundedYear", e.target.value)}
                className="w-full text-sm border border-[#dddcdc] rounded-lg px-3 py-2 outline-none focus:border-blue-300"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1.5 block">Funding stage</label>
              <input
                type="text"
                value={form.fundingStaged}
                onChange={(e) => handleField("fundingStaged", e.target.value)}
                className="w-full text-sm border border-[#dddcdc] rounded-lg px-3 py-2 outline-none focus:border-blue-300"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1.5 block">Web link</label>
              <input
                type="text"
                value={form.webLink}
                onChange={(e) => handleField("webLink", e.target.value)}
                className="w-full text-sm border border-[#dddcdc] rounded-lg px-3 py-2 outline-none focus:border-blue-300"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1.5 block">Official domain</label>
              <input
                type="text"
                value={form.officialDomain}
                onChange={(e) => handleField("officialDomain", e.target.value)}
                className="w-full text-sm border border-[#dddcdc] rounded-lg px-3 py-2 outline-none focus:border-blue-300"
              />
            </div>
          </div>
        </div>

        {(formError || error) && (
          <p className="text-sm text-red-600">{formError || error}</p>
        )}
      </div>

      {/* Sticky update/discard bar — only shows when something changed */}
      {isDirty && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border border-t border-[#dddcdc] shadow-lg px-4 py-3 z-50">
          <div className="max-w-2xl mx-auto flex items-center justify-end gap-3">
            <button
              onClick={handleDiscard}
              disabled={submitting}
              className="text-sm font-semibold cursor-pointer text-white px-4 py-2 bg-red-500 rounded-full"
            >
              Discard
            </button>
            <button
              onClick={handleUpdate}
              disabled={submitting}
              className="text-sm font-semibold text-white cursor-pointer bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-full disabled:opacity-50"
            >
              {submitting ? "Updating..." : "Update"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyUpdatePage;