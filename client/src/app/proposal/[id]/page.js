// "use client";
// import React, { useEffect, useState } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import Image from 'next/image';
// import { FiCalendar, FiDownload, FiFileText } from "react-icons/fi";
// import useProposalStore from '../../store/UseProposalStore';
// import useAuthStore from '../../store/UseauthStore';
// import useCompanyStore from '../../store/UseCompanieStore';

// const statusStyles = {
//   draft: "bg-slate-100 text-slate-600",
//   sent: "bg-blue-50 text-blue-700",
//   reviewing: "bg-amber-50 text-amber-700",
//   negotiate: "bg-purple-50 text-purple-700",
//   accepted: "bg-green-50 text-green-700",
//   rejected: "bg-red-50 text-red-700",
// };

// // What actions are available from each status, per backend VALID_TRANSITIONS
// const ACTIONS_BY_STATUS = {
//   sent: ["reviewing", "negotiate", "accepted", "rejected"],
//   reviewing: ["negotiate", "accepted", "rejected"],
//   negotiate: ["accepted", "rejected"],
// };

// const actionLabels = {
//   reviewing: "Mark as Reviewing",
//   negotiate: "Negotiate",
//   accepted: "Accept",
//   rejected: "Reject",
// };

// const actionStyles = {
//   reviewing: "bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200",
//   negotiate: "bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200",
//   accepted: "bg-green-600 text-white hover:bg-green-700",
//   rejected: "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200",
// };

// const ProposalDetailPage = () => {
//   const { id } = useParams();
//   const router = useRouter();
//   const { user } = useAuthStore();
//   const { companies, fetchAllCompanies } = useCompanyStore();
//   const {
//     currentProposal: proposal,
//     isLoading,
//     error,
//     fetchProposalById,
//     respondToProposal,
//   } = useProposalStore();

//   const [showRejectModal, setShowRejectModal] = useState(false);
//   const [rejectionReason, setRejectionReason] = useState("");
//   const [actionLoading, setActionLoading] = useState(false);
//   const [actionError, setActionError] = useState("");

//   useEffect(() => {
//     fetchAllCompanies();
//   }, [fetchAllCompanies]);

//   useEffect(() => {
//     if (id) fetchProposalById(id);
//   }, [id, fetchProposalById]);

//   const myCompany = companies.find(
//     (c) => c.createdBy?.toString() === user?._id?.toString()
//   );

//   if (isLoading) {
//     return (
//       <div className="flex h-[70vh] items-center justify-center">
//         <p className="text-slate-500">Loading...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex h-[70vh] items-center justify-center">
//         <p className="text-red-600">{error}</p>
//       </div>
//     );
//   }

//   if (!proposal) {
//     return (
//       <div className="flex h-[70vh] items-center justify-center">
//         <p className="text-slate-400">Proposal not found.</p>
//       </div>
//     );
//   }

//   const isReceiver = proposal.toCompany?._id?.toString() === myCompany?._id?.toString();
//   const isSender = proposal.fromCompany?._id?.toString() === myCompany?._id?.toString();
//   const availableActions = isReceiver ? (ACTIONS_BY_STATUS[proposal.status] || []) : [];

//   const handleAction = async (status) => {
//     if (status === "rejected") {
//       setShowRejectModal(true);
//       return;
//     }
//     setActionError("");
//     setActionLoading(true);
//     try {
//       await respondToProposal(proposal._id, status);
//     } catch (err) {
//       setActionError(err.message || "Something went wrong");
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const handleConfirmReject = async () => {
//     if (!rejectionReason.trim()) {
//       setActionError("Please provide a reason for rejecting.");
//       return;
//     }
//     setActionError("");
//     setActionLoading(true);
//     try {
//       await respondToProposal(proposal._id, "rejected", rejectionReason.trim());
//       setShowRejectModal(false);
//       setRejectionReason("");
//     } catch (err) {
//       setActionError(err.message || "Something went wrong");
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-3xl mx-auto pb-16">

//       {/* Top bar */}
//       <div className="flex items-center justify-between mb-6">
//         <button
//           onClick={() => router.back()}
//           className="text-sm text-slate-500 hover:text-slate-700"
//         >
//           ← Back
//         </button>
//         <span
//           className={`text-xs font-medium px-3 py-1.5 rounded-full ${
//             statusStyles[proposal.status] || "bg-slate-100 text-slate-600"
//           }`}
//         >
//           {proposal.status}
//         </span>
//       </div>

//       {/* Main card */}
//       <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

//         {/* Header: from -> to */}
//         <div className="px-6 py-5 border-b border-slate-100">
//           <p className="text-xs text-slate-400 mb-3">{proposal.proposalId}</p>
//           <div className="flex items-center gap-4">
//             <div className="flex items-center gap-2 min-w-0">
//               <Image
//                 src={proposal.fromCompany?.logo || "/non_company_profile.png"}
//                 width={36}
//                 height={36}
//                 alt={proposal.fromCompany?.name || "Company"}
//                 className="rounded-lg object-cover w-9 h-9 border border-slate-100 shrink-0"
//               />
//               <span className="text-sm font-medium text-slate-800 truncate">
//                 {proposal.fromCompany?.name}
//               </span>
//             </div>
//             <span className="text-slate-300">→</span>
//             <div className="flex items-center gap-2 min-w-0">
//               <Image
//                 src={proposal.toCompany?.logo || "/non_company_profile.png"}
//                 width={36}
//                 height={36}
//                 alt={proposal.toCompany?.name || "Company"}
//                 className="rounded-lg object-cover w-9 h-9 border border-slate-100 shrink-0"
//               />
//               <span className="text-sm font-medium text-slate-800 truncate">
//                 {proposal.toCompany?.name}
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* Meta info */}
//         <div className="px-6 py-4 flex items-center gap-5 text-sm text-slate-600 border-b border-slate-100">
//           <span className="flex items-center gap-1.5">
//             <FiFileText className="text-slate-400" />
//             {proposal.proposalType}
//           </span>
//           <span className="w-px h-4 bg-slate-200" />
//           <span className="flex items-center gap-1.5">
//             <FiCalendar className="text-slate-400" />
//             Sent {new Date(proposal.createdAt).toLocaleDateString()}
//           </span>
//         </div>

//         {/* Document */}
//         <div className="px-6 py-6">
//           <p className="text-xs font-semibold text-slate-500 uppercase mb-3">
//             Proposal Document
//           </p>
          
//           <a  href={proposal.file}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/30 transition-colors w-fit"
//           >
//             <FiFileText className="text-blue-600 text-xl shrink-0" />
//             <span className="text-sm text-slate-700">View document</span>
//             <FiDownload className="text-slate-400 shrink-0" />
//           </a>
//         </div>

//         {/* Rejection reason, if rejected */}
//         {proposal.status === "rejected" && proposal.rejectionReason && (
//           <div className="px-6 py-4 bg-red-50/50 border-t border-red-100">
//             <p className="text-xs font-semibold text-red-500 uppercase mb-1">
//               Rejection reason
//             </p>
//             <p className="text-sm text-red-700">{proposal.rejectionReason}</p>
//           </div>
//         )}

//         {/* Action bar — only the receiving company can act */}
//         {availableActions.length > 0 && (
//           <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center gap-2 flex-wrap">
//             {availableActions.map((action) => (
//               <button
//                 key={action}
//                 onClick={() => handleAction(action)}
//                 disabled={actionLoading}
//                 className={`text-sm font-medium px-4 py-2 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${actionStyles[action]}`}
//               >
//                 {actionLabels[action]}
//               </button>
//             ))}
//           </div>
//         )}

//         {isSender && ["sent", "reviewing", "negotiate"].includes(proposal.status) && (
//           <div className="px-6 py-3 bg-slate-50 border-t border-slate-100">
//             <p className="text-xs text-slate-400">
//               Waiting for {proposal.toCompany?.name} to respond.
//             </p>
//           </div>
//         )}

//         {actionError && (
//           <div className="px-6 py-3 border-t border-slate-100">
//             <p className="text-sm text-red-600">{actionError}</p>
//           </div>
//         )}
//       </div>

//       {/* Reject modal */}
//       {showRejectModal && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
//           <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-lg">
//             <h2 className="text-base font-semibold text-slate-900 mb-3">
//               Reject this proposal
//             </h2>
//             <p className="text-sm text-slate-500 mb-3">
//               Please share a reason — this will be visible to {proposal.fromCompany?.name}.
//             </p>
//             <textarea
//               value={rejectionReason}
//               onChange={(e) => setRejectionReason(e.target.value)}
//               rows={4}
//               placeholder="e.g. Terms don't align with our current priorities..."
//               className="w-full text-sm border border-slate-200 rounded-lg p-3 outline-none focus:border-blue-300 resize-none"
//             />
//             {actionError && (
//               <p className="text-sm text-red-600 mt-2">{actionError}</p>
//             )}
//             <div className="flex items-center justify-end gap-2 mt-4">
//               <button
//                 onClick={() => {
//                   setShowRejectModal(false);
//                   setRejectionReason("");
//                   setActionError("");
//                 }}
//                 className="text-sm text-slate-500 hover:text-slate-700 px-4 py-2"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleConfirmReject}
//                 disabled={actionLoading}
//                 className="text-sm font-medium text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-full disabled:opacity-50"
//               >
//                 {actionLoading ? "Rejecting..." : "Confirm reject"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProposalDetailPage;



















"use client";
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { FiCalendar, FiDownload, FiFileText, FiCornerUpLeft, FiSend, FiChevronDown, FiChevronUp } from "react-icons/fi";
import useProposalStore from '../../store/UseProposalStore';
import useProposalTextStore from '../../store/UseProposalTextStore';
import useAuthStore from '../../store/UseauthStore';
import useCompanyStore from '../../store/UseCompanieStore';

const statusStyles = {
  draft: "bg-slate-100 text-slate-600",
  sent: "bg-blue-50 text-blue-700",
  reviewing: "bg-amber-50 text-amber-700",
  negotiate: "bg-purple-50 text-purple-700",
  accepted: "bg-green-50 text-green-700",
  rejected: "bg-red-50 text-red-700",
};

const ACTIONS_BY_STATUS = {
  sent: ["reviewing", "negotiate", "accepted", "rejected"],
  reviewing: ["negotiate", "accepted", "rejected"],
  negotiate: ["accepted", "rejected"],
};

const actionLabels = {
  reviewing: "Mark as Reviewing",
  negotiate: "Negotiate",
  accepted: "Accept",
  rejected: "Reject",
};

const actionStyles = {
  reviewing: "bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200",
  negotiate: "bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200",
  accepted: "bg-green-600 text-white hover:bg-green-700",
  rejected: "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200",
};

const ProposalDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const { companies, fetchAllCompanies } = useCompanyStore();
  const {
    currentProposal: proposal,
    isLoading,
    error,
    fetchProposalById,
    respondToProposal,
  } = useProposalStore();
  const { texts, fetchTexts, sendText } = useProposalTextStore();

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState("");

  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetchAllCompanies();
  }, [fetchAllCompanies]);

  useEffect(() => {
    if (id) fetchProposalById(id);
  }, [id, fetchProposalById]);

  const canMessage = proposal && ["negotiate", "accepted"].includes(proposal.status);

  useEffect(() => {
    if (id && canMessage) fetchTexts(id);
  }, [id, canMessage, fetchTexts]);

  // Keep the latest message expanded by default once texts load
  useEffect(() => {
    if (texts.length > 0) {
      setExpandedId(texts[texts.length - 1]._id);
    }
  }, [texts.length]);

  const myCompany = companies.find(
    (c) => c.createdBy?.toString() === user?._id?.toString()
  );

  if (isLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <p className="text-slate-500">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!proposal) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <p className="text-slate-400">Proposal not found.</p>
      </div>
    );
  }

  const isReceiver = proposal.toCompany?._id?.toString() === myCompany?._id?.toString();
  const isSender = proposal.fromCompany?._id?.toString() === myCompany?._id?.toString();
  const availableActions = isReceiver ? (ACTIONS_BY_STATUS[proposal.status] || []) : [];

  const handleAction = async (status) => {
    if (status === "rejected") {
      setShowRejectModal(true);
      return;
    }
    setActionError("");
    setActionLoading(true);
    try {
      await respondToProposal(proposal._id, status);
    } catch (err) {
      setActionError(err.message || "Something went wrong");
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmReject = async () => {
    if (!rejectionReason.trim()) {
      setActionError("Please provide a reason for rejecting.");
      return;
    }
    setActionError("");
    setActionLoading(true);
    try {
      await respondToProposal(proposal._id, "rejected", rejectionReason.trim());
      setShowRejectModal(false);
      setRejectionReason("");
    } catch (err) {
      setActionError(err.message || "Something went wrong");
    } finally {
      setActionLoading(false);
    }
  };

  const handleSendReply = async () => {
    if (!replyText.trim()) return;
    setSendError("");
    setSending(true);
    try {
      await sendText(proposal._id, myCompany._id, replyText.trim());
      setReplyText("");
      setShowReplyBox(false);
    } catch (err) {
      setSendError(err.message || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto pb-16">

      {/* Top bar */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => router.back()}
          className="text-sm text-slate-500 hover:text-slate-700"
        >
          ← Back
        </button>
        <span
          className={`text-xs font-medium px-3 py-1.5 rounded-full ${
            statusStyles[proposal.status] || "bg-slate-100 text-slate-600"
          }`}
        >
          {proposal.status}
        </span>
      </div>

      {/* Main card */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

        {/* Header: from -> to */}
        <div className="px-6 py-5 border-b border-slate-100">
          <p className="text-xs text-slate-400 mb-3">{proposal.proposalId}</p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 min-w-0">
              <Image
                src={proposal.fromCompany?.logo || "/non_company_profile.png"}
                width={36}
                height={36}
                alt={proposal.fromCompany?.name || "Company"}
                className="rounded-lg object-cover w-9 h-9 border border-slate-100 shrink-0"
              />
              <span className="text-sm font-medium text-slate-800 truncate">
                {proposal.fromCompany?.name}
              </span>
            </div>
            <span className="text-slate-300">→</span>
            <div className="flex items-center gap-2 min-w-0">
              <Image
                src={proposal.toCompany?.logo || "/non_company_profile.png"}
                width={36}
                height={36}
                alt={proposal.toCompany?.name || "Company"}
                className="rounded-lg object-cover w-9 h-9 border border-slate-100 shrink-0"
              />
              <span className="text-sm font-medium text-slate-800 truncate">
                {proposal.toCompany?.name}
              </span>
            </div>
          </div>
        </div>

        {/* Meta info */}
        <div className="px-6 py-4 flex items-center gap-5 text-sm text-slate-600 border-b border-slate-100">
          <span className="flex items-center gap-1.5">
            <FiFileText className="text-slate-400" />
            {proposal.proposalType}
          </span>
          <span className="w-px h-4 bg-slate-200" />
          <span className="flex items-center gap-1.5">
            <FiCalendar className="text-slate-400" />
            Sent {new Date(proposal.createdAt).toLocaleDateString()}
          </span>
        </div>

        {/* Document */}
        <div className="px-6 py-6">
          <p className="text-xs font-semibold text-slate-500 uppercase mb-3">
            Proposal Document
          </p>
          <a
            href={proposal.file}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/30 transition-colors w-fit"
          >
            <FiFileText className="text-blue-600 text-xl shrink-0" />
            <span className="text-sm text-slate-700">View document</span>
            <FiDownload className="text-slate-400 shrink-0" />
          </a>
        </div>

        {/* Rejection reason, if rejected */}
        {proposal.status === "rejected" && proposal.rejectionReason && (
          <div className="px-6 py-4 bg-red-50/50 border-t border-red-100">
            <p className="text-xs font-semibold text-red-500 uppercase mb-1">
              Rejection reason
            </p>
            <p className="text-sm text-red-700">{proposal.rejectionReason}</p>
          </div>
        )}

        {/* Action bar — only the receiving company can act */}
        {availableActions.length > 0 && (
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center gap-2 flex-wrap">
            {availableActions.map((action) => (
              <button
                key={action}
                onClick={() => handleAction(action)}
                disabled={actionLoading}
                className={`text-sm font-medium px-4 py-2 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${actionStyles[action]}`}
              >
                {actionLabels[action]}
              </button>
            ))}
          </div>
        )}

        {isSender && ["sent", "reviewing", "negotiate"].includes(proposal.status) && (
          <div className="px-6 py-3 bg-slate-50 border-t border-slate-100">
            <p className="text-xs text-slate-400">
              Waiting for {proposal.toCompany?.name} to respond.
            </p>
          </div>
        )}

        {actionError && (
          <div className="px-6 py-3 border-t border-slate-100">
            <p className="text-sm text-red-600">{actionError}</p>
          </div>
        )}
      </div>

      {/* Message thread — only once negotiate/accepted */}
      {canMessage && (
        <div className="mt-6 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h3 className="text-sm font-semibold text-slate-700">Conversation</h3>
            <button
              onClick={() => setShowReplyBox((prev) => !prev)}
              className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              <FiCornerUpLeft />
              Reply
            </button>
          </div>

          {/* Thread list */}
          <div className="divide-y divide-slate-100">
            {texts.length === 0 && (
              <p className="px-6 py-5 text-sm text-slate-400">No messages yet.</p>
            )}

            {texts.map((msg) => {
              const isMine = msg.senderCompany?._id?.toString() === myCompany?._id?.toString();
              const isExpanded = expandedId === msg._id;

              return (
                <div key={msg._id} className="px-6 py-3">
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : msg._id)}
                    className="w-full flex items-center gap-3 text-left"
                  >
                    <Image
                      src={msg.senderCompany?.logo || "/non_company_profile.png"}
                      width={28}
                      height={28}
                      alt={msg.senderCompany?.name || "Company"}
                      className="rounded-full object-cover w-7 h-7 border border-slate-100 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <span className={`text-sm truncate ${isMine ? "text-slate-500" : "font-medium text-slate-800"}`}>
                        {isMine ? "You" : msg.senderCompany?.name}
                      </span>
                      {!isExpanded && (
                        <span className="text-sm text-slate-400 ml-2 truncate">
                          — {msg.text}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-400 shrink-0">
                      {new Date(msg.createdAt).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </span>
                    {isExpanded ? <FiChevronUp className="text-slate-400 shrink-0" /> : <FiChevronDown className="text-slate-400 shrink-0" />}
                  </button>

                  {isExpanded && (
                    <div className="mt-2 ml-10">
                      <p className="text-sm text-slate-700 whitespace-pre-wrap">{msg.text}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Inline reply compose box — Gmail style */}
          {showReplyBox && (
            <div className="border-t border-slate-100 px-6 py-4 bg-slate-50">
              <div className="flex items-start gap-3">
                <Image
                  src={myCompany?.logo || "/non_company_profile.png"}
                  width={32}
                  height={32}
                  alt={myCompany?.name || "You"}
                  className="rounded-full object-cover w-8 h-8 border border-slate-100 shrink-0 mt-1"
                />
                <div className="flex-1">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={3}
                    placeholder={`Reply as ${myCompany?.name || "your company"}...`}
                    className="w-full text-sm border border-slate-200 rounded-xl p-3 bg-white outline-none focus:border-blue-300 resize-none"
                  />
                  {sendError && (
                    <p className="text-sm text-red-600 mt-1.5">{sendError}</p>
                  )}
                  <div className="flex items-center justify-end gap-2 mt-2.5">
                    <button
                      onClick={() => {
                        setShowReplyBox(false);
                        setReplyText("");
                        setSendError("");
                      }}
                      className="text-sm text-slate-500 hover:text-slate-700 px-3 py-1.5"
                    >
                      Discard
                    </button>
                    <button
                      onClick={handleSendReply}
                      disabled={sending || !replyText.trim()}
                      className="flex items-center gap-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-4 py-1.5 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FiSend size={14} />
                      {sending ? "Sending..." : "Send"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Reject modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-lg">
            <h2 className="text-base font-semibold text-slate-900 mb-3">
              Reject this proposal
            </h2>
            <p className="text-sm text-slate-500 mb-3">
              Please share a reason — this will be visible to {proposal.fromCompany?.name}.
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={4}
              placeholder="e.g. Terms don't align with our current priorities..."
              className="w-full text-sm border border-slate-200 rounded-lg p-3 outline-none focus:border-blue-300 resize-none"
            />
            {actionError && (
              <p className="text-sm text-red-600 mt-2">{actionError}</p>
            )}
            <div className="flex items-center justify-end gap-2 mt-4">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason("");
                  setActionError("");
                }}
                className="text-sm text-slate-500 hover:text-slate-700 px-4 py-2"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                disabled={actionLoading}
                className="text-sm font-medium text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-full disabled:opacity-50"
              >
                {actionLoading ? "Rejecting..." : "Confirm reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProposalDetailPage;