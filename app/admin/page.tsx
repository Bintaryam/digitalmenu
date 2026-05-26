import Link from "next/link";
import { requireAdmin } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { logoutAction } from "@/app/admin/auth-actions";
import {
  createRestaurantAction,
  deleteRestaurantAction,
  updateRestaurantAction,
} from "@/app/admin/restaurant-actions";

type Restaurant = {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  is_active: boolean;
  created_at: string;
};

export default async function AdminPage() {
  const user = await requireAdmin();

  const { data: restaurants, error } = await supabaseAdmin
    .from("restaurants")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (
    <main className="min-h-screen bg-[#f5f1ea] px-4 py-6 text-[#17120d]">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.25em] text-[#9b6a3d]">
              Digital Menu Admin
            </p>
            <h1 className="mt-2 text-4xl font-black tracking-tight">
              Restaurants
            </h1>
            <p className="mt-2 text-sm text-neutral-600">
              Logged in as {user.email}
            </p>
          </div>

          <form action={logoutAction}>
            <button className="cursor-pointer rounded-2xl border border-[#d8c7b2] bg-white px-5 py-3 font-black transition hover:bg-[#fbfaf7]">
              Logout
            </button>
          </form>
        </header>

        <section className="mb-8 rounded-[2rem] border border-[#e5d8c8] bg-white p-5 shadow-sm">
          <h2 className="text-2xl font-black">Add restaurant</h2>

          <form
            action={createRestaurantAction}
            className="mt-5 grid gap-4 lg:grid-cols-4"
            encType="multipart/form-data"
          >
            <div>
              <label className="text-sm font-bold">Restaurant name</label>
              <input
                name="name"
                required
                placeholder="Burger House"
                className="mt-2 w-full rounded-2xl border border-[#e5d8c8] px-4 py-3 outline-none focus:border-[#9b6a3d]"
              />
            </div>

            <div>
              <label className="text-sm font-bold">Slug</label>
              <input
                name="slug"
                placeholder="burger-house"
                className="mt-2 w-full rounded-2xl border border-[#e5d8c8] px-4 py-3 outline-none focus:border-[#9b6a3d]"
              />
            </div>

            <div>
              <label className="text-sm font-bold">Logo</label>
              <input
                name="logo"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="mt-2 w-full rounded-2xl border border-[#e5d8c8] bg-white px-4 py-3 text-sm"
              />
            </div>

            <div className="flex items-end">
              <button className="w-full cursor-pointer rounded-2xl bg-[#17120d] px-4 py-3 font-black text-white transition hover:bg-[#302016]">
                Add restaurant
              </button>
            </div>
          </form>
        </section>

        <section className="grid gap-4">
          {(restaurants ?? []).map((restaurant: Restaurant) => (
            <article
              key={restaurant.id}
              className="rounded-[2rem] border border-[#e5d8c8] bg-white p-5 shadow-sm"
            >
              <div className="grid gap-5 lg:grid-cols-[auto_1fr_auto] lg:items-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[#f5f1ea] p-2">
                  {restaurant.logo_url ? (
                    <img
                      src={restaurant.logo_url}
                      alt={restaurant.name}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <span className="text-2xl font-black">
                      {restaurant.name.charAt(0)}
                    </span>
                  )}
                </div>

                <form
                  action={updateRestaurantAction.bind(null, restaurant.id)}
                  className="grid gap-3 md:grid-cols-3"
                  encType="multipart/form-data"
                >
                  <div>
                    <label className="text-xs font-black uppercase tracking-[0.18em] text-neutral-500">
                      Name
                    </label>
                    <input
                      name="name"
                      defaultValue={restaurant.name}
                      required
                      className="mt-2 w-full rounded-2xl border border-[#e5d8c8] px-4 py-3 outline-none focus:border-[#9b6a3d]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-black uppercase tracking-[0.18em] text-neutral-500">
                      Slug
                    </label>
                    <input
                      name="slug"
                      defaultValue={restaurant.slug}
                      required
                      className="mt-2 w-full rounded-2xl border border-[#e5d8c8] px-4 py-3 outline-none focus:border-[#9b6a3d]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-black uppercase tracking-[0.18em] text-neutral-500">
                      Replace logo
                    </label>
                    <input
                      name="logo"
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      className="mt-2 w-full rounded-2xl border border-[#e5d8c8] bg-white px-4 py-3 text-sm"
                    />
                  </div>

                  <label className="flex items-center gap-2 font-bold">
                    <input
                      name="is_active"
                      type="checkbox"
                      defaultChecked={restaurant.is_active}
                    />
                    Active
                  </label>

                  <div className="flex flex-wrap gap-2 md:col-span-2">
                    <button className="cursor-pointer rounded-2xl bg-[#17120d] px-5 py-3 font-black text-white transition hover:bg-[#302016]">
                      Save
                    </button>

                    <Link
                      href={`/admin/restaurants/${restaurant.id}`}
                      className="rounded-2xl border border-[#d8c7b2] bg-white px-5 py-3 font-black transition hover:bg-[#fbfaf7]"
                    >
                      Open menu
                    </Link>

                    <Link
                      href={`/menu/${restaurant.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-2xl border border-[#d8c7b2] bg-white px-5 py-3 font-black transition hover:bg-[#fbfaf7]"
                    >
                      View public
                    </Link>
                  </div>
                </form>

                <form action={deleteRestaurantAction.bind(null, restaurant.id)}>
                  <button className="cursor-pointer rounded-2xl bg-red-50 px-5 py-3 font-black text-red-700 transition hover:bg-red-100">
                    Delete
                  </button>
                </form>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
