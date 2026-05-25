"use client";

import { useActionState } from "react";
import type { ReactNode } from "react";
import { Mail, Share2, Clock3, FileText } from "lucide-react";

import { saveFriendlySiteSettingAction } from "@/app/(admin)/admin/settings/actions";
import { useActionToast } from "@/lib/forms/use-action-toast";
import { usePreservedFormValues } from "@/lib/forms/use-preserved-form-values";
import type { AdminActionState } from "@/types/admin";

export type CompanyContactSettings = {
  email: string;
  phone: string;
  address: string;
};

export type SupportHoursSettings = {
  label: string;
};

export type SocialLinksSettings = {
  x: string;
  facebook: string;
  linkedin: string;
};

export type FooterNoticeSettings = {
  text: string;
};

const initialState: AdminActionState = {
  success: false,
  message: "",
};

const inputClassName =
  "h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-[#b0825f] focus:ring-4 focus:ring-[#b0825f]/15";

const textareaClassName =
  "min-h-28 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#b0825f] focus:ring-4 focus:ring-[#b0825f]/15";

function FieldMessage({ state }: { state: AdminActionState }) {
  if (!state.message) {
    return null;
  }

  return (
    <p
      className={`text-sm ${
        state.success ? "text-emerald-700" : "text-amber-700"
      }`}
    >
      {state.message}
    </p>
  );
}

function TextInput({
  label,
  name,
  defaultValue,
  type = "text",
  placeholder,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-semibold text-[#2b1d16]">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className={inputClassName}
      />
    </div>
  );
}

function SettingsCard({
  formType,
  title,
  description,
  icon,
  children,
}: {
  formType: string;
  title: string;
  description: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  const [state, formAction, isPending] = useActionState(
    saveFriendlySiteSettingAction,
    initialState,
  );
  useActionToast(state, {
    successTitle: "Settings saved",
    errorTitle: "Settings could not be saved",
  });
  const formRef = usePreservedFormValues(state.values);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm"
    >
      <input type="hidden" name="formType" value={formType} />
      <div className="flex items-start gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#f4ede7] text-[#8f6848]">
          {icon}
        </span>
        <div>
          <h3 className="font-heading text-xl font-bold tracking-tight text-[#2b1d16]">
            {title}
          </h3>
          <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2">{children}</div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex h-11 items-center justify-center rounded-2xl bg-[#b0825f] px-5 text-sm font-semibold text-white transition hover:bg-[#9a704f] focus:outline-none focus:ring-4 focus:ring-[#b0825f]/20"
        >
          {isPending ? "Saving..." : "Save changes"}
        </button>
        <FieldMessage state={state} />
      </div>
    </form>
  );
}

export function CompanyContactSettingsForm({
  settings,
}: {
  settings: CompanyContactSettings;
}) {
  return (
    <SettingsCard
      formType="companyContact"
      title="Company contact"
      description="Contact details shown across the public website."
      icon={<Mail aria-hidden="true" className="h-5 w-5" />}
    >
      <TextInput
        label="Support email"
        name="email"
        type="email"
        defaultValue={settings.email}
        placeholder="support@example.com"
      />
      <TextInput
        label="Support phone"
        name="phone"
        defaultValue={settings.phone}
        placeholder="+1 (800) 555-0188"
      />
      <div className="md:col-span-2">
        <label
          htmlFor="address"
          className="block text-sm font-semibold text-[#2b1d16]"
        >
          Company address
        </label>
        <textarea
          id="address"
          name="address"
          defaultValue={settings.address}
          placeholder="Street, city, state, postal code"
          className={`${textareaClassName} mt-2`}
        />
      </div>
    </SettingsCard>
  );
}

export function SupportHoursSettingsForm({
  settings,
}: {
  settings: SupportHoursSettings;
}) {
  return (
    <SettingsCard
      formType="supportHours"
      title="Business hours"
      description="Hours customers see when they need help or pickup support."
      icon={<Clock3 aria-hidden="true" className="h-5 w-5" />}
    >
      <div className="md:col-span-2">
        <TextInput
          label="Operating hours"
          name="label"
          defaultValue={settings.label}
          placeholder="Monday-Friday, 8:00 AM-7:00 PM"
        />
      </div>
    </SettingsCard>
  );
}

export function SocialLinksSettingsForm({
  settings,
}: {
  settings: SocialLinksSettings;
}) {
  return (
    <SettingsCard
      formType="socialLinks"
      title="Social links"
      description="Optional social profile URLs used in public site areas."
      icon={<Share2 aria-hidden="true" className="h-5 w-5" />}
    >
      <TextInput
        label="X / Twitter URL"
        name="x"
        type="url"
        defaultValue={settings.x}
        placeholder="https://x.com/yourcompany"
      />
      <TextInput
        label="Facebook URL"
        name="facebook"
        type="url"
        defaultValue={settings.facebook}
        placeholder="https://facebook.com/yourcompany"
      />
      <div className="md:col-span-2">
        <TextInput
          label="LinkedIn URL"
          name="linkedin"
          type="url"
          defaultValue={settings.linkedin}
          placeholder="https://linkedin.com/company/yourcompany"
        />
      </div>
    </SettingsCard>
  );
}

export function FooterNoticeSettingsForm({
  settings,
}: {
  settings: FooterNoticeSettings;
}) {
  return (
    <SettingsCard
      formType="footerNotice"
      title="Footer message"
      description="Short trust or service message displayed in the website footer."
      icon={<FileText aria-hidden="true" className="h-5 w-5" />}
    >
      <div className="md:col-span-2">
        <label
          htmlFor="text"
          className="block text-sm font-semibold text-[#2b1d16]"
        >
          Footer message
        </label>
        <textarea
          id="text"
          name="text"
          defaultValue={settings.text}
          placeholder="A short customer-facing service message."
          className={`${textareaClassName} mt-2`}
        />
      </div>
    </SettingsCard>
  );
}
