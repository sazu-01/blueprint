
"use client"
import { useState } from "react";
import Image from 'next/image';
import { useRouter } from "next/navigation";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!apiBaseUrl) {
  console.log("login url is not defined");
}

const fieldClassName =
  "h-12 w-full rounded-md border border-slate-300 bg-white px-4 text-[15px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-primary/15";


const UserLoginPage = () => {

    const router = useRouter();
    const [message, setMessage] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((currentFormData) => ({
            ...currentFormData,
            [name]: value,
        }));
    };

const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage(null);
    const normalizedEmail = formData.email.trim();
    const normalizedPassword = formData.password.trim();

    if (!normalizedEmail || !normalizedPassword) {
        setMessage({
            type: "error",
            text: "Email and password are required.",
        });
        return;
    }

    setIsSubmitting(true);
    try {
        const response = await fetch(`${apiBaseUrl}/auth/login/user`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
                email: normalizedEmail,
                password: normalizedPassword,
            }),
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            throw new Error(data.message || "Login failed. Please try again.");
        }

        localStorage.setItem("user", JSON.stringify(data.payload.user));

        setMessage({
            type: "success",
            text: data.message || "Login successful!",
        });

        setTimeout(() => {
            router.push("/");
        }, 500);

    } catch (error) {
        setMessage({
            type: "error",
            text: error.message || "Login failed. Please try again.",
        });
    } finally {
        setIsSubmitting(false);
    }
};
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f0f2f5] px-4 py-10 text-slate-900">
      <section className="grid w-full max-w-5xl items-center gap-10 md:grid-cols-[1fr_420px] md:gap-14">
        <div className="mx-auto max-w-xl text-center md:mx-0 md:text-left xsm:hidden">
          <Image
            src="/reg_pg_img.png"
            alt="register page image"
            width={500}
            height={500}
            loading="eager"
          />
        </div>

        <div className="mx-auto w-full max-w-[420px]">
          <form
            className="rounded-lg bg-white p-5 shadow-[0_2px_12px_rgba(15,23,42,0.16)] sm:p-6"
            onSubmit={handleSubmit}
          >
            <div className="mb-5 text-center">
              <h2 className="text-2xl font-bold text-slate-950">
                Create a new account
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Create an account to network, collaborate, propose, and close
                deals
              </p>
            </div>

            <div className="mt-3 space-y-3">
              <label className="sr-only" htmlFor="email">
                Email
              </label>
              <input
                className={fieldClassName}
                id="email"
                name="email"
                onChange={handleChange}
                placeholder="Email address"
                required
                type="email"
                value={formData.email}
                autoComplete="email"
              />

              <label className="sr-only" htmlFor="password">
                Password
              </label>
              <input
                className={fieldClassName}
                id="password"
                name="password"
                onChange={handleChange}
                placeholder="password"
                required
                minLength={6}
                type="password"
                value={formData.password}
                autoComplete="password"
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

            <p className="mt-4 text-xs leading-5 text-slate-500">
              By signing up, you agree to Blueprint&apos;s terms and privacy policy.
            </p>

            <button
              className="mt-5 h-12 w-full rounded-md bg-[#025fbd] px-5 text-base font-bold text-white transition focus:outline-none focus:ring-4 focus:ring-primary/25 disabled:cursor-not-allowed disabled:bg-slate-400"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? "Loging..." : "Login"}
            </button>

            <div className="my-5 h-px bg-slate-200" />

            <a
              className="mx-auto flex h-11 w-fit items-center justify-center rounded-md border border-slate-200 px-5 text-sm font-semibold text-primary transition hover:bg-primary/5"
              href="#"
            >
              Already have an account?
            </a>
          </form>
        </div>
      </section>
    </main>
  )
}

export default UserLoginPage