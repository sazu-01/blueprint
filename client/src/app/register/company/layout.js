// app/company/register/layout.js
const CompanyRegisterLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Register Your Company</h1>
          <p className="text-slate-600 mt-2">Complete your company profile to get started on Blueprint</p>
        </div>
        {children}
      </div>
    </div>
  );
};

export default CompanyRegisterLayout;