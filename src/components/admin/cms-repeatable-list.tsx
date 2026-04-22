"use client";

import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";

type RepeatableValue = string | boolean | number | undefined | null;

export type CmsRepeatableField = {
  name: string;
  label: string;
  type?: "checkbox" | "select" | "text" | "textarea";
  placeholder?: string;
  options?: {
    label: string;
    value: string;
  }[];
};

export type CmsRepeatableListProps = {
  label: string;
  name: string;
  items: Record<string, RepeatableValue>[];
  fields: CmsRepeatableField[];
  addLabel: string;
  emptyItem: Record<string, RepeatableValue>;
  helpText?: string;
};

type RepeatableRow = {
  id: string;
  values: Record<string, RepeatableValue>;
};

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function normalizeValue(value: RepeatableValue) {
  return typeof value === "boolean" ? value : String(value ?? "");
}

export function CmsRepeatableList({
  label,
  name,
  items,
  fields,
  addLabel,
  emptyItem,
  helpText,
}: CmsRepeatableListProps) {
  const [rows, setRows] = useState<RepeatableRow[]>(() => {
    const initialItems = items.length > 0 ? items : [emptyItem];

    return initialItems.map((item, index) => ({
      id: `initial-${name}-${index}`,
      values: item,
    }));
  });

  return (
    <fieldset className="rounded-[24px] border border-slate-200 bg-white p-4">
      <legend className="px-2 text-sm font-semibold text-[#0B1C3A]">
        {label}
      </legend>
      {helpText ? <p className="mt-2 text-xs leading-5 text-slate-500">{helpText}</p> : null}
      <input type="hidden" name={`${name}.__count`} value={rows.length} />
      <div className="mt-4 space-y-4">
        {rows.map((row, index) => (
          <div
            key={row.id}
            className="rounded-[20px] border border-slate-200 bg-slate-50/70 p-4"
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="text-sm font-bold text-[#0B1C3A]">Item {index + 1}</p>
              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={rows.length === 1}
                aria-label={`Remove ${label} item ${index + 1}`}
                onClick={() => {
                  setRows((currentRows) =>
                    currentRows.filter((currentRow) => currentRow.id !== row.id),
                  );
                }}
              >
                <Trash2 aria-hidden="true" className="h-4 w-4" />
              </button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {fields.map((field) => {
                const fieldName = `${name}.${index}.${field.name}`;
                const fieldValue = normalizeValue(row.values[field.name]);

                if (field.type === "textarea") {
                  return (
                    <div key={field.name} className="space-y-2 md:col-span-2">
                      <label
                        htmlFor={fieldName}
                        className="block text-sm font-semibold text-[#0B1C3A]"
                      >
                        {field.label}
                      </label>
                      <textarea
                        id={fieldName}
                        name={fieldName}
                        value={String(fieldValue)}
                        placeholder={field.placeholder}
                        className="min-h-28 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#FF6B2B] focus:ring-4 focus:ring-[#FF6B2B]/15"
                        onChange={(event) => {
                          const nextValue = event.target.value;

                          setRows((currentRows) =>
                            currentRows.map((currentRow) =>
                              currentRow.id === row.id
                                ? {
                                    ...currentRow,
                                    values: {
                                      ...currentRow.values,
                                      [field.name]: nextValue,
                                    },
                                  }
                                : currentRow,
                            ),
                          );
                        }}
                      />
                    </div>
                  );
                }

                if (field.type === "select") {
                  return (
                    <div key={field.name} className="space-y-2">
                      <label
                        htmlFor={fieldName}
                        className="block text-sm font-semibold text-[#0B1C3A]"
                      >
                        {field.label}
                      </label>
                      <select
                        id={fieldName}
                        name={fieldName}
                        value={String(fieldValue)}
                        className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-[#FF6B2B] focus:ring-4 focus:ring-[#FF6B2B]/15"
                        onChange={(event) => {
                          const nextValue = event.target.value;

                          setRows((currentRows) =>
                            currentRows.map((currentRow) =>
                              currentRow.id === row.id
                                ? {
                                    ...currentRow,
                                    values: {
                                      ...currentRow.values,
                                      [field.name]: nextValue,
                                    },
                                  }
                                : currentRow,
                            ),
                          );
                        }}
                      >
                        {field.options?.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  );
                }

                if (field.type === "checkbox") {
                  return (
                    <label
                      key={field.name}
                      className="flex h-12 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-[#0B1C3A]"
                    >
                      <input
                        name={fieldName}
                        type="checkbox"
                        value="true"
                        checked={Boolean(row.values[field.name])}
                        className="h-4 w-4 rounded border-slate-300 text-[#FF6B2B] focus:ring-[#FF6B2B]"
                        onChange={(event) => {
                          const nextValue = event.target.checked;

                          setRows((currentRows) =>
                            currentRows.map((currentRow) =>
                              currentRow.id === row.id
                                ? {
                                    ...currentRow,
                                    values: {
                                      ...currentRow.values,
                                      [field.name]: nextValue,
                                    },
                                  }
                                : currentRow,
                            ),
                          );
                        }}
                      />
                      {field.label}
                    </label>
                  );
                }

                return (
                  <div key={field.name} className="space-y-2">
                    <label
                      htmlFor={fieldName}
                      className="block text-sm font-semibold text-[#0B1C3A]"
                    >
                      {field.label}
                    </label>
                    <input
                      id={fieldName}
                      name={fieldName}
                      value={String(fieldValue)}
                      placeholder={field.placeholder}
                      className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-[#FF6B2B] focus:ring-4 focus:ring-[#FF6B2B]/15"
                      onChange={(event) => {
                        const nextValue = event.target.value;

                        setRows((currentRows) =>
                          currentRows.map((currentRow) =>
                            currentRow.id === row.id
                              ? {
                                  ...currentRow,
                                  values: {
                                    ...currentRow.values,
                                    [field.name]: nextValue,
                                  },
                                }
                              : currentRow,
                          ),
                        );
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        className="mt-4 inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-[#0B1C3A] transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-200"
        onClick={() => {
          setRows((currentRows) => [
            ...currentRows,
            {
              id: createId(),
              values: emptyItem,
            },
          ]);
        }}
      >
        <Plus aria-hidden="true" className="mr-2 h-4 w-4" />
        {addLabel}
      </button>
    </fieldset>
  );
}
