
import { useDateRange } from './dateRangeHook';
import { useChartLogic } from './chartHook';
import { useTableLogic } from './tableHook';
import { useEditLogic } from './modalEditHome';
import { useDeleteLogic } from './modalDeletHome';
import { useEntregaCreate } from './createEntregaHook';
import { usePrintLogic } from './printHook';

export const usePageLogic = () => {
    const dateRange = useDateRange();
    const chart = useChartLogic(dateRange.selectedRange);
    const table = useTableLogic(dateRange.selectedRange);

    const refreshAll = async ()=>{
        await table.refreshTable();
        await chart.refreshChart();
    }

    const edit = useEditLogic(refreshAll);
    const delet = useDeleteLogic(refreshAll);
    const create = useEntregaCreate(refreshAll);
    const print = usePrintLogic( dateRange.selectedRange);

    return {

        ...dateRange,

        chartData: chart.chartData,
        chartOptions: chart.chartOptions,
        chartLoading: chart.loading,

        ...table,
        ...edit,
        ...delet,
        ...create,
        ...print
    };
};
