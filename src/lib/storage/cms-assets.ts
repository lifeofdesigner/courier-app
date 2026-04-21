import { assertAdminAction } from "@/lib/auth/assert-admin-action";

const CMS_ASSETS_BUCKET = "cms-assets";

function sanitizeSegment(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_/]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^[-/]+|[-/]+$/g, "");
}

function sanitizeFilename(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function uploadCmsAsset({
  file,
  folder,
}: {
  file: File;
  folder: string;
}) {
  const { supabase } = await assertAdminAction();
  const safeFolder = sanitizeSegment(folder || "homepage/general");
  const safeFilename = sanitizeFilename(file.name || "asset");
  const path = `${safeFolder}/${Date.now()}-${safeFilename}`;

  const { error } = await supabase.storage
    .from(CMS_ASSETS_BUCKET)
    .upload(path, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type || undefined,
    });

  if (error) {
    throw new Error("The CMS asset could not be uploaded.");
  }

  const { data } = supabase.storage.from(CMS_ASSETS_BUCKET).getPublicUrl(path);

  return {
    path,
    publicUrl: data.publicUrl,
  };
}
