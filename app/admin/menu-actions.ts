"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function getNumber(formData: FormData, key: string, fallback = 0) {
  const value = Number(getString(formData, key));
  return Number.isFinite(value) ? value : fallback;
}

function getBool(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

function getFile(formData: FormData, key: string) {
  const file = formData.get(key);

  if (!(file instanceof File)) return null;
  if (file.size === 0) return null;

  return file;
}

function getFileExtension(file: File) {
  const fromName = file.name.split(".").pop()?.toLowerCase();

  if (fromName && ["jpg", "jpeg", "png", "webp"].includes(fromName)) {
    return fromName === "jpeg" ? "jpg" : fromName;
  }

  if (file.type === "image/png") return "png";
  if (file.type === "image/webp") return "webp";

  return "jpg";
}

async function uploadPublicImage(path: string, file: File) {
  const arrayBuffer = await file.arrayBuffer();

  const { error } = await supabaseAdmin.storage
    .from("menu-images")
    .upload(path, arrayBuffer, {
      contentType: file.type,
      upsert: true,
    });

  if (error) {
    throw new Error(error.message);
  }

  const { data } = supabaseAdmin.storage.from("menu-images").getPublicUrl(path);

  return data.publicUrl;
}

async function getNextSortOrder(
  table: "categories" | "menu_items",
  column: "restaurant_id" | "category_id",
  id: string
) {
  const { data, error } = await supabaseAdmin
    .from(table)
    .select("sort_order")
    .eq(column, id)
    .order("sort_order", { ascending: false })
    .limit(1);

  if (error) {
    throw new Error(error.message);
  }

  return data?.[0]?.sort_order ? data[0].sort_order + 1 : 1;
}

function adminRestaurantPath(restaurantId: string, message: string) {
  return `/admin/restaurants/${restaurantId}?success=${encodeURIComponent(message)}`;
}

export async function createCategoryAction(
  restaurantId: string,
  restaurantSlug: string,
  formData: FormData
) {
  await requireAdmin();

  const name = getString(formData, "name");

  if (!name) {
    throw new Error("Category name is required.");
  }

  const nextSortOrder = await getNextSortOrder("categories", "restaurant_id", restaurantId);

  const { error } = await supabaseAdmin.from("categories").insert({
    restaurant_id: restaurantId,
    name,
    sort_order: nextSortOrder,
    is_active: true,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(`/admin/restaurants/${restaurantId}`);
  revalidatePath(`/menu/${restaurantSlug}`);
  redirect(adminRestaurantPath(restaurantId, "Category added"));
}

export async function updateCategoryAction(
  categoryId: string,
  restaurantId: string,
  restaurantSlug: string,
  formData: FormData
) {
  await requireAdmin();

  const name = getString(formData, "name");
  const sortOrder = getNumber(formData, "sort_order", 0);
  const isActive = getBool(formData, "is_active");

  if (!name) {
    throw new Error("Category name is required.");
  }

  const { error } = await supabaseAdmin
    .from("categories")
    .update({
      name,
      sort_order: sortOrder,
      is_active: isActive,
    })
    .eq("id", categoryId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(`/admin/restaurants/${restaurantId}`);
  revalidatePath(`/menu/${restaurantSlug}`);
  redirect(adminRestaurantPath(restaurantId, "Category saved"));
}

export async function deleteCategoryAction(
  categoryId: string,
  restaurantId: string,
  restaurantSlug: string
) {
  await requireAdmin();

  const { error } = await supabaseAdmin
    .from("categories")
    .delete()
    .eq("id", categoryId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(`/admin/restaurants/${restaurantId}`);
  revalidatePath(`/menu/${restaurantSlug}`);
  redirect(adminRestaurantPath(restaurantId, "Category deleted"));
}

export async function moveCategoryAction(
  categoryId: string,
  restaurantId: string,
  restaurantSlug: string,
  direction: "up" | "down"
) {
  await requireAdmin();

  const { data: categories, error } = await supabaseAdmin
    .from("categories")
    .select("id, sort_order")
    .eq("restaurant_id", restaurantId)
    .order("sort_order", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  if (!categories) return;

  const index = categories.findIndex((category) => category.id === categoryId);
  const swapIndex = direction === "up" ? index - 1 : index + 1;

  if (index < 0 || swapIndex < 0 || swapIndex >= categories.length) {
    redirect(adminRestaurantPath(restaurantId, "Category order unchanged"));
  }

  const current = categories[index];
  const swap = categories[swapIndex];

  const { error: firstError } = await supabaseAdmin
    .from("categories")
    .update({ sort_order: swap.sort_order })
    .eq("id", current.id);

  if (firstError) {
    throw new Error(firstError.message);
  }

  const { error: secondError } = await supabaseAdmin
    .from("categories")
    .update({ sort_order: current.sort_order })
    .eq("id", swap.id);

  if (secondError) {
    throw new Error(secondError.message);
  }

  revalidatePath(`/admin/restaurants/${restaurantId}`);
  revalidatePath(`/menu/${restaurantSlug}`);
  redirect(adminRestaurantPath(restaurantId, "Category moved"));
}

export async function createMenuItemAction(
  restaurantId: string,
  restaurantSlug: string,
  formData: FormData
) {
  await requireAdmin();

  const categoryId = getString(formData, "category_id");
  const name = getString(formData, "name");
  const description = getString(formData, "description");
  const price = getNumber(formData, "price", 0);

  if (!categoryId || !name) {
    throw new Error("Category and item name are required.");
  }

  const nextSortOrder = await getNextSortOrder("menu_items", "category_id", categoryId);

  const { data: item, error } = await supabaseAdmin
    .from("menu_items")
    .insert({
      restaurant_id: restaurantId,
      category_id: categoryId,
      name,
      description: description || null,
      price,
      image_url: null,
      sort_order: nextSortOrder,
      is_active: true,
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  const imageFile = getFile(formData, "image");

  if (imageFile) {
    const extension = getFileExtension(imageFile);
    const imageUrl = await uploadPublicImage(
      `restaurants/${restaurantSlug}/items/${item.id}.${extension}`,
      imageFile
    );

    const { error: imageError } = await supabaseAdmin
      .from("menu_items")
      .update({ image_url: imageUrl })
      .eq("id", item.id);

    if (imageError) {
      throw new Error(imageError.message);
    }
  }

  revalidatePath(`/admin/restaurants/${restaurantId}`);
  revalidatePath(`/menu/${restaurantSlug}`);
  redirect(adminRestaurantPath(restaurantId, "Item added"));
}

export async function updateMenuItemAction(
  itemId: string,
  restaurantId: string,
  restaurantSlug: string,
  formData: FormData
) {
  await requireAdmin();

  const categoryId = getString(formData, "category_id");
  const name = getString(formData, "name");
  const description = getString(formData, "description");
  const price = getNumber(formData, "price", 0);
  const sortOrder = getNumber(formData, "sort_order", 0);
  const isActive = getBool(formData, "is_active");

  if (!categoryId || !name) {
    throw new Error("Category and item name are required.");
  }

  const imageFile = getFile(formData, "image");
  let imageUrl: string | undefined;

  if (imageFile) {
    const extension = getFileExtension(imageFile);
    imageUrl = await uploadPublicImage(
      `restaurants/${restaurantSlug}/items/${itemId}.${extension}`,
      imageFile
    );
  }

  const updateData: Record<string, unknown> = {
    category_id: categoryId,
    name,
    description: description || null,
    price,
    sort_order: sortOrder,
    is_active: isActive,
    updated_at: new Date().toISOString(),
  };

  if (imageUrl) {
    updateData.image_url = imageUrl;
  }

  const { error } = await supabaseAdmin
    .from("menu_items")
    .update(updateData)
    .eq("id", itemId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(`/admin/restaurants/${restaurantId}`);
  revalidatePath(`/menu/${restaurantSlug}`);
  redirect(adminRestaurantPath(restaurantId, "Item saved"));
}

export async function deleteMenuItemAction(
  itemId: string,
  restaurantId: string,
  restaurantSlug: string
) {
  await requireAdmin();

  const { error } = await supabaseAdmin
    .from("menu_items")
    .delete()
    .eq("id", itemId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(`/admin/restaurants/${restaurantId}`);
  revalidatePath(`/menu/${restaurantSlug}`);
  redirect(adminRestaurantPath(restaurantId, "Item deleted"));
}

export async function moveMenuItemAction(
  itemId: string,
  restaurantId: string,
  restaurantSlug: string,
  categoryId: string,
  direction: "up" | "down"
) {
  await requireAdmin();

  const { data: items, error } = await supabaseAdmin
    .from("menu_items")
    .select("id, sort_order")
    .eq("category_id", categoryId)
    .order("sort_order", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  if (!items) return;

  const index = items.findIndex((item) => item.id === itemId);
  const swapIndex = direction === "up" ? index - 1 : index + 1;

  if (index < 0 || swapIndex < 0 || swapIndex >= items.length) {
    redirect(adminRestaurantPath(restaurantId, "Item order unchanged"));
  }

  const current = items[index];
  const swap = items[swapIndex];

  const { error: firstError } = await supabaseAdmin
    .from("menu_items")
    .update({ sort_order: swap.sort_order })
    .eq("id", current.id);

  if (firstError) {
    throw new Error(firstError.message);
  }

  const { error: secondError } = await supabaseAdmin
    .from("menu_items")
    .update({ sort_order: current.sort_order })
    .eq("id", swap.id);

  if (secondError) {
    throw new Error(secondError.message);
  }

  revalidatePath(`/admin/restaurants/${restaurantId}`);
  revalidatePath(`/menu/${restaurantSlug}`);
  redirect(adminRestaurantPath(restaurantId, "Item moved"));
}
