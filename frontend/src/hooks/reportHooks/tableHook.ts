import { useState, useEffect } from 'react';
import { EntregasService } from '@/src/api/services/entregaService';

interface DateRange {
    start: { toString: () => string };
    end: { toString: () => string };
}

export const useTableLogic = (selectedRange: DateRange) => {
    const [tableData, setTableData] = useState<any[]>([]);
    const [tablePage, setTablePage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const refreshTable = async (page: number = tablePage) => {
        try {
            const inicio = selectedRange.start.toString();
            const fin = selectedRange.end.toString();
            const res = await EntregasService.getAll(page, 10, inicio, fin);
            setTableData(res.registros);
            setTotalPages(res.paginas);
        } catch (error) {
            console.error("Error cargando tabla:", error);
        }
    };

    useEffect(() => {
        setTablePage(1);
    }, [selectedRange]);

    useEffect(() => {
        refreshTable(tablePage);
    }, [selectedRange, tablePage]);

    return {
        tableData,
        tablePage,
        totalPages,
        setTablePage,
        refreshTable,
    };
};
