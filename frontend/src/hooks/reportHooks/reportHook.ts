import { useState } from "react";
import { isWeekend } from "@internationalized/date";
import { useLocale } from "@react-aria/i18n";
import { getInitialWorkWeek } from "@/src/utils/dateUtils";

export const useReportRange = () => {
    const { locale } = useLocale();
    const [selectedRange, setSelecRange] = useState(getInitialWorkWeek(locale));

    const isDateUnavailable = (date: any) => isWeekend(date, locale);

    const handleRangeChange = (range: any) => {
        if (!range?.start) return;
        setSelecRange(range)
    };

    return {
        locale,
        selectedRange,
        isDateUnavailable,
        handleRangeChange,
    };
};