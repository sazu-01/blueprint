"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const apiBaseUrl = (
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000"
).replace(/\/$/, "");

const fieldClassName =
  "h-12 w-full rounded-md border border-slate-300 bg-white px-4 text-center text-[18px] font-semibold tracking-[6px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-primary/15";

const emailFieldClassName =
  "h-12 w-full rounded-md border border-slate-300 bg-white px-4 text-[15px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-primary/15";

const getInitialEmail = () => {
  if (typeof window === "undefined") {
    return "";
  }

  const params = new URLSearchParams(window.location.search);
  const emailFromUrl = params.get("email");
  const emailFromStorage = sessionStorage.getItem("pendingRegistrationEmail");

  return emailFromUrl || emailFromStorage || "";
};

const UserActivatePage = () => {
  const [email, setEmail] = useState(getInitialEmail);
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const route = useRouter();
  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage(null);

    const normalizedEmail = email.trim();
    const normalizedOtp = otp.trim();

    if (!normalizedEmail || !normalizedOtp) {
      setMessage({
        type: "error",
        text: "Email and OTP are required.",
      });
      return;
    }

    if (!/^\d{6}$/.test(normalizedOtp)) {
      setMessage({
        type: "error",
        text: "Enter the 6 digit OTP from your email.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        `${apiBaseUrl}/api/auth/register/user/activate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: normalizedEmail,
            otp: normalizedOtp,
          }),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "Registration failed. Please try again.");
      }

      sessionStorage.removeItem("pendingRegistrationEmail");
      setOtp("");
      setMessage({
        type: "success",
        text: data.message || "User registered successfully.",
      });
      route.push(`/`);
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "Registration failed. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f0f2f5] px-4 py-10 text-slate-900">
      <section className="mx-auto w-full max-w-[420px]">
        <form
          className="rounded-lg bg-white p-5 shadow-[0_2px_12px_rgba(15,23,42,0.16)] sm:p-6"
          onSubmit={handleSubmit}
        >
          <div className="mb-5 text-center">
            <h2 className="text-2xl font-bold text-slate-950">
              Verify your email
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Enter the 6 digit OTP sent to your email.
            </p>
          </div>

          <div className="mt-3 space-y-3">
            <label className="sr-only" htmlFor="email">
              Email
            </label>
            <input
              autoComplete="email"
              className={emailFieldClassName}
              id="email"
              name="email"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Email address"
              required
              type="email"
              value={email}
              readOnly
            />

            <label className="sr-only" htmlFor="otp">
              OTP
            </label>
            <input
              autoComplete="one-time-code"
              className={fieldClassName}
              id="otp"
              inputMode="numeric"
              maxLength={6}
              name="otp"
              onChange={(event) =>
                setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))
              }
              pattern="[0-9]{6}"
              placeholder="000000"
              required
              type="text"
              value={otp}
            />
          </div>

          {message && (
            <p
              className={`mt-4 rounded-md px-3 py-2 text-sm ${
                message.type === "success"
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-red-50 text-red-700"
              }`}
              role="status"
              aria-live="polite"
            >
              {message.text}
            </p>
          )}

          <button
            className="mt-5 h-12 w-full rounded-md bg-[#025fbd] px-5 text-base font-bold text-white transition focus:outline-none focus:ring-4 focus:ring-primary/25 disabled:cursor-not-allowed disabled:bg-slate-400"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
      </section>
    </main>
  );
};

export default UserActivatePage;
