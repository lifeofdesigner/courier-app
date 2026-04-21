"use client";

import { useActionState } from "react";

import { updateShipmentStatusAction } from "@/app/(admin)/admin/shipments/actions";
import { createTrackingEventAction } from "@/app/(admin)/admin/tracking-events/actions";
import type { AdminActionState, AdminShipmentRow } from "@/types/admin";

export type TrackingEventFormProps = {
  shipments?: AdminShipmentRow[];
  mode: "shipment-status" | "tracking-event";
  title: string;
  description: string;
};

const initialState: AdminActionState = {
  success: false,
  message: "",
};

const inputClassName =
  "h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-[#FF6B2B] focus:ring-4 focus:ring-[#FF6B2B]/15";

const textareaClassName =
  "min-h-28 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#FF6B2B] focus:ring-4 focus:ring-[#FF6B2B]/15";

const statuses = [
  "label_created",
  "picked_up",
  "in_transit",
  "arrived_at_hub",
  "customs_clearance",
  "out_for_delivery",
  "delivered",
  "exception",
];

function FieldError({ errors }: { errors?: string[] }) {
  return errors?.[0] ? (
    <p className="text-sm text-rose-600">{errors[0]}</p>
  ) : null;
}

export function TrackingEventForm({
  shipments = [],
  mode,
  title,
  description,
}: TrackingEventFormProps) {
  const action =
    mode === "shipment-status"
      ? updateShipmentStatusAction
      : createTrackingEventAction;
  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <form
      action={formAction}
      className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm lg:p-8"
    >
      <div>
        <h2 className="text-xl font-bold tracking-tight text-[#0B1C3A]">
          {title}
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
          {description}
        </p>
      </div>

      {state.message ? (
        <div
          className={`mt-5 rounded-2xl border px-4 py-3 text-sm ${
            state.success
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-amber-200 bg-amber-50 text-amber-800"
          }`}
        >
          {state.message}
        </div>
      ) : null}

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <label
            htmlFor={`${mode}-orderId`}
            className="block text-sm font-semibold text-[#0B1C3A]"
          >
            Shipment / order
          </label>
          {shipments.length > 0 ? (
            <select
              id={`${mode}-orderId`}
              name="orderId"
              className={inputClassName}
              defaultValue=""
            >
              <option value="" disabled>
                Select a shipment
              </option>
              {shipments.map((shipment) => (
                <option key={shipment.id} value={shipment.id}>
                  {shipment.trackingNumber} - {shipment.status}
                </option>
              ))}
            </select>
          ) : (
            <input
              id={`${mode}-orderId`}
              name="orderId"
              className={inputClassName}
              placeholder="Order UUID"
            />
          )}
          <FieldError errors={state.fieldErrors?.orderId} />
        </div>
        <div className="space-y-2">
          <label
            htmlFor={`${mode}-status`}
            className="block text-sm font-semibold text-[#0B1C3A]"
          >
            Status
          </label>
          <select
            id={`${mode}-status`}
            name="status"
            className={inputClassName}
            defaultValue="in_transit"
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status.replaceAll("_", " ")}
              </option>
            ))}
          </select>
          <FieldError errors={state.fieldErrors?.status} />
        </div>
        <div className="space-y-2">
          <label
            htmlFor={`${mode}-label`}
            className="block text-sm font-semibold text-[#0B1C3A]"
          >
            Event label
          </label>
          <input
            id={`${mode}-label`}
            name="label"
            className={inputClassName}
            placeholder="Package scanned at hub"
          />
          <FieldError errors={state.fieldErrors?.label} />
        </div>
        <div className="space-y-2">
          <label
            htmlFor={`${mode}-eventTime`}
            className="block text-sm font-semibold text-[#0B1C3A]"
          >
            Event time
          </label>
          <input
            id={`${mode}-eventTime`}
            name="eventTime"
            type="datetime-local"
            className={inputClassName}
          />
          <FieldError errors={state.fieldErrors?.eventTime} />
        </div>
        <div className="space-y-2 md:col-span-2">
          <label
            htmlFor={`${mode}-locationName`}
            className="block text-sm font-semibold text-[#0B1C3A]"
          >
            Location
          </label>
          <input
            id={`${mode}-locationName`}
            name="locationName"
            className={inputClassName}
            placeholder="Dublin operations hub"
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <label
            htmlFor={`${mode}-description`}
            className="block text-sm font-semibold text-[#0B1C3A]"
          >
            Description
          </label>
          <textarea
            id={`${mode}-description`}
            name="description"
            className={textareaClassName}
            placeholder="Short customer-facing tracking note"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="mt-6 inline-flex h-11 items-center justify-center rounded-2xl bg-[#FF6B2B] px-5 text-sm font-semibold text-white transition hover:bg-[#e85f22] focus:outline-none focus:ring-4 focus:ring-[#FF6B2B]/20"
      >
        {isPending ? "Saving..." : "Save tracking update"}
      </button>
    </form>
  );
}
