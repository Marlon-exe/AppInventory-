"use client"
import { useState } from "react";
import { getLocalTimeZone, today } from "@internationalized/date";
import { DateRangePicker } from "./date-range-picker"; 
import type { DateValue } from "react-aria-components";

const now = today(getLocalTimeZone());

interface Props {
    value: { start: DateValue; end: DateValue } | null;
    onChange: (value: { start: DateValue; end: DateValue } | null) => void;
}

export const DateRangePickerControlled = ({ value, onChange }: Props) => {
    const isInvalidDate = (date: DateValue) => {
        const day = date.toDate(getLocalTimeZone()).getDay();
        return day === 0 || day === 6;
    };

    return (
        <DateRangePicker 
            aria-label="Filtro de semana" 
            shouldCloseOnSelect={false} 
            value={value} 
            onChange={onChange}
            isDateUnavailable={isInvalidDate}
        />
    );
};