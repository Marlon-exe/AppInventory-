"use client"

import { DateRangePicker } from "@heroui/react";
import { I18nProvider } from "@react-aria/i18n";

interface RangePickerProps {
    value: {
        start: any;
        end: any;
    };
    onChange: (value: any) => void;
    isDateUnavailable: (date: any) => boolean;
    label?: string;
    className?: string;
    visibleMonths?: 1 | 2 | 3;
}

export const DateRangePickerFetch = ({
    value,
    onChange,
    isDateUnavailable,
    label = "Seleccione las fechas",
    className = "max-w-xs",
    visibleMonths = 1,
}: RangePickerProps) => {
    return (
        <I18nProvider locale="es-ES">
            <DateRangePicker
                aria-label={label}
                label={label}
                className={className}
                variant="bordered"
                value={value}
                onChange={onChange}
                isDateUnavailable={isDateUnavailable}
                visibleMonths={visibleMonths}
                allowsNonContiguousRanges
                calendarProps={{
                    showMonthAndYearPickers: true,
                }}
            />
        </I18nProvider>
    );
};