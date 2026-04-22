"use client";

import { useState } from "react";
import Image from "next/image";

import type { CmsImage } from "@/types/cms";

export type CmsImageFieldProps = {
  label: string;
  name: string;
  defaultImage?: CmsImage;
  helpText?: string;
  accept?: string;
  allowRemove?: boolean;
};

export function CmsImageField({
  label,
  name,
  defaultImage,
  helpText,
  accept = "image/*",
  allowRemove = true,
}: CmsImageFieldProps) {
  const [previewUrl, setPreviewUrl] = useState(defaultImage?.src ?? "");
  const [assetUrl, setAssetUrl] = useState(defaultImage?.src ?? "");
  const [isRemoved, setIsRemoved] = useState(false);

  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        <div className="relative flex aspect-[16/9] w-full max-w-sm items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
          {previewUrl && !isRemoved ? (
            <Image
              src={previewUrl}
              alt={defaultImage?.alt ?? label}
              fill
              sizes="(max-width: 768px) 100vw, 320px"
              className="object-cover"
              unoptimized
            />
          ) : (
            <span className="px-5 text-center text-sm font-medium text-slate-500">
              No image selected
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1 space-y-4">
          <div>
            <label
              htmlFor={`${name}.file`}
              className="block text-sm font-semibold text-[#0B1C3A]"
            >
              {label}
            </label>
            {helpText ? (
              <p className="mt-1 text-xs leading-5 text-slate-500">{helpText}</p>
            ) : null}
          </div>
          <input type="hidden" name={name} value={isRemoved ? "" : assetUrl} />
          <input
            type="hidden"
            name={`${name}.remove`}
            value={isRemoved ? "true" : "false"}
          />
          <input
            id={`${name}.file`}
            name={`${name}.file`}
            type="file"
            accept={accept}
            className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition file:mr-4 file:rounded-xl file:border-0 file:bg-slate-100 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-[#0B1C3A] focus:border-[#FF6B2B] focus:ring-4 focus:ring-[#FF6B2B]/15"
            onChange={(event) => {
              const file = event.target.files?.[0];

              if (!file) {
                return;
              }

              setPreviewUrl(URL.createObjectURL(file));
              setAssetUrl("");
              setIsRemoved(false);
            }}
          />
          <div className="space-y-2">
            <label
              htmlFor={`${name}.alt`}
              className="block text-sm font-semibold text-[#0B1C3A]"
            >
              Image description
            </label>
            <input
              id={`${name}.alt`}
              name={`${name}.alt`}
              defaultValue={defaultImage?.alt ?? ""}
              className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-[#FF6B2B] focus:ring-4 focus:ring-[#FF6B2B]/15"
            />
          </div>
          {allowRemove ? (
            <button
              type="button"
              className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-[#0B1C3A] transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-200"
              onClick={() => {
                setPreviewUrl("");
                setAssetUrl("");
                setIsRemoved(true);
              }}
            >
              Remove image
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
