"use client"
import { ChartGrafic } from "@/src/componets/ui/chartPrime";
import { DateRangePickerFetch } from "@/src/componets/ui/rangePicker";
import { TableBase } from "@/src/componets/ui/table";
import { Button } from "@heroui/react";
import { EntregasModals } from "./entregasModal";
import { PDFModal } from "@/src/componets/ui/pdfModal";

const COLUMNS = [
  { key: 'fecha', label: 'Fecha' },
  { key: 'producto', label: 'Producto' },
  { key: 'cantidad', label: 'Cantidad' },
  { key: 'quien_retiro', label: 'Retirado por' },
  { key: 'quien_entrega', label: 'Entregado por' },
  { key: 'departamento', label: 'Departamento' },
];

export const EntregasView = ({ logic }: { logic: any }) => {
  return (
    <div className="flex flex-col gap-3 p-2">
      <div className="grid w-full grid-cols-1 gap-5 p-2">
        <div className="flex justify-between items-center">
          <Button color="primary" onPress={logic.handleCreateOpen}>
            + Nueva entrega
          </Button>
          <DateRangePickerFetch
            className="w-70"
            isDateUnavailable={logic.isDateUnavailable}
            value={logic.selectedRange}
            onChange={logic.handleRangeChange}
          />
        </div>
        <ChartGrafic
          data={logic.chartData}
          options={logic.chartOptions}
          className="h-full w-full shadow-lg rounded-lg bg-content1 pb-4"
          height="320px"
        />

      </div>

      <section className="px-6 pb-6">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center px-1">
            <h2 className="text-xl font-semibold">Detalle de Registros</h2>
            <Button color="primary" onPress={logic.handleImprimir}>
              🖨 Imprimir
            </Button>
          </div>
          <div className="bg-content1 p-6 rounded-3xl shadow-xl border border-divider">
            <TableBase
              columns={COLUMNS}
              rows={logic.tableData}
              rowKey="id_producto_entregado"
              page={logic.tablePage}
              totalPages={logic.totalPages}
              onPageChange={logic.setTablePage}
              onEdit={logic.handleEdit}
              onDelete={logic.handleDelete}
            />
          </div>
        </div>
      </section>

      <EntregasModals logic={logic} />

      <PDFModal
        isOpen={logic.isPdfOpen}
        onClose={() => logic.setIsPdfOpen(false)}
        pdfUrl={logic.pdfUrl}
      />
    </div>
  );
};