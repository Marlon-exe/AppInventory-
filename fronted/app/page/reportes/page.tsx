"use client"
import { useReportLogic } from "@/src/hooks/reportHooks/reporteLogic";
import { DateRangePickerFetch } from "@/src/componets/ui/rangePicker";
import { TableBase } from "@/src/componets/ui/table";
import { PDFModal } from "@/src/componets/ui/pdfModal";
import { Button } from "@heroui/react";

const COLUMNS = [
    { key: 'fecha', label: 'Fecha' },
    { key: 'producto', label: 'Producto' },
    { key: 'cantidad', label: 'Cantidad' },
    { key: 'quien_retiro', label: 'Retirado por' },
    { key: 'quien_entrega', label: 'Entregado por' },
    { key: 'departamento', label: 'Departamento' },
];

export default function ReportePage() {
    const {
        selectedRange,
        isDateUnavailable,
        handleRangeChange,
        tableData,
        tablePage,
        totalPages,
        setTablePage,
        isPdfOpen,
        setIsPdfOpen,
        pdfUrl,
        handleImprimir,
    } = useReportLogic();

    return (
       <div className="flex flex-col gap-4 p-6 w-full">
    <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Reportes</h2>
        <div className="flex flex-col gap-2 items-end">
            <DateRangePickerFetch
                className="w-70"
                isDateUnavailable={isDateUnavailable}
                value={selectedRange}
                onChange={handleRangeChange}
                visibleMonths={2}
            />
            <Button color="primary" onPress={handleImprimir}>
                🖨 Imprimir
            </Button>
        </div>
    </div>

            <div className="bg-content1 p-6 rounded-3xl shadow-xl border border-divider">
                <TableBase
                    columns={COLUMNS}
                    rows={tableData}
                    rowKey="id_producto_entregado"
                    page={tablePage}
                    totalPages={totalPages}
                    onPageChange={setTablePage}
                />
            </div>

            <PDFModal
                isOpen={isPdfOpen}
                onClose={() => setIsPdfOpen(false)}
                pdfUrl={pdfUrl}
            />
        </div>
    );
}