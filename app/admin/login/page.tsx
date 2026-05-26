import { loginAction } from "@/app/admin/auth-actions";

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f5f1ea] px-4 text-[#17120d]">
      <div className="w-full max-w-sm rounded-[2rem] border border-[#e5d8c8] bg-white p-6 shadow-sm">
        <p className="text-sm font-black uppercase tracking-[0.25em] text-[#9b6a3d]">
          Admin
        </p>

        <h1 className="mt-2 text-3xl font-black">Sign in</h1>

        {params.error ? (
          <p className="mt-4 rounded-2xl bg-red-50 p-3 text-sm font-bold text-red-700">
            Login failed. Check your email and password.
          </p>
        ) : null}

        <form action={loginAction} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-bold">Email</label>
            <input
              name="email"
              type="email"
              required
              className="mt-2 w-full rounded-2xl border border-[#e5d8c8] px-4 py-3 outline-none focus:border-[#9b6a3d]"
            />
          </div>

          <div>
            <label className="text-sm font-bold">Password</label>
            <input
              name="password"
              type="password"
              required
              className="mt-2 w-full rounded-2xl border border-[#e5d8c8] px-4 py-3 outline-none focus:border-[#9b6a3d]"
            />
          </div>

          <button className="w-full cursor-pointer rounded-2xl bg-[#17120d] px-4 py-3 font-black text-white transition hover:bg-[#302016]">
            Login
          </button>
        </form>
      </div>
    </main>
  );
}
