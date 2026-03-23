import { today, getLocalTimeZone, getDayOfWeek, isWeekend } from "@internationalized/date";

export const getInitialWorkWeek = (locale: string = "es-ES") => {
    const now = today(getLocalTimeZone());

    const dayNumber = getDayOfWeek(now, locale);

    const diffLunes = dayNumber === 0 ? 6 : dayNumber - 1;

    const start = now.subtract({ days: diffLunes });
    const end = start.add({ days: 4 })
    return { start, end };
}

export const checkIsWeekend = (date: any, locale: string = "es-ES") => {
    return isWeekend(date, locale);
};
