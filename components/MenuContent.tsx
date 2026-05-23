"use client";

import { useState } from "react";

type Restaurant = {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
};

type MenuItem = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
};

type Category = {
  id: string;
  name: string;
  sort_order: number;
  menu_items: MenuItem[];
};

type MenuContentProps = {
  restaurant: Restaurant;
  categories: Category[];
};

export default function MenuContent({ restaurant, categories }: MenuContentProps) {
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  const activeCategories = categories
    .map((category) => ({
      ...category,
      menu_items:
        category.menu_items
          ?.filter((item) => item.is_active)
          .sort((a, b) => a.sort_order - b.sort_order) ?? [],
    }))
    .filter((category) => category.menu_items.length > 0)
    .sort((a, b) => a.sort_order - b.sort_order);

  const hasItems = activeCategories.length > 0;

  return (
    <main className="min-h-screen bg-[#f5f1ea] text-[#17120d]">
      <div className="mx-auto min-h-screen max-w-md bg-[#fbfaf7] shadow-xl">
        <header className="px-5 pb-6 pt-8 text-center">
          {restaurant.logo_url ? (
            <div className="mx-auto mb-4 flex h-28 w-28 items-center justify-center rounded-3xl bg-white p-2 shadow-sm ring-1 ring-black/5">
              <img
                src={restaurant.logo_url}
                alt={restaurant.name}
                className="h-full w-full object-contain"
              />
            </div>
          ) : (
            <div className="mx-auto mb-4 flex h-28 w-28 items-center justify-center rounded-3xl bg-[#17120d] text-4xl font-black text-white shadow-sm">
              {restaurant.name.charAt(0)}
            </div>
          )}

          <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-[#9b6a3d]">
            Digital Menu
          </p>

          <h1 className="text-3xl font-black tracking-tight">
            {restaurant.name}
          </h1>
        </header>

        {hasItems ? (
          <nav className="sticky top-0 z-30 border-y border-[#eadfce] bg-[#fbfaf7]/95 px-4 py-3 backdrop-blur">
            <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {activeCategories.map((category) => (
                <a
                  key={category.id}
                  href={`#category-${category.id}`}
                  className="shrink-0 rounded-full border border-[#e5d8c8] bg-white px-4 py-2 text-sm font-bold text-[#302016] shadow-sm active:scale-[0.98]"
                >
                  {category.name}
                </a>
              ))}
            </div>
          </nav>
        ) : null}

        <div className="px-4 py-6">
          {!hasItems ? (
            <div className="rounded-3xl border border-[#eadfce] bg-white p-6 text-center shadow-sm">
              <h2 className="text-xl font-black">Menu unavailable</h2>
              <p className="mt-2 text-sm leading-6 text-neutral-600">
                This restaurant menu is currently unavailable. Please check again soon.
              </p>
            </div>
          ) : (
            <div className="space-y-9">
              {activeCategories.map((category) => (
                <section
                  key={category.id}
                  id={`category-${category.id}`}
                  className="scroll-mt-24"
                >
                  <div className="mb-4 flex items-center gap-3">
                    <h2 className="text-2xl font-black tracking-tight">
                      {category.name}
                    </h2>
                    <div className="h-px flex-1 bg-[#eadfce]" />
                  </div>

                  <div className="space-y-4">
                    {category.menu_items.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSelectedItem(item)}
                        className="flex w-full cursor-pointer gap-4 rounded-3xl border border-[#eee3d4] bg-white p-3 text-left shadow-sm transition hover:border-[#dfcfbb] hover:shadow-md active:scale-[0.99]"
                      >
                        <div className="min-w-0 flex-1 py-1">
                          <h3 className="text-base font-black leading-snug">
                            {item.name}
                          </h3>

                          {item.description ? (
                            <p className="clamp-2 mt-1 text-sm leading-5 text-neutral-600">
                              {item.description}
                            </p>
                          ) : null}

                          <p className="mt-3 text-base font-black text-[#302016]">
                            AED {Number(item.price).toFixed(0)}
                          </p>
                        </div>

                        {item.image_url ? (
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className="h-24 w-24 shrink-0 rounded-2xl object-cover shadow-sm"
                          />
                        ) : (
                          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-[#eee5d8] text-xs font-bold text-[#8a735c]">
                            No image
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>

        <footer className="px-4 pb-8 pt-2 text-center">
          <p className="text-xs font-semibold text-neutral-400">
            Powered by Digital Menu
          </p>
        </footer>
      </div>

      {selectedItem ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-sm"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-md overflow-hidden rounded-[2rem] bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedItem(null)}
              className="absolute right-4 top-4 z-10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white/90 text-2xl font-bold text-[#17120d] shadow-lg transition hover:bg-white active:scale-95"
              aria-label="Close item details"
            >
              ×
            </button>

            {selectedItem.image_url ? (
              <div className="flex h-72 w-full items-center justify-center bg-[#f5f1ea]">
                <img
                  src={selectedItem.image_url}
                  alt={selectedItem.name}
                  className="h-full w-full object-contain"
                />
              </div>
            ) : (
              <div className="flex h-56 w-full items-center justify-center bg-[#eee5d8] font-bold text-[#8a735c]">
                No image
              </div>
            )}

            <div className="p-5">
              <h3 className="text-2xl font-black leading-tight">
                {selectedItem.name}
              </h3>

              {selectedItem.description ? (
                <p className="mt-3 text-base leading-7 text-neutral-600">
                  {selectedItem.description}
                </p>
              ) : null}

              <p className="mt-4 text-xl font-black text-[#302016]">
                AED {Number(selectedItem.price).toFixed(0)}
              </p>

              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="mt-6 w-full cursor-pointer rounded-2xl bg-[#17120d] px-4 py-3 font-black text-white transition hover:bg-[#302016] active:scale-[0.99]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
