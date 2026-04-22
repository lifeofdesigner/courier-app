"use client";

import Link from "next/link";
import type { ChangeEventHandler, ReactNode } from "react";
import { useActionState, useCallback, useMemo, useState } from "react";

import { createShipmentAction } from "@/app/(admin)/admin/shipments/actions";
import { CustomerLookupField } from "@/components/admin/customer-lookup-field";
import type { PreservedFormValues } from "@/lib/forms/preserve";
import { useActionToast } from "@/lib/forms/use-action-toast";
import { usePreservedFormValues } from "@/lib/forms/use-preserved-form-values";
import type { AdminActionState, CustomerSearchResult } from "@/types/admin";
import { formatPaymentStatus, paymentStatuses } from "@/types/payment";
import {
  getDefaultModeAwareServiceType,
  getModeAwareServiceMeta,
  getModeAwareServiceOptions,
  getShipmentStatusOptions,
  getTransportModeMeta,
  normalizeModeAwareServiceType,
  normalizeShipmentStatus,
  normalizeTransportMode,
  type ModeAwareServiceType,
  type ShipmentStatus,
  transportModeDefinitions,
  type TransportMode,
} from "@/types/shipment";

const initialState: AdminActionState = {
  success: false,
  message: "",
};

const inputClassName =
  "h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-[#b0825f] focus:ring-4 focus:ring-[#b0825f]/15";

const textareaClassName =
  "min-h-28 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#b0825f] focus:ring-4 focus:ring-[#b0825f]/15";

const primaryButtonClassName =
  "inline-flex h-11 items-center justify-center rounded-2xl bg-[#b0825f] px-5 text-sm font-semibold text-white transition hover:bg-[#9a704f] focus:outline-none focus:ring-4 focus:ring-[#b0825f]/20 disabled:cursor-not-allowed disabled:opacity-60";

const secondaryButtonClassName =
  "inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-[#2b1d16] transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-200";

function FieldError({ errors }: { errors?: string[] }) {
  return errors?.[0] ? (
    <p className="text-sm text-rose-600">{errors[0]}</p>
  ) : null;
}

function TextInput({
  label,
  name,
  type = "text",
  placeholder,
  defaultValue,
  value,
  onChange,
  errors,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  defaultValue?: string | number;
  value?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  errors?: string[];
}) {
  const valueProps =
    value === undefined ? { defaultValue } : { value, onChange };

  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-semibold text-[#2b1d16]">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        step={type === "number" ? "0.01" : undefined}
        className={inputClassName}
        {...valueProps}
      />
      <FieldError errors={errors} />
    </div>
  );
}

function FormSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold tracking-tight text-[#2b1d16]">
        {title}
      </h2>
      <div className="mt-5 grid gap-5 md:grid-cols-2">{children}</div>
    </section>
  );
}

function AddressFields({
  prefix,
  errors,
}: {
  prefix: "pickup" | "delivery";
  errors?: Record<string, string[]>;
}) {
  const titlePrefix = prefix === "pickup" ? "Pickup" : "Delivery";

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
        label={`${titlePrefix} address line 1`}
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

function packagePlaceholder(mode: TransportMode) {
  if (mode === "air") {
    return "Documents, parcel, or air cargo";
  }

  if (mode === "freight") {
    return "Pallet, crate, or consolidated freight";
  }

  return "Parcel, satchel, or multi-piece shipment";
}

export function CreateShipmentForm() {
  const [transportMode, setTransportMode] = useState<TransportMode>("road");
  const [serviceType, setServiceType] = useState<ModeAwareServiceType>(
    getDefaultModeAwareServiceType("road"),
  );
  const [shipmentStatus, setShipmentStatus] =
    useState<ShipmentStatus>("shipment_created");
  const [senderName, setSenderName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [senderPhone, setSenderPhone] = useState("");
  const [state, formAction, isPending] = useActionState(
    createShipmentAction,
    initialState,
  );
  useActionToast(state, {
    successTitle: "Shipment created",
    errorTitle: "Shipment could not be created",
  });
  const serviceOptions = useMemo(
    () => getModeAwareServiceOptions(transportMode),
    [transportMode],
  );
  const statusOptions = useMemo(
    () => getShipmentStatusOptions(transportMode),
    [transportMode],
  );
  const transportModeMeta = getTransportModeMeta(transportMode);
  const serviceMeta = getModeAwareServiceMeta(serviceType, {
    mode: transportMode,
  });
  const statusMeta = statusOptions.find(
    (status) => status.code === shipmentStatus,
  );
  const selectedCustomerFromState = useMemo<CustomerSearchResult | null>(() => {
    const values = state.values;

    if (!values?.selectedCustomerId) {
      return null;
    }

    return {
      id: values.selectedCustomerId,
      fullName: values.selectedCustomerLabel || null,
      email: values.selectedCustomerEmail || null,
      phone: values.selectedCustomerPhone || null,
      role: "customer",
    };
  }, [state.values]);
  const restoreControlledValues = useCallback((values: PreservedFormValues) => {
    const nextMode = normalizeTransportMode(values.transportMode);
    const nextServiceType = normalizeModeAwareServiceType(
      values.serviceType ?? getDefaultModeAwareServiceType(nextMode),
      { mode: nextMode },
    );
    const nextStatus = normalizeShipmentStatus(
      values.shipmentStatus ?? "shipment_created",
      { mode: nextMode },
    );

    setTransportMode(nextMode);
    setServiceType(nextServiceType);
    setShipmentStatus(nextStatus);
    setSenderName(values.senderName ?? "");
    setSenderEmail(values.senderEmail ?? "");
    setSenderPhone(values.senderPhone ?? "");
  }, []);
  const formRef = usePreservedFormValues(
    state.values,
    restoreControlledValues,
  );

  function handleTransportModeChange(nextMode: TransportMode) {
    const nextServiceType = getDefaultModeAwareServiceType(nextMode);

    setTransportMode(nextMode);
    setServiceType(nextServiceType);

    if (!getShipmentStatusOptions(nextMode).some(
      (status) => status.code === shipmentStatus,
    )) {
      setShipmentStatus("shipment_created");
    }
  }

  function handleCustomerChange(customer: CustomerSearchResult | null) {
    if (!customer) {
      return;
    }

    setSenderName(customer.fullName ?? "");
    setSenderEmail(customer.email ?? "");
    setSenderPhone(customer.phone ?? "");
  }

  return (
    <form ref={formRef} action={formAction} className="space-y-6">
      {state.message ? (
        <div
          className={`rounded-2xl border px-4 py-3 text-sm ${
            state.success
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-amber-200 bg-amber-50 text-amber-800"
          }`}
        >
          <p>{state.message}</p>
          {state.success && state.createdShipmentId ? (
            <div className="mt-3 flex flex-wrap gap-2">
              <Link
                href={`/admin/shipments/${state.createdShipmentId}`}
                className={secondaryButtonClassName}
              >
                Manage shipment
              </Link>
              {state.createdTrackingNumber ? (
                <Link
                  href={`/track?tracking=${state.createdTrackingNumber}`}
                  className={secondaryButtonClassName}
                >
                  Public tracking
                </Link>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}

      <FormSection title="Customer">
        <div className="md:col-span-2">
          <CustomerLookupField
            key={selectedCustomerFromState?.id ?? "empty-customer-lookup"}
            onCustomerChange={handleCustomerChange}
            fieldError={state.fieldErrors?.selectedCustomerId}
            initialSelectedCustomer={selectedCustomerFromState}
          />
        </div>
      </FormSection>

      <FormSection title="Shipment details">
        <div className="space-y-2">
          <label
            htmlFor="transportMode"
            className="block text-sm font-semibold text-[#2b1d16]"
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
          <p className="text-xs leading-5 text-slate-500">
            {transportModeMeta.description}
          </p>
          <FieldError errors={state.fieldErrors?.transportMode} />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="serviceType"
            className="block text-sm font-semibold text-[#2b1d16]"
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
            {serviceOptions.map((service) => (
              <option key={service.code} value={service.code}>
                {service.label}
              </option>
            ))}
          </select>
          <p className="text-xs leading-5 text-slate-500">
            {serviceMeta.description}
          </p>
          <FieldError errors={state.fieldErrors?.serviceType} />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="shipmentStatus"
            className="block text-sm font-semibold text-[#2b1d16]"
          >
            Shipment status
          </label>
          <select
            id="shipmentStatus"
            name="shipmentStatus"
            className={inputClassName}
            value={shipmentStatus}
            onChange={(event) =>
              setShipmentStatus(event.target.value as ShipmentStatus)
            }
          >
            {statusOptions.map((status) => (
              <option key={status.code} value={status.code}>
                {status.label}
              </option>
            ))}
          </select>
          <p className="text-xs leading-5 text-slate-500">
            {statusMeta?.description ??
              "Choose the initial operational milestone for this shipment."}
          </p>
        </div>
        <div className="space-y-2">
          <label
            htmlFor="paymentStatus"
            className="block text-sm font-semibold text-[#2b1d16]"
          >
            Payment status
          </label>
          <select
            id="paymentStatus"
            name="paymentStatus"
            className={inputClassName}
            defaultValue="unpaid"
          >
            {paymentStatuses.map((status) => (
              <option key={status} value={status}>
                {formatPaymentStatus(status)}
              </option>
            ))}
          </select>
        </div>
      </FormSection>

      <FormSection title="Sender and recipient">
        <TextInput
          label="Sender name"
          name="senderName"
          value={senderName}
          onChange={(event) => setSenderName(event.target.value)}
          errors={state.fieldErrors?.senderName}
        />
        <TextInput
          label="Sender email"
          name="senderEmail"
          type="email"
          value={senderEmail}
          onChange={(event) => setSenderEmail(event.target.value)}
          errors={state.fieldErrors?.senderEmail}
        />
        <TextInput
          label="Sender phone"
          name="senderPhone"
          value={senderPhone}
          onChange={(event) => setSenderPhone(event.target.value)}
        />
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
      </FormSection>

      <FormSection title="Pickup address">
        <AddressFields prefix="pickup" errors={state.fieldErrors} />
      </FormSection>

      <FormSection title="Delivery address">
        <AddressFields prefix="delivery" errors={state.fieldErrors} />
      </FormSection>

      <FormSection title="Package and schedule">
        <TextInput
          label="Package type"
          name="packageType"
          placeholder={packagePlaceholder(transportMode)}
          errors={state.fieldErrors?.packageType}
        />
        <TextInput
          label="Weight"
          name="weightKg"
          type="number"
          placeholder="2.5"
          errors={state.fieldErrors?.weightKg}
        />
        <TextInput
          label="Declared value"
          name="declaredValue"
          type="number"
          defaultValue="0"
          errors={state.fieldErrors?.declaredValue}
        />
        <div className="space-y-2">
          <label
            htmlFor="currency"
            className="block text-sm font-semibold text-[#2b1d16]"
          >
            Currency
          </label>
          <select
            id="currency"
            name="currency"
            className={inputClassName}
            defaultValue="EUR"
          >
            <option value="EUR">EUR</option>
            <option value="USD">USD</option>
            <option value="GBP">GBP</option>
            <option value="NGN">NGN</option>
          </select>
          <FieldError errors={state.fieldErrors?.currency} />
        </div>
        <TextInput
          label="Pickup date"
          name="pickupDate"
          type="date"
          errors={state.fieldErrors?.pickupDate}
        />
        <div className="space-y-2">
          <label
            htmlFor="pickupWindow"
            className="block text-sm font-semibold text-[#2b1d16]"
          >
            Pickup window
          </label>
          <select
            id="pickupWindow"
            name="pickupWindow"
            className={inputClassName}
            defaultValue=""
          >
            <option value="" disabled>
              Select a window
            </option>
            <option value="Morning, 8 AM-12 PM">Morning, 8 AM-12 PM</option>
            <option value="Afternoon, 12 PM-4 PM">Afternoon, 12 PM-4 PM</option>
            <option value="Evening, 4 PM-7 PM">Evening, 4 PM-7 PM</option>
          </select>
          <FieldError errors={state.fieldErrors?.pickupWindow} />
        </div>
        <div className="space-y-2 md:col-span-2">
          <label
            htmlFor="specialInstructions"
            className="block text-sm font-semibold text-[#2b1d16]"
          >
            Special instructions
          </label>
          <textarea
            id="specialInstructions"
            name="specialInstructions"
            className={textareaClassName}
            placeholder="Access notes, handoff requirements, or handling instructions"
          />
        </div>
      </FormSection>

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={isPending}
          className={primaryButtonClassName}
        >
          {isPending ? "Creating..." : "Create shipment"}
        </button>
        <Link href="/admin/shipments" className={secondaryButtonClassName}>
          Back to shipments
        </Link>
      </div>
    </form>
  );
}
