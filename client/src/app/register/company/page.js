

"use client";
import React, { useState } from 'react';

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!apiBaseUrl) {
  console.log("register url is not defined");
}

const CompanyRegisterPage = () => {

  const [formData, setFormData] = useState({
    name: '',
    legalName: '',
    description: '',
    industryVertical: [],
    businessActivity: [],
    interestedIndustries: [],
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const industries = [
    'Technology',
    'SaaS',
    'Finance',
    'Healthcare',
    'Manufacturing',
    'Retail',
    'Logistics',
    'Real Estate',
    'Education',
    'Media & Entertainment',
    'Other'
  ];

  const businessActivities = [
    'Partnership',
    'Investment',
    'Collaboration',
    'Project',
    'Vendor Search',
    'Procurement',
    'Networking',
    'Distribution',
    'Acquisition',
    'Joint Venture'
  ]

  const TagSelector = ({ options, selected, onChange, maxSelect }) => {
    const toggle = (item) => {
      if (selected.includes(item)) {
        onChange(selected.filter(i => i !== item));
      } else {
        if (selected.length >= maxSelect) return;
        onChange([...selected, item]);
      }
    };

    return (
      <div className="flex flex-wrap gap-2">
        {options.map(item => {
          const isSelected = selected.includes(item);
          const isDisabled = !isSelected && selected.length >= maxSelect;
          return (
            <button
              key={item}
              type="button"
              onClick={() => toggle(item)}
              disabled={isDisabled}
              className={`
              px-3 py-1.5 rounded-full border text-sm transition-all duration-150
              ${isSelected
                  ? 'bg-blue-50 border-blue-400 text-blue-800 font-medium'
                  : 'bg-white border-slate-300 text-slate-600 hover:border-slate-400'}
              ${isDisabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
            `}
            >
              {isSelected && <span className="mr-1 text-xs">✓</span>}
              {item}
            </button>
          );
        })}
      </div>
    );
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    //This comment fix error of trim is not a function
    if (!formData.name.trim()) newErrors.name = 'Company name is required';
    if (!formData.legalName.trim()) newErrors.legalName = 'Legal name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.industryVertical.length === 0) newErrors.industryVertical = 'Industry vertical is required';
    if (!formData.businessActivity.length === 0) newErrors.businessActivity = 'Business activity is required';
    if (!formData.interestedIndustries.length === 0) newErrors.interestedIndustries = 'Interested industries is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };



  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setSuccessMessage('');

    try {
      const response = await fetch(`${apiBaseUrl}/register/company`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('Company registered successfully!');
        setFormData({
          name: '',
          legalName: '',
          description: '',
          industryVertical: '',
          businessActivity: '',
          interestedIndustries: '',
        });
        // Optional: Redirect after 2 seconds
        setTimeout(() => {
          // Redirect to company dashboard or home
          window.location.href = `/`; 
        }, 2000);
      } else {
        setErrors({ submit: data.message || 'Error registering company' });
      }
    } catch (error) {
      console.error('Error:', error);
      setErrors({ submit: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (

    
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 font-medium">{successMessage}</p>
        </div>
      )}

      {/* Error Message */}
      {errors.submit && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 font-medium">{errors.submit}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">

        <div className='grid gap-4 grid-cols-1 md:grid-cols-2 '>
          {/* Company Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-slate-900 mb-2">
              Company Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Tech Innovations Inc"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-500' : 'border-slate-300'
                }`}
            />
            {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Legal Name */}
          <div>
            <label htmlFor="legalName" className="block text-sm font-semibold text-slate-900 mb-2">
              Legal Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="legalName"
              name="legalName"
              value={formData.legalName}
              onChange={handleChange}
              placeholder="e.g., Tech Innovations Private Limited"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.legalName ? 'border-red-500' : 'border-slate-300'
                }`}
            />
            {errors.legalName && <p className="text-red-600 text-sm mt-1">{errors.legalName}</p>}

          </div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-semibold text-slate-900 mb-2">
            Company Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Briefly describe what your company does"
            rows="3"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${errors.description ? 'border-red-500' : 'border-slate-300'
              }`}
          />
          {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description}</p>}
        </div>

        {/* Industry Vertical */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Industry Vertical <span className="text-red-500">*</span>
            <span className="ml-2 text-xs font-normal text-slate-400">
              {formData.industryVertical.length}/2 selected
            </span>
          </label>
          <TagSelector
            options={industries}
            selected={formData.industryVertical}
            onChange={(val) => setFormData(prev => ({ ...prev, industryVertical: val }))}
            maxSelect={2}
          />
          {errors.industryVertical && <p className="text-red-600 text-sm mt-1">{errors.industryVertical}</p>}
        </div>

        {/* Business Activity */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            What are you looking for? <span className="text-red-500">*</span>
            <span className="ml-2 text-xs font-normal text-slate-400">
              {formData.businessActivity.length}/5 selected
            </span>
          </label>
          <TagSelector
            options={businessActivities}
            selected={formData.businessActivity}
            onChange={(val) => setFormData(prev => ({ ...prev, businessActivity: val }))}
            maxSelect={5}
          />
          {errors.businessActivity && <p className="text-red-600 text-sm mt-1">{errors.businessActivity}</p>}
        </div>

        {/* Interested Industries */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Industries You Want to Connect With <span className="text-red-500">*</span>
            <span className="ml-2 text-xs font-normal text-slate-400">
              {formData.interestedIndustries.length}/5 selected
            </span>
          </label>
          <TagSelector
            options={industries}
            selected={formData.interestedIndustries}
            onChange={(val) => setFormData(prev => ({ ...prev, interestedIndustries: val }))}
            maxSelect={5}
          />
          {errors.interestedIndustries && <p className="text-red-600 text-sm mt-1">{errors.interestedIndustries}</p>}
        </div>

        {/* Submit Button */}
        <div className="pt-6">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 rounded-lg transition-colors duration-200"
          >
            {loading ? 'Registering...' : 'Register Company'}
          </button>
        </div>

        {/* Required Fields Note */}
        <p className="text-slate-500 text-xs text-center">
          <span className="text-red-500">*</span> Required fields
        </p>
      </form>
    </div>
  );
};

export default CompanyRegisterPage;