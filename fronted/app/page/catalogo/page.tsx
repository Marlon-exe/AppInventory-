"use client"
import { useState } from "react";
import { useCatalogoLogic } from "@/src/hooks/catalogoHooks/catalogoLogic";
import { TableBase } from "@/src/componets/ui/table";
import { ModalBase } from "@/src/componets/ui/modal";
import { Input, Button, Spinner } from "@heroui/react";

const columns = [
    { key: 'nombre', label: 'Producto' },
];

export default function CatalogoPage() {
    const {
        productos,
        loading,
        busqueda,
        setBusqueda,
        buscar,
        totalItems,
        isDetalleOpen,
        detalle,
        loadingDetalle,
        nombreProducto,
        handleVerDetalle,
        handleDetalleClose,
    } = useCatalogoLogic();

    const [page, setPage] = useState(1);
    const rowsPerPage = 10;
    const totalPages = Math.ceil(productos.length / rowsPerPage);
    const productosPaginados = productos.slice((page - 1) * rowsPerPage, page * rowsPerPage);

    const handleBuscar = () => {
        setPage(1);
        buscar(busqueda);
    };

    return (
        <div className="flex flex-col gap-3 p-6 w-full">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Catálogo Electrónico</h2>
            </div>

            {/* Buscador */}
            <div className="flex gap-2">
                <Input
                    placeholder="Buscar producto..."
                    variant="bordered"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleBuscar()}
                    className="max-w-md"
                />
                <Button color="primary" onPress={handleBuscar} isLoading={loading}>
                    Buscar
                </Button>
            </div>

            {/* Contador */}
            {totalItems > 0 && (
                <p className="text-sm text-default-500">{totalItems} productos encontrados</p>
            )}

            {/* Tabla */}
            <div className="bg-content1 p-6 rounded-3xl shadow-xl border border-divider">
                <TableBase
                    columns={columns}
                    rows={productosPaginados}
                    rowKey="url"
                    page={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                    onView={handleVerDetalle}
                />
            </div>

            {/* Modal detalle */}
            <ModalBase
                isOpen={isDetalleOpen}
                onClose={handleDetalleClose}
                title={nombreProducto}
                size="2xl"
                scrollBehavior="inside"
                buttons={[
                    { label: "Cerrar", color: "default", variant: "flat", onPress: handleDetalleClose },
                ]}
            >
                {loadingDetalle ? (
                    <div className="flex justify-center py-6">
                        <Spinner label="Cargando especificaciones..." />
                    </div>
                ) : detalle && Object.keys(detalle).length > 0 ? (
                    <div className="flex flex-col overflow-y-auto max-h-98">
                        {Object.entries(detalle).map(([clave, valor]) => (
                            <div key={clave} className="flex justify-between py-2 border-b border-divider last:border-0">
                                <span className="font-medium text-default-500 text-sm">{clave}</span>
                                <span className="text-default-900 text-sm text-right max-w-xs wrap-break-word">{String(valor)}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-default-400 text-sm text-center py-4">
                        No se encontraron especificaciones.
                    </p>
                )}
            </ModalBase>
        </div>
    );
}