"use client"
import React, { useState } from "react";
import { Input } from "@/components/base/input/input";
import { Button } from "@/components/base/buttons/button";

export interface FieldConfig {
    name: string;
    label: string;
    placeholder?: string;
    type?: string;
    isRequired?: boolean;
    hint?: string;
    tooltip?: string;
    defaultValue?: any;
    options?: { label: string; value: string | number }[];
}

interface FormModelProps {
    fields: FieldConfig[];
    onSubmit: (data: any) => void;
    submitLabel?: string;
    title?: string;
    loading?: boolean;
    extraActions?: React.ReactNode;
}

export function FormModel({
    fields,
    onSubmit,
    submitLabel = "Guardar",
    title,
    loading,
    extraActions
}: FormModelProps) {

    const [formData, setFormData] = useState(() => {
        const initial: Record<string, any> = {};
        fields.forEach(f => {
            initial[f.name] = f.defaultValue !== undefined ? f.defaultValue : "";
        });
        return initial;
    });

    const handleChange = (name: string, value: any) => {
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full max-w-lg mx-auto">
            {title && (
                <div className="border-b border-gray-200 pb-3">
                    <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                </div>
            )}

            <div className="flex flex-col gap-4">
                {fields.map((field) => (
                    <div key={field.name} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                        
                        <label className="text-sm font-semibold text-gray-700 sm:w-1/3 shrink-0">
                            {field.label} {field.isRequired && <span className="text-red-500">*</span>}
                        </label>

                        <div className="flex-1 w-full">
                            {field.type === "select" ? (
                                <select
                                    value={formData[field.name]}
                                    onChange={(e) => handleChange(field.name, e.target.value)}
                                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                                    required={field.isRequired}
                                >
                                    <option value="">Seleccione...</option>
                                    {field.options?.map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                            
                                <Input
                                    placeholder={field.placeholder}
                                    type={field.type || "text"}
                                    isRequired={field.isRequired}
                                    value={formData[field.name]}
                                    onChange={(value: string) => handleChange(field.name, value)}
                                    className="w-full"
                                />
                            )}
                            {field.hint && <p className="text-[11px] text-gray-400 mt-1">{field.hint}</p>}
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex items-center justify-end gap-3 pt-6 mt-2 border-t border-gray-100">
                <div className="flex flex-1 sm:flex-none justify-end gap-3">
                    {extraActions}
                    <Button
                        type="submit"
                        isLoading={loading}
                        color="primary"
                        className="px-8 min-w-30"
                    >
                        {submitLabel}
                    </Button>
                </div>
            </div>
        </form>
    );
}