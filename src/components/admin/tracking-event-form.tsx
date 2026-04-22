"use client";

import { useActionState, useMemo, useState } from "react";

import { updateShipmentStatusAction } from "@/app/(admin)/admin/shipments/actions";
import { createTrackingEventAction } from "@/app/(admin)/admin/tracking-events/actions";
import type {
  AdminActionState,
  AdminShipmentDetail,
  AdminShipmentRow,
} from "@/types/admin";
import {
  getShipmentStatusMeta,
  getShipmentStatusOptions,
  transportModeDefinitions,
  type ShipmentStatus,
  type TransportMode,
} from "@/types/shipment";

export type TrackingEventFormProps = {
  shipments?: AdminShipmentRow[];
  shipment?: Pick<
    AdminShipmentDetail,
    "id" | "trackingNumber" | "status" | "transportMode"
  >;
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

function FieldError({ errors }: { errors?: string[] }) {
  return errors?.[0] ? (
    <p className="text-sm text-rose-600">{errors[0]}</p>
  ) : null;
}

function defaultEventTime() {
  return new Date().toISOString().slice(0, 16);
}

export function TrackingEventForm({
  shipments = [],
  shipment,
  mode,
  title,
  description,
}: TrackingEventFormProps) {
  const [selectedShipmentId, setSelectedShipmentId] = useState(
    shipment?.id ?? "",
  );
  const selectedShipment = useMemo(
    () =>
      shipment ??
      shipments.find((row) => row.id === selectedShipmentId) ??
      null,
    [selectedShipmentId, shipment, shipments],
  );
  const [fallbackTransportMode, setFallbackTransportMode] =
    useState<TransportMode>("road");
  const [status, setStatus] = useState<ShipmentStatus>(
    shipment?.status ?? "in_transit",
  );
  const transportMode =
    selectedShipment?.transportMode ?? fallbackTransportMode;
  const statusOptions = useMemo(
    () => getShipmentStatusOptions(transportMode),
    [transportMode],
  );
  const currentStatusOption =
    !statusOptions.some((option) => option.code === status)
      ? getShipmentStatusMeta(status, {
          mode: transportMode,
        })
      : null;
  const selectedStatusMeta = getShipmentStatusMeta(status, {
    mode: transportMode,
  });
  const action =
    mode === "shipment-status"
      ? updateShipmentStatusAction
      : createTrackingEventAction;
  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <form
      id="tracking-event"
      action={formAction}
      className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div>
        <h2 className="text-xl font-bold tracking-tight text-[#0B1C3A]">
          {title}
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
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
          {shipment ? (
            <>
              <input type="hidden" name="orderId" value={shipment.id} />
              <div className="flex h-12 items-center rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-[#0B1C3A]">
                {shipment.trackingNumber}
              </div>
            </>
          ) : shipments.length > 0 ? (
            <select
              id={`${mode}-orderId`}
              name="orderId"
              className={inputClassName}
              defaultValue=""
              onChange={(event) => {
                const nextShipmentId = event.target.value;
                const nextShipment = shipments.find(
                  (row) => row.id === nextShipmentId,
                );

                setSelectedShipmentId(nextShipmentId);
                setStatus(nextShipment?.status ?? "in_transit");
              }}
            >
              <option value="" disabled>
                Select a shipment
              </option>
              {shipments.map((row) => (
                <option key={row.id} value={row.id}>
                  {row.trackingNumber}
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
            htmlFor={`${mode}-transportMode`}
            className="block text-sm font-semibold text-[#0B1C3A]"
          >
            Transport mode
          </label>
          {selectedShipment ? (
            <>
              <input
                type="hidden"
                name="transportMode"
                value={selectedShipment.transportMode}
              />
              <div className="flex h-12 items-center rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-[#0B1C3A]">
                {
                  transportModeDefinitions.find(
                    (item) => item.code === selectedShipment.transportMode,
                  )?.label
                }
              </div>
            </>
          ) : (
            <select
              id={`${mode}-transportMode`}
              name="transportMode"
              className={inputClassName}
              value={fallbackTransportMode}
              onChange={(event) => {
                const nextMode = event.target.value as TransportMode;

                setFallbackTransportMode(nextMode);

                if (!getShipmentStatusOptions(nextMode).some(
                  (option) => option.code === status,
                )) {
                  setStatus("in_transit");
                }
              }}
            >
              {transportModeDefinitions.map((item) => (
                <option key={item.code} value={item.code}>
                  {item.label}
                </option>
              ))}
            </select>
          )}
        </div>
        <div className="space-y-2">
          <label
            htmlFor={`${mode}-status`}
            className="block text-sm font-semibold text-[#0B1C3A]"
          >
            Resulting shipment status
          </label>
          <select
            id={`${mode}-status`}
            name="status"
            className={inputClassName}
            value={status}
            onChange={(event) => setStatus(event.target.value as ShipmentStatus)}
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
            htmlFor={`${mode}-label`}
            className="block text-sm font-semibold text-[#0B1C3A]"
          >
            Event label
          </label>
          <input
            id={`${mode}-label`}
            name="label"
            className={inputClassName}
            placeholder={selectedStatusMeta.label}
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
            defaultValue={defaultEventTime()}
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
            placeholder="Operations hub"
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
        className="mt-6 inline-flex h-11 items-center justify-center rounded-2xl bg-[#FF6B2B] px-5 text-sm font-semibold text-white transition hover:bg-[#e85f22] focus:outline-none focus:ring-4 focus:ring-[#FF6B2B]/20 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Saving..." : "Save tracking update"}
      </button>
    </form>
  );
}
