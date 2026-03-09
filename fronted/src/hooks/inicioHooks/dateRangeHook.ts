import { useState } from "react";
import { isWeekend, getDayOfWeek } from "@internationalized/date";
import { useLocale } from "@react-aria/i18n";
import { getInitialWorkWeek } from '@/src/utils/dateUtils';

export const useDateRange= () =>{
    const { locale } = useLocale();
   const [selectedRange, setSelectedRange] = useState(getInitialWorkWeek(locale));

    const isDateUnavailable = (date: any) => isWeekend(date, locale);

    const handleRangeChange = (range: any) => {
        if (!range?.start) return;
        const dayNumber = getDayOfWeek(range.start, locale);
        const diffLunes = dayNumber === 0 ? 6 : dayNumber - 1;
        const lunes = range.start.subtract({ days: diffLunes });
        const viernes = lunes.add({ days: 4 });
        setSelectedRange({ start: lunes, end: viernes });
    };

    return {
        locale,
        selectedRange,
        setSelectedRange,
        isDateUnavailable,
        handleRangeChange,
    };
};