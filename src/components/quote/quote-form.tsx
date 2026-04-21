"use client";

import { useActionState } from "react";

import {
  calculateQuoteAction,
  type QuoteActionState,
} from "@/app/(public)/quote/actions";
import { QuoteBreakdownCard } from "@/components/quote/quote-breakdown-card";
import { QuoteResultState } from "@/components/quote/quote-result-state";
import { QuoteSummaryCard } from "@/components/quote/quote-summary-card";

const initialState: QuoteActionState = {
  success: false,
  message: "",
};

const inputClassName =
  "h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-[#FF6B2B] focus:ring-4 focus:ring-[#FF6B2B]/15";

const selectClassName =
  "h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-[#FF6B2B] focus:ring-4 focus:ring-[#FF6B2B]/15";

const primaryButtonClassName =
  "inline-flex h-12 items-center justify-center rounded-2xl bg-[#FF6B2B] px-5 text-sm font-semibold text-white transition hover:bg-[#e85f22] focus:outline-none focus:ring-4 focus:ring-[#FF6B2B]/20 disabled:cursor-not-allowed disabled:opacity-60";

export type QuoteFormProps = {
  isConfigured: boolean;
};

function FieldError({ errors }: { errors?: string[] }) {
  return errors?.[0] ? (
    <p className="text-sm text-rose-600">{errors[0]}</p>
  ) : null;
}

export function QuoteForm({ isConfigured }: QuoteFormProps) {
  const [state, formAction, isPending] = useActionState(
    calculateQuoteAction,
    initialState,
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_0.75fr]">
      <form
        action={formAction}
        className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="space-y-5">
          {!isConfigured ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              Supabase is not configured yet. Add the public environment
              variables and run the Phase 4 migration to enable quotes.
            </div>
          ) : null}
          <QuoteResultState state={state} />

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <label
                htmlFor="fullName"
                className="block text-sm font-semibold text-[#0B1C3A]"
              >
                Full name
              </label>
              <input id="fullName" name="fullName" className={inputClassName} />
              <FieldError errors={state.fieldErrors?.fullName} />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-[#0B1C3A]"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className={inputClassName}
              />
              <FieldError errors={state.fieldErrors?.email} />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="originCountry"
                className="block text-sm font-semibold text-[#0B1C3A]"
              >
                Origin country
              </label>
              <input
                id="originCountry"
                name="originCountry"
                className={inputClassName}
                placeholder="Ireland"
              />
              <FieldError errors={state.fieldErrors?.originCountry} />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="originCity"
                className="block text-sm font-semibold text-[#0B1C3A]"
              >
                Origin city
              </label>
              <input
                id="originCity"
                name="originCity"
                className={inputClassName}
                placeholder="Dublin"
              />
              <FieldError errors={state.fieldErrors?.originCity} />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="destinationCountry"
                className="block text-sm font-semibold text-[#0B1C3A]"
              >
                Destination country
              </label>
              <input
                id="destinationCountry"
                name="destinationCountry"
                className={inputClassName}
                placeholder="Germany"
              />
              <FieldError errors={state.fieldErrors?.destinationCountry} />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="destinationCity"
                className="block text-sm font-semibold text-[#0B1C3A]"
              >
                Destination city
              </label>
              <input
                id="destinationCity"
                name="destinationCity"
                className={inputClassName}
                placeholder="Berlin"
              />
              <FieldError errors={state.fieldErrors?.destinationCity} />
            </div>
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
                defaultValue="Express"
              >
                <option value="Express">Express</option>
                <option value="Economy">Economy</option>
              </select>
              <FieldError errors={state.fieldErrors?.serviceType} />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="packageType"
                className="block text-sm font-semibold text-[#0B1C3A]"
              >
                Package type
              </label>
              <input
                id="packageType"
                name="packageType"
                className={inputClassName}
                placeholder="Parcel"
              />
              <FieldError errors={state.fieldErrors?.packageType} />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="weightKg"
                className="block text-sm font-semibold text-[#0B1C3A]"
              >
                Weight in kg
              </label>
              <input
                id="weightKg"
                name="weightKg"
                type="number"
                min="0.1"
                step="0.1"
                className={inputClassName}
              />
              <FieldError errors={state.fieldErrors?.weightKg} />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="declaredValue"
                className="block text-sm font-semibold text-[#0B1C3A]"
              >
                Declared value
              </label>
              <input
                id="declaredValue"
                name="declaredValue"
                type="number"
                min="0"
                step="0.01"
                defaultValue="0"
                className={inputClassName}
              />
              <FieldError errors={state.fieldErrors?.declaredValue} />
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending || !isConfigured}
            className={primaryButtonClassName}
          >
            {isPending ? "Calculating..." : "Calculate quote"}
          </button>
        </div>
      </form>

      <div className="space-y-5">
        {state.quote && state.breakdown ? (
          <>
            <QuoteSummaryCard quote={state.quote} breakdown={state.breakdown} />
            <QuoteBreakdownCard breakdown={state.breakdown} />
          </>
        ) : (
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold tracking-tight text-[#0B1C3A]">
              Quote preview
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Enter shipment details to see the matched pricing zone, fuel
              surcharge, and total in EUR.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
