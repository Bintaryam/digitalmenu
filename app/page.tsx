import Link from "next/link";

const features = [
  "Mobile-friendly QR menu",
  "Restaurant logo and branding",
  "Categories, items, descriptions, and AED prices",
  "Food images included",
  "Fast online menu access",
  "Hosting included",
  "QR code ready for tables and counters",
  "Menu updates available when needed",
];

function WhatsAppIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 32 32"
      className="h-5 w-5"
      fill="currentColor"
    >
      <path d="M16.04 3C9.42 3 4.03 8.34 4.03 14.9c0 2.1.56 4.15 1.62 5.96L4 29l8.34-1.62a12.2 12.2 0 0 0 3.7.57c6.62 0 12.01-5.34 12.01-11.9C28.05 8.34 22.66 3 16.04 3Zm0 22.86c-1.22 0-2.42-.19-3.56-.57l-.5-.17-4.95.96.98-4.8-.27-.5a9.7 9.7 0 0 1-1.34-4.9c0-5.4 4.42-9.8 9.85-9.8s9.85 4.4 9.85 9.8-4.42 9.98-9.85 9.98Zm5.46-7.36c-.3-.15-1.78-.87-2.06-.97-.28-.1-.48-.15-.68.15-.2.3-.78.97-.96 1.17-.18.2-.35.22-.65.07-.3-.15-1.27-.46-2.42-1.47-.9-.79-1.5-1.77-1.68-2.07-.18-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.68-1.62-.93-2.22-.24-.58-.49-.5-.68-.51h-.58c-.2 0-.52.07-.8.37-.28.3-1.05 1.02-1.05 2.49s1.08 2.89 1.23 3.09c.15.2 2.12 3.2 5.14 4.49.72.31 1.28.5 1.72.64.72.23 1.38.2 1.9.12.58-.09 1.78-.72 2.03-1.42.25-.7.25-1.3.18-1.42-.08-.13-.28-.2-.58-.35Z" />
    </svg>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f5f1ea] text-[#17120d]">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col px-5 py-8">
        <nav className="flex items-center justify-between gap-4">
          <div>
            <p className="text-lg font-black tracking-tight">Digital Menu</p>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#9b6a3d]">
              QR menus for restaurants
            </p>
          </div>

          <a
            href="https://wa.me/971500000000"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[#17120d] px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-[#302016]"
          >
            <WhatsAppIcon />
            Contact
          </a>
        </nav>

        <div className="grid flex-1 items-center gap-10 py-14 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="mb-5 inline-flex rounded-full border border-[#e5d8c8] bg-white px-4 py-2 text-sm font-bold text-[#9b6a3d] shadow-sm">
              Launch offer available
            </div>

            <h1 className="max-w-3xl text-5xl font-black leading-[1.02] tracking-tight sm:text-6xl">
              Beautiful QR digital menus for restaurants.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-neutral-700">
              We create clean, mobile-friendly digital menus that customers can
              open instantly by scanning a QR code. Simple, fast, and designed
              to look professional on every phone.
            </p>

            <div className="mt-7 max-w-xl rounded-[2rem] border border-[#e5d8c8] bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.2em] text-[#9b6a3d]">
                    Launch price
                  </p>
                  <p className="mt-1 text-4xl font-black tracking-tight">
                    AED 999/year
                  </p>
                  <p className="mt-1 text-sm font-semibold text-neutral-500">
                    Includes setup, hosting, QR menu link, items, prices, and images.
                  </p>
                </div>

                <div className="rounded-2xl bg-[#f5f1ea] px-4 py-3 text-sm font-black text-[#302016]">
                  Free setup
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/menu/burger-house"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-2xl bg-[#17120d] px-6 py-4 text-center font-black text-white shadow-sm transition hover:bg-[#302016]"
              >
                View live demo
              </Link>

              <a
                href="https://wa.me/971500000000"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#d8c7b2] bg-white px-6 py-4 text-center font-black text-[#17120d] shadow-sm transition hover:border-[#bda98f] hover:bg-[#fbfaf7]"
              >
                <WhatsAppIcon />
                WhatsApp us
              </a>
            </div>

            <p className="mt-4 text-sm text-neutral-500">
              
            </p>
          </div>

          <div className="mx-auto w-full max-w-sm rounded-[2rem] border border-[#e5d8c8] bg-[#fbfaf7] p-4 shadow-2xl">
            <div className="rounded-[1.5rem] border border-[#eee3d4] bg-white p-4 shadow-sm">
              <div className="mb-5 text-center">
                <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-3xl bg-[#f5f1ea] text-3xl font-black">
                  QR
                </div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#9b6a3d]">
                  Digital Menu
                </p>
                <h2 className="mt-1 text-2xl font-black">Burger House</h2>
              </div>

              <div className="mb-4 flex gap-2 overflow-hidden">
                <span className="rounded-full border border-[#e5d8c8] px-4 py-2 text-sm font-bold">
                  Burgers
                </span>
                <span className="rounded-full border border-[#e5d8c8] px-4 py-2 text-sm font-bold">
                  Sides
                </span>
                <span className="rounded-full border border-[#e5d8c8] px-4 py-2 text-sm font-bold">
                  Drinks
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex gap-3 rounded-3xl border border-[#eee3d4] p-3">
                  <div className="flex-1">
                    <p className="font-black">Classic Burger</p>
                    <p className="mt-1 text-sm leading-5 text-neutral-600">
                      Beef patty, cheese, lettuce, tomato, and house sauce
                    </p>
                    <p className="mt-3 font-black">AED 28</p>
                  </div>
                  <div className="h-20 w-20 rounded-2xl bg-[#3a2417]" />
                </div>

                <div className="flex gap-3 rounded-3xl border border-[#eee3d4] p-3">
                  <div className="flex-1">
                    <p className="font-black">French Fries</p>
                    <p className="mt-1 text-sm leading-5 text-neutral-600">
                      Crispy golden fries with sea salt
                    </p>
                    <p className="mt-3 font-black">AED 12</p>
                  </div>
                  <div className="h-20 w-20 rounded-2xl bg-[#d9a441]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#e5d8c8] bg-[#fbfaf7] px-5 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="text-sm font-black uppercase tracking-[0.25em] text-[#9b6a3d]">
              Features
            </p>
            <h2 className="mt-3 text-4xl font-black tracking-tight">
              Everything needed for a clean digital menu.
            </h2>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div
                key={feature}
                className="rounded-3xl border border-[#eee3d4] bg-white p-5 shadow-sm"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-[#f5f1ea] font-black text-[#9b6a3d]">
                  ✓
                </div>
                <p className="font-bold leading-6">{feature}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-16">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-[#e5d8c8] bg-white p-7 shadow-sm">
            <p className="text-sm font-black uppercase tracking-[0.25em] text-[#9b6a3d]">
              Demo
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight">
              Try the live menu experience.
            </h2>
            <p className="mt-4 leading-7 text-neutral-600">
              Open the demo menu to see how customers browse categories, view
              menu items, and tap for more details.
            </p>

            <Link
              href="/menu/burger-house"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex rounded-2xl bg-[#17120d] px-6 py-4 font-black text-white transition hover:bg-[#302016]"
            >
              View Burger House demo
            </Link>
          </div>

          <div className="rounded-[2rem] border border-[#e5d8c8] bg-[#17120d] p-7 text-white shadow-sm">
            <p className="text-sm font-black uppercase tracking-[0.25em] text-orange-200">
              Simple pricing
            </p>
            <h2 className="mt-3 text-4xl font-black tracking-tight">
              AED 999/year
            </h2>
            <p className="mt-2 font-bold text-orange-100">
              Launch price for early restaurants
            </p>

            <div className="mt-6 space-y-3 text-sm leading-6 text-neutral-200">
              <p>Includes digital menu setup, hosting, QR menu link, menu items, categories, prices, and images.</p>
              <p>Standard pricing may change after the launch period.</p>
            </div>

            <a
              href="https://wa.me/971500000000"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 font-black text-[#17120d] transition hover:bg-[#f5f1ea]"
            >
              <WhatsAppIcon />
              Contact on WhatsApp
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#e5d8c8] px-5 py-8 text-center">
        <p className="text-sm font-semibold text-neutral-500">
          © 2026 Digital Menu. QR digital menus for restaurants.
        </p>
      </footer>
    </main>
  );
}
