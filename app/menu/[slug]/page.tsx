import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import MenuContent from "@/components/MenuContent";

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
    .select("id, name, slug, logo_url")
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

  return (
    <MenuContent
      restaurant={restaurant}
      categories={(categories ?? []) as Category[]}
    />
  );
}
