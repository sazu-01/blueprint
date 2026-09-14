

import { Suspense } from "react";
import NewProposalForm from "./NewProposalForm";

const NewProposalPage = () => {
  return (
    <Suspense fallback={<div className="min-h-[80vh] flex items-center justify-center text-slate-400 text-sm">Loading...</div>}>
      <NewProposalForm />
    </Suspense>
  );
};

export default NewProposalPage;