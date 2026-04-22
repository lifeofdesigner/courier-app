"use client";

import Link from "next/link";
import { Clipboard, ExternalLink, FileText } from "lucide-react";
import { useActionState, useMemo, useState } from "react";

import { updateShipmentStatusOnlyAction } from "@/app/(admin)/admin/shipments/actions";
import type { AdminActionState, AdminShipmentDetail } from "@/types/admin";
import {
  getDefaultModeAwareServiceType,
  getModeAwareServiceMeta,
  getModeAwareServiceOptions,
  getShipmentStatusMeta,
  getShipmentStatusOptions,
  transportModeDefinitions,
  type ModeAwareServiceType,
  type ShipmentStatus,
  type TransportMode,
} from "@/types/shipment";

export type ShipmentActionsCardProps = {
  shipment: AdminShipmentDetail;
};

const initialState: AdminActionState = {
  success: false,
  message: "",
};

const inputClassName =
  "h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-[#FF6B2B] focus:ring-4 focus:ring-[#FF6B2B]/15";

const primaryButtonClassName =
  "inline-flex h-11 items-center justify-center rounded-2xl bg-[#FF6B2B] px-5 text-sm font-semibold text-white transition hover:bg-[#e85f22] focus:outline-none focus:ring-4 focus:ring-[#FF6B2B]/20 disabled:cursor-not-allowed disabled:opacity-60";

const secondaryButtonClassName =
  "inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-[#0B1C3A] transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-200";

export function ShipmentActionsCard({ shipment }: ShipmentActionsCardProps) {
  const [transportMode, setTransportMode] = useState<TransportMode>(
    shipment.transportMode,
  );
  const [serviceType, setServiceType] = useState<ModeAwareServiceType>(
    shipment.serviceType,
  );
  const [status, setStatus] = useState<ShipmentStatus>(shipment.status);
  const [state, formAction, isPending] = useActionState(
    updateShipmentStatusOnlyAction,
    initialState,
  );
  const [copyMessage, setCopyMessage] = useState("");
  const serviceOptions = useMemo(
    () => getModeAwareServiceOptions(transportMode),
    [transportMode],
  );
  const statusOptions = useMemo(
    () => getShipmentStatusOptions(transportMode),
    [transportMode],
  );
  const serviceMeta = getModeAwareServiceMeta(serviceType, {
    mode: transportMode,
  });
  const currentStatusOption = statusOptions.some(
    (option) => option.code === status,
  )
    ? null
    : getShipmentStatusMeta(status, { mode: transportMode });

  async function copyTrackingNumber() {
    await navigator.clipboard.writeText(shipment.trackingNumber);
    setCopyMessage("Tracking number copied.");
    window.setTimeout(() => setCopyMessage(""), 2500);
  }

  function handleTransportModeChange(nextMode: TransportMode) {
    setTransportMode(nextMode);
    setServiceType(getDefaultModeAwareServiceType(nextMode));

    if (!getShipmentStatusOptions(nextMode).some(
      (option) => option.code === status,
    )) {
      setStatus("shipment_created");
    }
  }

  return (
    <section className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold tracking-tight text-[#0B1C3A]">
        Operational actions
      </h2>

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

      <form action={formAction} className="mt-5 space-y-3">
        <input type="hidden" name="orderId" value={shipment.id} />
        <label
          htmlFor="transportMode"
          className="block text-sm font-semibold text-[#0B1C3A]"
        >
          Transport mode
        </label>
        <select
          id="transportMode"
          name="transportMode"
          className={inputClassName}
          value={transportMode}
          onChange={(event) =>
            handleTransportModeChange(event.target.value as TransportMode)
          }
        >
          {transportModeDefinitions.map((mode) => (
            <option key={mode.code} value={mode.code}>
              {mode.label}
            </option>
          ))}
        </select>
        <label
          htmlFor="serviceType"
          className="block text-sm font-semibold text-[#0B1C3A]"
        >
          Service type
        </label>
        <select
          id="serviceType"
          name="serviceType"
          className={inputClassName}
          value={serviceType}
          onChange={(event) =>
            setServiceType(event.target.value as ModeAwareServiceType)
          }
        >
          {serviceOptions.some(
            (service) => service.code === serviceType,
          ) ? null : (
            <option value={serviceMeta.code}>{serviceMeta.label}</option>
          )}
          {serviceOptions.map((service) => (
            <option key={service.code} value={service.code}>
              {service.label}
            </option>
          ))}
        </select>
        <p className="text-xs leading-5 text-slate-500">
          {serviceMeta.description}
        </p>
        <label
          htmlFor="status"
          className="block text-sm font-semibold text-[#0B1C3A]"
        >
          Update shipment status
        </label>
        <select
          id="status"
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
        <button
          type="submit"
          disabled={isPending}
          className={primaryButtonClassName}
        >
          {isPending ? "Updating..." : "Update status"}
        </button>
      </form>

      <div className="mt-5 grid gap-2">
        <button
          type="button"
          onClick={copyTrackingNumber}
          className={secondaryButtonClassName}
        >
          <Clipboard aria-hidden="true" className="h-4 w-4" />
          Copy tracking number
        </button>
        <Link
          href={`/track?tracking=${shipment.trackingNumber}`}
          className={secondaryButtonClassName}
        >
          <ExternalLink aria-hidden="true" className="h-4 w-4" />
          Open public tracking
        </Link>
        {shipment.labelUrl ? (
          <Link href={shipment.labelUrl} className={secondaryButtonClassName}>
            <FileText aria-hidden="true" className="h-4 w-4" />
            Print label
          </Link>
        ) : (
          <span className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 px-5 text-sm font-semibold text-slate-500">
            Label pending
          </span>
        )}
      </div>

      {copyMessage ? (
        <p className="mt-3 text-sm font-semibold text-emerald-700">
          {copyMessage}
        </p>
      ) : null}
    </section>
  );
}
