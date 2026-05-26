"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
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

export async function createRestaurantAction(formData: FormData) {
  await requireAdmin();

  const name = getString(formData, "name");
  const manualSlug = getString(formData, "slug");
  const slug = manualSlug || slugify(name);

  if (!name || !slug) {
    throw new Error("Restaurant name and slug are required.");
  }

  const logoFile = getFile(formData, "logo");
  let logoUrl: string | null = null;

  if (logoFile) {
    const extension = getFileExtension(logoFile);
    logoUrl = await uploadPublicImage(`restaurants/${slug}/logo.${extension}`, logoFile);
  }

  const { data, error } = await supabaseAdmin
    .from("restaurants")
    .insert({
      name,
      slug,
      logo_url: logoUrl,
      is_active: true,
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin");
  redirect(`/admin/restaurants/${data.id}`);
}

export async function updateRestaurantAction(restaurantId: string, formData: FormData) {
  await requireAdmin();

  const name = getString(formData, "name");
  const slug = getString(formData, "slug");
  const isActive = getBool(formData, "is_active");

  if (!name || !slug) {
    throw new Error("Restaurant name and slug are required.");
  }

  const logoFile = getFile(formData, "logo");
  let logoUrl: string | undefined;

  if (logoFile) {
    const extension = getFileExtension(logoFile);
    logoUrl = await uploadPublicImage(`restaurants/${slug}/logo.${extension}`, logoFile);
  }

  const updateData: Record<string, unknown> = {
    name,
    slug,
    is_active: isActive,
  };

  if (logoUrl) {
    updateData.logo_url = logoUrl;
  }

  const { error } = await supabaseAdmin
    .from("restaurants")
    .update(updateData)
    .eq("id", restaurantId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin");
  revalidatePath(`/admin/restaurants/${restaurantId}`);
  revalidatePath(`/menu/${slug}`);
}

export async function deleteRestaurantAction(restaurantId: string) {
  await requireAdmin();

  const { error } = await supabaseAdmin
    .from("restaurants")
    .delete()
    .eq("id", restaurantId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin");
  redirect("/admin");
}
