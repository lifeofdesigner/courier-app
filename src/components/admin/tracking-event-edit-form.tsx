"use client";

import { useActionState } from "react";

import { updateTrackingEventAction } from "@/app/(admin)/admin/tracking-events/actions";
import { useActionToast } from "@/lib/forms/use-action-toast";
import { usePreservedFormValues } from "@/lib/forms/use-preserved-form-values";
import type { AdminActionState, AdminTrackingEventRow } from "@/types/admin";
import {
  getShipmentStatusMeta,
  getShipmentStatusOptions,
  type TransportMode,
} from "@/types/shipment";

export type TrackingEventEditFormProps = {
  event: AdminTrackingEventRow;
  transportMode: TransportMode;
};

const initialState: AdminActionState = {
  success: false,
  message: "",
};

const inputClassName =
  "h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-[#b0825f] focus:ring-4 focus:ring-[#b0825f]/15";

const textareaClassName =
  "min-h-24 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#b0825f] focus:ring-4 focus:ring-[#b0825f]/15";

function FieldError({ errors }: { errors?: string[] }) {
  return errors?.[0] ? (
    <p className="text-sm text-rose-600">{errors[0]}</p>
  ) : null;
}

function formatDateTimeInput(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString().slice(0, 16);
}

export function TrackingEventEditForm({
  event,
  transportMode,
}: TrackingEventEditFormProps) {
  const [state, formAction, isPending] = useActionState(
    updateTrackingEventAction,
    initialState,
  );
  useActionToast(state, {
    successTitle: "Tracking event updated",
    errorTitle: "Tracking event update failed",
  });
  const formRef = usePreservedFormValues(state.values);
  const statusOptions = getShipmentStatusOptions(transportMode);
  const currentStatusOption = statusOptions.some(
    (option) => option.code === event.status,
  )
    ? null
    : getShipmentStatusMeta(event.status, { mode: transportMode });

  return (
    <details className="mt-4 rounded-2xl border border-slate-200 bg-white">
      <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-[#2b1d16] transition hover:bg-slate-50">
        Edit timeline event
      </summary>
      <form
        ref={formRef}
        action={formAction}
        className="border-t border-slate-100 p-4"
      >
        <input type="hidden" name="eventId" value={event.id} />
        <input type="hidden" name="orderId" value={event.orderId} />
        <input type="hidden" name="transportMode" value={transportMode} />

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label
              htmlFor={`status-${event.id}`}
              className="block text-sm font-semibold text-[#2b1d16]"
            >
              Status
            </label>
            <select
              id={`status-${event.id}`}
              name="status"
              defaultValue={event.status}
              className={inputClassName}
            >
              {currentStatusOption ? (
                <option value={currentStatusOption.code}>
                  {currentStatusOption.label}
                </option>
              ) : null}
              {statusOptions.map((status) => (
                <option key={status.code} value={status.code}>
                  {status.label}
                </option>
              ))}
            </select>
            <FieldError errors={state.fieldErrors?.status} />
          </div>
          <div className="space-y-2">
            <label
              htmlFor={`eventTime-${event.id}`}
              className="block text-sm font-semibold text-[#2b1d16]"
            >
              Event time
            </label>
            <input
              id={`eventTime-${event.id}`}
              name="eventTime"
              type="datetime-local"
              defaultValue={formatDateTimeInput(event.eventTime)}
              className={inputClassName}
            />
            <FieldError errors={state.fieldErrors?.eventTime} />
          </div>
          <div className="space-y-2">
            <label
              htmlFor={`label-${event.id}`}
              className="block text-sm font-semibold text-[#2b1d16]"
            >
              Event label
            </label>
            <input
              id={`label-${event.id}`}
              name="label"
              defaultValue={event.label}
              className={inputClassName}
            />
            <FieldError errors={state.fieldErrors?.label} />
          </div>
          <div className="space-y-2">
            <label
              htmlFor={`locationName-${event.id}`}
              className="block text-sm font-semibold text-[#2b1d16]"
            >
              Location
            </label>
            <input
              id={`locationName-${event.id}`}
              name="locationName"
              defaultValue={event.locationName ?? ""}
              className={inputClassName}
            />
            <FieldError errors={state.fieldErrors?.locationName} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label
              htmlFor={`description-${event.id}`}
              className="block text-sm font-semibold text-[#2b1d16]"
            >
              Description
            </label>
            <textarea
              id={`description-${event.id}`}
              name="description"
              defaultValue={event.description ?? ""}
              className={textareaClassName}
            />
            <FieldError errors={state.fieldErrors?.description} />
          </div>
        </div>

        {state.message ? (
          <div
            className={`mt-4 rounded-2xl border px-4 py-3 text-sm ${
              state.success
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-amber-200 bg-amber-50 text-amber-800"
            }`}
          >
            {state.message}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={isPending}
          className="mt-4 inline-flex h-10 items-center justify-center rounded-2xl bg-[#b0825f] px-4 text-sm font-semibold text-white transition hover:bg-[#9a704f] focus:outline-none focus:ring-4 focus:ring-[#b0825f]/20 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Saving..." : "Save event changes"}
        </button>
      </form>
    </details>
  );
}
