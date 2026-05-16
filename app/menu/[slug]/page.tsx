import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";

type MenuPageProps = {
  params: Promise<{
    slug: string;
  }>;
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

export default async function MenuPage({ params }: MenuPageProps) {
  const { slug } = await params;

  const { data: restaurant, error: restaurantError } = await supabase
    .from("restaurants")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (restaurantError || !restaurant) {
    notFound();
  }

  const { data: categories, error: categoriesError } = await supabase
    .from("categories")
    .select(`
      id,
      name,
      sort_order,
      menu_items (
        id,
        name,
        description,
        price,
        image_url,
        sort_order,
        is_active
      )
    `)
    .eq("restaurant_id", restaurant.id)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (categoriesError) {
    throw new Error(categoriesError.message);
  }

  const typedCategories = (categories ?? []) as Category[];

  return (
    <main className="min-h-screen bg-neutral-50 px-4 py-6 text-neutral-950">
      <div className="mx-auto max-w-md">
        <header className="mb-8 text-center">
          {restaurant.logo_url ? (
            <img
              src={restaurant.logo_url}
              alt={restaurant.name}
              className="mx-auto mb-4 h-20 w-20 rounded-2xl object-cover"
            />
          ) : (
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-neutral-900 text-2xl font-bold text-white">
              {restaurant.name.charAt(0)}
            </div>
          )}

          <h1 className="text-3xl font-bold tracking-tight">
            {restaurant.name}
          </h1>
        </header>

        <div className="space-y-8">
          {typedCategories.map((category) => {
            const items =
              category.menu_items
                ?.filter((item) => item.is_active)
                .sort((a, b) => a.sort_order - b.sort_order) ?? [];

            if (items.length === 0) return null;

            return (
              <section key={category.id}>
                <h2 className="mb-4 text-xl font-bold">{category.name}</h2>

                <div className="space-y-3">
                  {items.map((item) => (
                    <article
                      key={item.id}
                      className="flex gap-4 rounded-2xl bg-white p-4 shadow-sm"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="font-semibold leading-snug">
                            {item.name}
                          </h3>

                          <p className="shrink-0 font-bold">
                            AED {Number(item.price).toFixed(0)}
                          </p>
                        </div>

                        {item.description ? (
                          <p className="mt-1 text-sm leading-5 text-neutral-500">
                            {item.description}
                          </p>
                        ) : null}
                      </div>

                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="h-24 w-24 shrink-0 rounded-xl object-cover"
                        />
                      ) : null}
                    </article>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </main>
  );
}
