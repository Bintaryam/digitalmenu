import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { updateRestaurantAction } from "@/app/admin/restaurant-actions";
import {
  createCategoryAction,
  createMenuItemAction,
  deleteCategoryAction,
  deleteMenuItemAction,
  moveCategoryAction,
  moveMenuItemAction,
  updateCategoryAction,
  updateMenuItemAction,
} from "@/app/admin/menu-actions";

type RestaurantPageProps = {
  params: Promise<{
    id: string;
  }>;
};

type MenuItem = {
  id: string;
  restaurant_id: string;
  category_id: string;
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
  is_active: boolean;
  menu_items: MenuItem[];
};

export default async function RestaurantAdminPage({ params }: RestaurantPageProps) {
  await requireAdmin();

  const { id } = await params;

  const { data: restaurant, error: restaurantError } = await supabaseAdmin
    .from("restaurants")
    .select("*")
    .eq("id", id)
    .single();

  if (restaurantError || !restaurant) {
    notFound();
  }

  const { data: categories, error: categoriesError } = await supabaseAdmin
    .from("categories")
    .select(`
      id,
      name,
      sort_order,
      is_active,
      menu_items (
        id,
        restaurant_id,
        category_id,
        name,
        description,
        price,
        image_url,
        sort_order,
        is_active
      )
    `)
    .eq("restaurant_id", id)
    .order("sort_order", { ascending: true });

  if (categoriesError) {
    throw new Error(categoriesError.message);
  }

  const typedCategories = ((categories ?? []) as Category[])
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((category) => ({
      ...category,
      menu_items: (category.menu_items ?? []).sort(
        (a, b) => a.sort_order - b.sort_order
      ),
    }));

  const categoryOptions = typedCategories.map((category) => ({
    id: category.id,
    name: category.name,
  }));

  return (
    <main className="min-h-screen bg-[#f5f1ea] px-4 py-6 text-[#17120d]">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link href="/admin" className="text-sm font-bold text-[#9b6a3d]">
              ← Back to restaurants
            </Link>

            <h1 className="mt-2 text-4xl font-black tracking-tight">
              {restaurant.name}
            </h1>

            <p className="mt-2 text-sm text-neutral-600">
              Public URL: /menu/{restaurant.slug}
            </p>
          </div>

          <Link
            href={`/menu/${restaurant.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-2xl bg-[#17120d] px-5 py-3 text-center font-black text-white transition hover:bg-[#302016]"
          >
            View public menu
          </Link>
        </header>

        <section className="mb-8 rounded-[2rem] border border-[#e5d8c8] bg-white p-5 shadow-sm">
          <h2 className="text-2xl font-black">Restaurant details</h2>

          <form
            action={updateRestaurantAction.bind(null, restaurant.id)}
            className="mt-5 grid gap-4 lg:grid-cols-[1fr_1fr_1fr_auto]"
            encType="multipart/form-data"
          >
            <div>
              <label className="text-sm font-bold">Name</label>
              <input
                name="name"
                defaultValue={restaurant.name}
                required
                className="mt-2 w-full rounded-2xl border border-[#e5d8c8] px-4 py-3 outline-none focus:border-[#9b6a3d]"
              />
            </div>

            <div>
              <label className="text-sm font-bold">Slug</label>
              <input
                name="slug"
                defaultValue={restaurant.slug}
                required
                className="mt-2 w-full rounded-2xl border border-[#e5d8c8] px-4 py-3 outline-none focus:border-[#9b6a3d]"
              />
            </div>

            <div>
              <label className="text-sm font-bold">Replace logo</label>
              <input
                name="logo"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="mt-2 w-full rounded-2xl border border-[#e5d8c8] bg-white px-4 py-3 text-sm"
              />
            </div>

            <div className="flex items-end gap-4">
              <label className="mb-3 flex items-center gap-2 font-bold">
                <input
                  name="is_active"
                  type="checkbox"
                  defaultChecked={restaurant.is_active}
                />
                Active
              </label>

              <button className="cursor-pointer rounded-2xl bg-[#17120d] px-5 py-3 font-black text-white transition hover:bg-[#302016]">
                Save
              </button>
            </div>
          </form>
        </section>

        <section className="mb-8 rounded-[2rem] border border-[#e5d8c8] bg-white p-5 shadow-sm">
          <h2 className="text-2xl font-black">Add category</h2>

          <form
            action={createCategoryAction.bind(null, restaurant.id, restaurant.slug)}
            className="mt-5 flex flex-col gap-3 sm:flex-row"
          >
            <input
              name="name"
              required
              placeholder="Burgers"
              className="w-full rounded-2xl border border-[#e5d8c8] px-4 py-3 outline-none focus:border-[#9b6a3d]"
            />

            <button className="cursor-pointer rounded-2xl bg-[#17120d] px-5 py-3 font-black text-white transition hover:bg-[#302016]">
              Add category
            </button>
          </form>
        </section>

        <section className="space-y-6">
          {typedCategories.length === 0 ? (
            <div className="rounded-[2rem] border border-[#e5d8c8] bg-white p-8 text-center shadow-sm">
              <h2 className="text-2xl font-black">No categories yet</h2>
              <p className="mt-2 text-neutral-600">
                Add your first category above, like Burgers, Drinks, or Desserts.
              </p>
            </div>
          ) : null}

          {typedCategories.map((category) => (
            <article
              key={category.id}
              className="rounded-[2rem] border border-[#e5d8c8] bg-white p-5 shadow-sm"
            >
              <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
                <form
                  action={updateCategoryAction.bind(null, category.id, restaurant.id, restaurant.slug)}
                  className="grid gap-3 md:grid-cols-[1fr_120px_auto_auto]"
                >
                  <div>
                    <label className="text-sm font-bold">Category name</label>
                    <input
                      name="name"
                      defaultValue={category.name}
                      required
                      className="mt-2 w-full rounded-2xl border border-[#e5d8c8] px-4 py-3 outline-none focus:border-[#9b6a3d]"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-bold">Order</label>
                    <input
                      name="sort_order"
                      type="number"
                      defaultValue={category.sort_order}
                      className="mt-2 w-full rounded-2xl border border-[#e5d8c8] px-4 py-3 outline-none focus:border-[#9b6a3d]"
                    />
                  </div>

                  <label className="flex items-center gap-2 pt-8 font-bold">
                    <input
                      name="is_active"
                      type="checkbox"
                      defaultChecked={category.is_active}
                    />
                    Active
                  </label>

                  <button className="cursor-pointer rounded-2xl bg-[#17120d] px-5 py-3 font-black text-white transition hover:bg-[#302016]">
                    Save category
                  </button>
                </form>

                <div className="flex flex-wrap gap-2">
                  <form action={moveCategoryAction.bind(null, category.id, restaurant.id, restaurant.slug, "up")}>
                    <button className="cursor-pointer rounded-2xl border border-[#d8c7b2] bg-white px-4 py-3 font-black transition hover:bg-[#fbfaf7]">
                      ↑
                    </button>
                  </form>

                  <form action={moveCategoryAction.bind(null, category.id, restaurant.id, restaurant.slug, "down")}>
                    <button className="cursor-pointer rounded-2xl border border-[#d8c7b2] bg-white px-4 py-3 font-black transition hover:bg-[#fbfaf7]">
                      ↓
                    </button>
                  </form>

                  <form action={deleteCategoryAction.bind(null, category.id, restaurant.id, restaurant.slug)}>
                    <button className="cursor-pointer rounded-2xl bg-red-50 px-4 py-3 font-black text-red-700 transition hover:bg-red-100">
                      Delete category
                    </button>
                  </form>
                </div>
              </div>

              <div className="mt-5 rounded-3xl bg-[#f5f1ea] p-4">
                <h3 className="text-xl font-black">Add item to {category.name}</h3>

                <form
                  action={createMenuItemAction.bind(null, restaurant.id, restaurant.slug)}
                  className="mt-4 grid gap-3 lg:grid-cols-[1fr_1fr_120px_1fr_auto]"
                  encType="multipart/form-data"
                >
                  <input type="hidden" name="category_id" value={category.id} />

                  <input
                    name="name"
                    required
                    placeholder="Classic Burger"
                    className="rounded-2xl border border-[#e5d8c8] px-4 py-3 outline-none focus:border-[#9b6a3d]"
                  />

                  <input
                    name="description"
                    placeholder="Description"
                    className="rounded-2xl border border-[#e5d8c8] px-4 py-3 outline-none focus:border-[#9b6a3d]"
                  />

                  <input
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    placeholder="28"
                    className="rounded-2xl border border-[#e5d8c8] px-4 py-3 outline-none focus:border-[#9b6a3d]"
                  />

                  <input
                    name="image"
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="rounded-2xl border border-[#e5d8c8] bg-white px-4 py-3 text-sm"
                  />

                  <button className="cursor-pointer rounded-2xl bg-[#17120d] px-5 py-3 font-black text-white transition hover:bg-[#302016]">
                    Add item
                  </button>
                </form>
              </div>

              <div className="mt-5 space-y-4">
                {category.menu_items.length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-[#d8c7b2] p-5 text-center text-sm font-bold text-neutral-500">
                    No items in this category yet.
                  </div>
                ) : null}

                {category.menu_items.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-3xl border border-[#eee3d4] bg-white p-4 shadow-sm"
                  >
                    <div className="grid gap-4 lg:grid-cols-[96px_1fr_auto]">
                      <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl bg-[#f5f1ea]">
                        {item.image_url ? (
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="px-2 text-center text-xs font-bold text-neutral-400">
                            No image
                          </span>
                        )}
                      </div>

                      <form
                        action={updateMenuItemAction.bind(null, item.id, restaurant.id, restaurant.slug)}
                        className="grid gap-3 md:grid-cols-2"
                        encType="multipart/form-data"
                      >
                        <div>
                          <label className="text-sm font-bold">Name</label>
                          <input
                            name="name"
                            defaultValue={item.name}
                            required
                            className="mt-2 w-full rounded-2xl border border-[#e5d8c8] px-4 py-3 outline-none focus:border-[#9b6a3d]"
                          />
                        </div>

                        <div>
                          <label className="text-sm font-bold">Category</label>
                          <select
                            name="category_id"
                            defaultValue={item.category_id}
                            className="mt-2 w-full rounded-2xl border border-[#e5d8c8] bg-white px-4 py-3 outline-none focus:border-[#9b6a3d]"
                          >
                            {categoryOptions.map((option) => (
                              <option key={option.id} value={option.id}>
                                {option.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="text-sm font-bold">Price</label>
                          <input
                            name="price"
                            type="number"
                            step="0.01"
                            min="0"
                            defaultValue={item.price}
                            required
                            className="mt-2 w-full rounded-2xl border border-[#e5d8c8] px-4 py-3 outline-none focus:border-[#9b6a3d]"
                          />
                        </div>

                        <div>
                          <label className="text-sm font-bold">Order</label>
                          <input
                            name="sort_order"
                            type="number"
                            defaultValue={item.sort_order}
                            className="mt-2 w-full rounded-2xl border border-[#e5d8c8] px-4 py-3 outline-none focus:border-[#9b6a3d]"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="text-sm font-bold">Description</label>
                          <textarea
                            name="description"
                            defaultValue={item.description ?? ""}
                            rows={2}
                            className="mt-2 w-full rounded-2xl border border-[#e5d8c8] px-4 py-3 outline-none focus:border-[#9b6a3d]"
                          />
                        </div>

                        <div>
                          <label className="text-sm font-bold">Replace image</label>
                          <input
                            name="image"
                            type="file"
                            accept="image/png,image/jpeg,image/webp"
                            className="mt-2 w-full rounded-2xl border border-[#e5d8c8] bg-white px-4 py-3 text-sm"
                          />
                        </div>

                        <div className="flex items-end justify-between gap-3">
                          <label className="mb-3 flex items-center gap-2 font-bold">
                            <input
                              name="is_active"
                              type="checkbox"
                              defaultChecked={item.is_active}
                            />
                            Active
                          </label>

                          <button className="cursor-pointer rounded-2xl bg-[#17120d] px-5 py-3 font-black text-white transition hover:bg-[#302016]">
                            Save item
                          </button>
                        </div>
                      </form>

                      <div className="flex flex-wrap gap-2 lg:flex-col">
                        <form action={moveMenuItemAction.bind(null, item.id, restaurant.id, restaurant.slug, item.category_id, "up")}>
                          <button className="w-full cursor-pointer rounded-2xl border border-[#d8c7b2] bg-white px-4 py-3 font-black transition hover:bg-[#fbfaf7]">
                            ↑
                          </button>
                        </form>

                        <form action={moveMenuItemAction.bind(null, item.id, restaurant.id, restaurant.slug, item.category_id, "down")}>
                          <button className="w-full cursor-pointer rounded-2xl border border-[#d8c7b2] bg-white px-4 py-3 font-black transition hover:bg-[#fbfaf7]">
                            ↓
                          </button>
                        </form>

                        <form action={deleteMenuItemAction.bind(null, item.id, restaurant.id, restaurant.slug)}>
                          <button className="w-full cursor-pointer rounded-2xl bg-red-50 px-4 py-3 font-black text-red-700 transition hover:bg-red-100">
                            Delete item
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
