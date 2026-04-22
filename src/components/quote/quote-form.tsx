"use client";

import type { ReactNode } from "react";
import { useActionState, useCallback, useMemo, useState } from "react";

import {
  calculateQuoteAction,
  type QuoteActionState,
} from "@/app/(public)/quote/actions";
import { QuoteBreakdownCard } from "@/components/quote/quote-breakdown-card";
import { QuoteResultState } from "@/components/quote/quote-result-state";
import { QuoteSummaryCard } from "@/components/quote/quote-summary-card";
import type { PreservedFormValues } from "@/lib/forms/preserve";
import { useActionToast } from "@/lib/forms/use-action-toast";
import { usePreservedFormValues } from "@/lib/forms/use-preserved-form-values";
import {
  getDefaultModeAwareServiceType,
  getModeAwareServiceMeta,
  getModeAwareServiceOptions,
  getTransportModeMeta,
  getTransportModePublicCopy,
  normalizeModeAwareServiceType,
  normalizeTransportMode,
  transportModeDefinitions,
  type ModeAwareServiceType,
  type TransportMode,
} from "@/types/shipment";

const initialState: QuoteActionState = {
  success: false,
  message: "",
};

const formSectionClassName =
  "rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm";

const inputClassName =
  "h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-[#FF6B2B] focus:ring-4 focus:ring-[#FF6B2B]/15";

const selectClassName =
  "h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-[#FF6B2B] focus:ring-4 focus:ring-[#FF6B2B]/15";

const primaryButtonClassName =
  "inline-flex h-11 items-center justify-center rounded-2xl bg-[#FF6B2B] px-5 text-sm font-semibold text-white transition hover:bg-[#e85f22] focus:outline-none focus:ring-4 focus:ring-[#FF6B2B]/20 disabled:cursor-not-allowed disabled:opacity-60";

const modeOptionClassName =
  "rounded-[20px] border border-slate-200 bg-white p-4 text-left transition hover:border-[#FF6B2B] hover:bg-orange-50";

const selectedModeOptionClassName =
  "border-[#FF6B2B] bg-orange-50 ring-2 ring-[#FF6B2B]/10";

export type QuoteFormProps = {
  isConfigured: boolean;
  initialTransportMode?: TransportMode;
};

function FieldError({ errors }: { errors?: string[] }) {
  return errors?.[0] ? (
    <p className="text-sm text-rose-600">{errors[0]}</p>
  ) : null;
}

function FormSection({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className={formSectionClassName}>
      <p className="text-xs font-bold uppercase tracking-wide text-[#FF6B2B]">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-xl font-bold tracking-tight text-[#0B1C3A]">
        {title}
      </h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function TextInput({
  label,
  name,
  type = "text",
  placeholder,
  defaultValue,
  min,
  step,
  errors,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  defaultValue?: string;
  min?: string;
  step?: string;
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
        defaultValue={defaultValue}
        min={min}
        step={step}
        className={inputClassName}
      />
      <FieldError errors={errors} />
    </div>
  );
}

export function QuoteForm({
  isConfigured,
  initialTransportMode = "road",
}: QuoteFormProps) {
  const normalizedInitialMode = normalizeTransportMode(initialTransportMode);
  const [transportMode, setTransportMode] = useState<TransportMode>(
    normalizedInitialMode,
  );
  const [serviceType, setServiceType] = useState<ModeAwareServiceType>(
    getDefaultModeAwareServiceType(normalizedInitialMode),
  );
  const [state, formAction, isPending] = useActionState(
    calculateQuoteAction,
    initialState,
  );
  useActionToast(state, {
    successTitle: "Quote calculated",
    errorTitle: "Quote needs attention",
  });
  const serviceOptions = useMemo(
    () => getModeAwareServiceOptions(transportMode),
    [transportMode],
  );
  const modeMeta = getTransportModeMeta(transportMode);
  const modeCopy = getTransportModePublicCopy(transportMode);
  const serviceMeta = getModeAwareServiceMeta(serviceType, {
    mode: transportMode,
  });
  const restoreControlledValues = useCallback((values: PreservedFormValues) => {
    const nextMode = normalizeTransportMode(values.transportMode);
    const nextServiceType = normalizeModeAwareServiceType(
      values.serviceType ?? getDefaultModeAwareServiceType(nextMode),
      { mode: nextMode },
    );

    setTransportMode(nextMode);
    setServiceType(nextServiceType);
  }, []);
  const formRef = usePreservedFormValues(
    state.values,
    restoreControlledValues,
  );

  function handleModeChange(nextMode: TransportMode) {
    setTransportMode(nextMode);
    setServiceType(getDefaultModeAwareServiceType(nextMode));
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_0.75fr]">
      <form ref={formRef} action={formAction} className="space-y-6">
        <input type="hidden" name="transportMode" value={transportMode} />
        {!isConfigured ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Supabase is not configured yet. Add the public environment
            variables and run the Phase 4 migration to enable quotes.
          </div>
        ) : null}
        <QuoteResultState state={state} />

        <FormSection eyebrow="Step 1" title="Choose transport mode">
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
        </FormSection>

        <FormSection
          eyebrow="Step 2"
          title={`Select ${modeMeta.label.toLowerCase()} service`}
        >
          <div className="grid gap-5 md:grid-cols-[0.9fr_1.1fr]">
            <div className="space-y-2">
              <label
                htmlFor="serviceType"
                className="block text-sm font-semibold text-[#0B1C3A]"
              >
                Service type
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
              <p className="font-semibold text-[#0B1C3A]">
                {serviceMeta.label}
              </p>
              <p className="mt-1">{serviceMeta.description}</p>
            </div>
          </div>
        </FormSection>

        <FormSection eyebrow="Step 3" title={modeCopy.quoteTitle}>
          <p className="max-w-2xl text-sm leading-7 text-slate-600">
            {modeCopy.quoteLead}
          </p>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <TextInput
              label="Full name"
              name="fullName"
              errors={state.fieldErrors?.fullName}
            />
            <TextInput
              label="Email"
              name="email"
              type="email"
              errors={state.fieldErrors?.email}
            />
            <TextInput
              label="Origin country"
              name="originCountry"
              placeholder="Ireland"
              errors={state.fieldErrors?.originCountry}
            />
            <TextInput
              label={modeCopy.originLabel}
              name="originCity"
              placeholder={transportMode === "air" ? "Dublin Airport" : "Dublin"}
              errors={state.fieldErrors?.originCity}
            />
            <TextInput
              label="Destination country"
              name="destinationCountry"
              placeholder="Germany"
              errors={state.fieldErrors?.destinationCountry}
            />
            <TextInput
              label={modeCopy.destinationLabel}
              name="destinationCity"
              placeholder={
                transportMode === "air" ? "Berlin Brandenburg Airport" : "Berlin"
              }
              errors={state.fieldErrors?.destinationCity}
            />
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
              min="0.1"
              step="0.1"
              errors={state.fieldErrors?.weightKg}
            />
            <TextInput
              label={modeCopy.declaredValueLabel}
              name="declaredValue"
              type="number"
              min="0"
              step="0.01"
              defaultValue="0"
              errors={state.fieldErrors?.declaredValue}
            />
          </div>
        </FormSection>

        <button
          type="submit"
          disabled={isPending || !isConfigured}
          className={primaryButtonClassName}
        >
          {isPending ? "Calculating..." : "Calculate quote"}
        </button>
      </form>

      <div className="space-y-5">
        {state.quote && state.breakdown ? (
          <>
            <QuoteSummaryCard quote={state.quote} breakdown={state.breakdown} />
            <QuoteBreakdownCard breakdown={state.breakdown} />
          </>
        ) : (
          <div className="rounded-[24px] border border-[#0B1C3A]/10 bg-[#0B1C3A] p-6 text-white shadow-sm">
            <p className="text-sm font-bold uppercase tracking-wide text-[#FF6B2B]">
              Quote preview
            </p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight">
              {modeCopy.quoteTitle}
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-200">
              {modeCopy.quoteLead}
            </p>
            <dl className="mt-6 grid gap-4 text-sm text-slate-200">
              <div>
                <dt className="font-semibold text-white">Transport mode</dt>
                <dd className="mt-1">{modeMeta.label}</dd>
              </div>
              <div>
                <dt className="font-semibold text-white">Service type</dt>
                <dd className="mt-1">{serviceMeta.label}</dd>
              </div>
              <div>
                <dt className="font-semibold text-white">Pricing</dt>
                <dd className="mt-1">
                  Active pricing rules match by service tier, lane zone, and
                  shipment weight.
                </dd>
              </div>
            </dl>
          </div>
        )}
      </div>
    </div>
  );
}
