"use client";

import type { ReactNode } from "react";
import { useActionState, useMemo, useState } from "react";

import {
  createBookingAction,
  type BookingActionState,
} from "@/app/(public)/book/actions";
import { BookingSuccessCard } from "@/components/booking/booking-success-card";
import { BookingSummaryCard } from "@/components/booking/booking-summary-card";
import {
  getDefaultModeAwareServiceType,
  getModeAwareServiceMeta,
  getModeAwareServiceOptions,
  getTransportModeMeta,
  getTransportModePublicCopy,
  isModeAwareServiceTypeForMode,
  normalizeModeAwareServiceType,
  normalizeTransportMode,
  transportModeDefinitions,
  type ModeAwareServiceType,
  type TransportMode,
} from "@/types/shipment";

const initialState: BookingActionState = {
  success: false,
  message: "",
};

const formSectionClassName =
  "rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm";

const inputClassName =
  "h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-[#FF6B2B] focus:ring-4 focus:ring-[#FF6B2B]/15";

const textareaClassName =
  "min-h-28 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#FF6B2B] focus:ring-4 focus:ring-[#FF6B2B]/15";

const selectClassName =
  "h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-[#FF6B2B] focus:ring-4 focus:ring-[#FF6B2B]/15";

const primaryButtonClassName =
  "inline-flex h-11 items-center justify-center rounded-2xl bg-[#FF6B2B] px-5 text-sm font-semibold text-white transition hover:bg-[#e85f22] focus:outline-none focus:ring-4 focus:ring-[#FF6B2B]/20 disabled:cursor-not-allowed disabled:opacity-60";

const modeOptionClassName =
  "rounded-[20px] border border-slate-200 bg-white p-4 text-left transition hover:border-[#FF6B2B] hover:bg-orange-50";

const selectedModeOptionClassName =
  "border-[#FF6B2B] bg-orange-50 ring-2 ring-[#FF6B2B]/10";

export type BookingFormProps = {
  isConfigured: boolean;
  quoteId?: string;
  initialTransportMode?: string;
  initialServiceType?: string;
};

function FieldError({ errors }: { errors?: string[] }) {
  return errors?.[0] ? (
    <p className="text-sm text-rose-600">{errors[0]}</p>
  ) : null;
}

function initialServiceTypeForMode(
  mode: TransportMode,
  serviceType?: string,
): ModeAwareServiceType {
  if (!serviceType) {
    return getDefaultModeAwareServiceType(mode);
  }

  const normalizedServiceType = normalizeModeAwareServiceType(serviceType, {
    mode,
  });

  return isModeAwareServiceTypeForMode(normalizedServiceType, mode)
    ? normalizedServiceType
    : getDefaultModeAwareServiceType(mode);
}

function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className={formSectionClassName}>
      <h2 className="text-xl font-bold tracking-tight text-[#0B1C3A]">
        {title}
      </h2>
      {description ? (
        <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
          {description}
        </p>
      ) : null}
      <div className="mt-5 grid gap-5 md:grid-cols-2">{children}</div>
    </section>
  );
}

function TextInput({
  label,
  name,
  type = "text",
  placeholder,
  errors,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  errors?: string[];
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-semibold text-[#0B1C3A]">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        step={type === "number" ? "0.01" : undefined}
        className={inputClassName}
      />
      <FieldError errors={errors} />
    </div>
  );
}

function AddressFields({
  prefix,
  errors,
}: {
  prefix: "pickup" | "delivery";
  errors?: Record<string, string[]>;
}) {
  return (
    <>
      <TextInput
        label="Contact name"
        name={`${prefix}.contactName`}
        errors={errors?.[`${prefix}.contactName`]}
      />
      <TextInput label="Company" name={`${prefix}.companyName`} />
      <TextInput label="Phone" name={`${prefix}.phone`} />
      <TextInput
        label="Email"
        name={`${prefix}.email`}
        type="email"
        errors={errors?.[`${prefix}.email`]}
      />
      <TextInput
        label="Address line 1"
        name={`${prefix}.line1`}
        errors={errors?.[`${prefix}.line1`]}
      />
      <TextInput label="Address line 2" name={`${prefix}.line2`} />
      <TextInput
        label="City"
        name={`${prefix}.city`}
        errors={errors?.[`${prefix}.city`]}
      />
      <TextInput label="State / region" name={`${prefix}.stateRegion`} />
      <TextInput label="Postal code" name={`${prefix}.postalCode`} />
      <TextInput
        label="Country"
        name={`${prefix}.country`}
        errors={errors?.[`${prefix}.country`]}
      />
    </>
  );
}

export function BookingForm({
  isConfigured,
  quoteId,
  initialTransportMode,
  initialServiceType,
}: BookingFormProps) {
  const normalizedInitialMode = normalizeTransportMode(initialTransportMode);
  const [transportMode, setTransportMode] = useState<TransportMode>(
    normalizedInitialMode,
  );
  const [serviceType, setServiceType] = useState<ModeAwareServiceType>(
    initialServiceTypeForMode(normalizedInitialMode, initialServiceType),
  );
  const [state, formAction, isPending] = useActionState(
    createBookingAction,
    initialState,
  );
  const serviceOptions = useMemo(
    () => getModeAwareServiceOptions(transportMode),
    [transportMode],
  );
  const modeMeta = getTransportModeMeta(transportMode);
  const modeCopy = getTransportModePublicCopy(transportMode);
  const serviceMeta = getModeAwareServiceMeta(serviceType, {
    mode: transportMode,
  });

  function handleModeChange(nextMode: TransportMode) {
    setTransportMode(nextMode);
    setServiceType(getDefaultModeAwareServiceType(nextMode));
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_0.42fr] lg:items-start">
      <form action={formAction} className="space-y-6">
        {quoteId ? <input type="hidden" name="quoteId" value={quoteId} /> : null}
        <input type="hidden" name="transportMode" value={transportMode} />

        {!isConfigured ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Supabase is not configured yet. Add the public environment variables
            and run the Phase 4 migration to enable booking requests.
          </div>
        ) : null}

        {state.message ? (
          <div
            className={`rounded-2xl border px-4 py-3 text-sm ${
              state.success
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-amber-200 bg-amber-50 text-amber-800"
            }`}
          >
            {state.message}
          </div>
        ) : null}

        {state.booking ? <BookingSuccessCard booking={state.booking} /> : null}

        <FormSection
          title="Transport mode"
          description="Choose how this shipment should move so the service list and booking language match operations."
        >
          <div className="md:col-span-2">
            <div className="grid gap-3 md:grid-cols-3">
              {transportModeDefinitions.map((mode) => {
                const isSelected = mode.code === transportMode;

                return (
                  <button
                    key={mode.code}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => handleModeChange(mode.code)}
                    className={`${modeOptionClassName} ${
                      isSelected ? selectedModeOptionClassName : ""
                    }`}
                  >
                    <span className="block text-sm font-bold text-[#0B1C3A]">
                      {mode.label}
                    </span>
                    <span className="mt-2 block text-xs leading-5 text-slate-600">
                      {mode.description}
                    </span>
                  </button>
                );
              })}
            </div>
            <FieldError errors={state.fieldErrors?.transportMode} />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="serviceType"
              className="block text-sm font-semibold text-[#0B1C3A]"
            >
              {modeMeta.label} service type
            </label>
            <select
              id="serviceType"
              name="serviceType"
              className={selectClassName}
              value={serviceType}
              onChange={(event) =>
                setServiceType(event.target.value as ModeAwareServiceType)
              }
            >
              {serviceOptions.map((service) => (
                <option key={service.code} value={service.code}>
                  {service.label}
                </option>
              ))}
            </select>
            <FieldError errors={state.fieldErrors?.serviceType} />
          </div>
          <div className="rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-600">
            <p className="font-semibold text-[#0B1C3A]">{serviceMeta.label}</p>
            <p className="mt-1">{serviceMeta.description}</p>
          </div>
        </FormSection>

        <FormSection title={modeCopy.bookingTitle} description={modeCopy.bookingLead}>
          <TextInput
            label="Sender name"
            name="senderName"
            errors={state.fieldErrors?.senderName}
          />
          <TextInput
            label="Sender email"
            name="senderEmail"
            type="email"
            errors={state.fieldErrors?.senderEmail}
          />
          <TextInput label="Sender phone" name="senderPhone" />
          <TextInput
            label="Recipient name"
            name="recipientName"
            errors={state.fieldErrors?.recipientName}
          />
          <TextInput
            label="Recipient email"
            name="recipientEmail"
            type="email"
            errors={state.fieldErrors?.recipientEmail}
          />
          <TextInput label="Recipient phone" name="recipientPhone" />
          <TextInput
            label={modeCopy.packageLabel}
            name="packageType"
            placeholder={modeCopy.packagePlaceholder}
            errors={state.fieldErrors?.packageType}
          />
          <TextInput
            label="Weight in kg"
            name="weightKg"
            type="number"
            errors={state.fieldErrors?.weightKg}
          />
          <TextInput
            label={modeCopy.declaredValueLabel}
            name="declaredValue"
            type="number"
            errors={state.fieldErrors?.declaredValue}
          />
          <TextInput
            label="Pickup date"
            name="pickupDate"
            type="date"
            errors={state.fieldErrors?.pickupDate}
          />
          <div className="space-y-2">
            <label
              htmlFor="pickupWindow"
              className="block text-sm font-semibold text-[#0B1C3A]"
            >
              Pickup window
            </label>
            <select
              id="pickupWindow"
              name="pickupWindow"
              className={selectClassName}
              defaultValue=""
            >
              <option value="" disabled>
                Select a window
              </option>
              <option value="Morning, 8 AM-12 PM">Morning, 8 AM-12 PM</option>
              <option value="Afternoon, 12 PM-4 PM">
                Afternoon, 12 PM-4 PM
              </option>
              <option value="Evening, 4 PM-7 PM">Evening, 4 PM-7 PM</option>
            </select>
            <FieldError errors={state.fieldErrors?.pickupWindow} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label
              htmlFor="specialInstructions"
              className="block text-sm font-semibold text-[#0B1C3A]"
            >
              Special instructions
            </label>
            <textarea
              id="specialInstructions"
              name="specialInstructions"
              className={textareaClassName}
              placeholder={modeCopy.specialInstructionsPlaceholder}
            />
          </div>
        </FormSection>

        <FormSection title={modeCopy.pickupHeading}>
          <AddressFields prefix="pickup" errors={state.fieldErrors} />
        </FormSection>

        <FormSection title={modeCopy.deliveryHeading}>
          <AddressFields prefix="delivery" errors={state.fieldErrors} />
        </FormSection>

        <button
          type="submit"
          disabled={isPending || !isConfigured}
          className={primaryButtonClassName}
        >
          {isPending ? "Submitting..." : modeCopy.bookingSubmitLabel}
        </button>
      </form>

      <BookingSummaryCard
        transportMode={transportMode}
        serviceType={serviceType}
      />
    </div>
  );
}
