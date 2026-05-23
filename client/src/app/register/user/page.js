
const fieldClassName =
"h-12 w-full rounded-md border border-slate-300 bg-white px-4 text-[15px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-primary  focus:ring-primary/15";

import Image from "next/image";


const UserRegisterPage = () => {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f0f2f5] px-4 py-10 text-slate-900">
      <section className="grid w-full max-w-5xl items-center gap-10 md:grid-cols-[1fr_420px] md:gap-14">
        <div className="mx-auto max-w-xl text-center md:mx-0 md:text-left xsm:hidden">
          <Image src="/reg_pg_img.png" alt="register page image" width={500} height={500} loading="eager" />
        </div>

        <div className="mx-auto w-full max-w-[420px]">
          <form className="rounded-lg bg-white p-5 shadow-[0_2px_12px_rgba(15,23,42,0.16)] sm:p-6">
            <div className="mb-5 text-center">
              <h2 className="text-2xl font-bold text-slate-950">
                Create a new account
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                  Create an account to network, collaborate, propose, and close deals
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
                placeholder="Email address"
                type="email"
              />

              <label className="sr-only" htmlFor="password">
                Password
              </label>
              <input
                className={fieldClassName}
                id="password"
                name="password"
                placeholder="New password"
                type="password"
              />
            </div>

            <p className="mt-4 text-xs leading-5 text-slate-500">
              By signing up, you agree to Blueprint's terms and privacy policy.
            </p>

            <button
              className="mt-5 h-12 w-full rounded-md px-5 text-base font-bold text-white transition bg-[#025fbd] focus:outline-none focus:ring-4 focus:ring-primary/25"
              type="submit"
            >
              Submit
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
  );
}

export default UserRegisterPage;
