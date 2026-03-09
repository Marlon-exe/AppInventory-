import { useReportRange } from "./reportHook";
import { useTableLogic } from "./tableHook";
import { usePrintLogic } from "./printHook";

export const useReportLogic = () => {
    const dateRange = useReportRange();
    const table = useTableLogic(dateRange.selectedRange);
    const print = usePrintLogic(dateRange.selectedRange);

    return{
        ...dateRange,
        ...table,
        ...print,
    };
};
