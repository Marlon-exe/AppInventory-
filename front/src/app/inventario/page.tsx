"use client"
import { useEffect, useState, useCallback } from "react"
import { ColumnConfig, TableModel } from "@/components/application/table/table-model"
import { Button } from "@/components/base/buttons/button"
import { FormModel, FieldConfig } from "@/components/application/forms/form-model"
import { Modal, ModalOverlay, Dialog } from "@/components/application/modals/modal"

interface Producto {
  id_producto: number;
  tipo_producto: string;
}

const COLUMNAS_PRODUCTO: ColumnConfig<Producto>[] = [
  {
    key: "id_producto",
    label: "ID",
    className: "w-24 text-tertiary"
  },
  {
    key: "tipo_producto",
    label: "Producto",
    isRowHeader: true,
    allowsSorting: false
  }
];

export default function InventarioPage() {
  // estados
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // control de los modales
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productoAEditar, setProductoAEditar] = useState<Producto | null>(null);
  const [productoAEliminar, setProductoAEliminar] = useState<Producto | null>(null);
  const [errorEliminar, setErrorEliminar] = useState<string | null>(null);

  // campos del formulario
  const CAMPOS_PRODUCTO: FieldConfig[] = [
    {
      name: "tipo_producto",
      label: "Nombre del producto",
      isRequired: true,
      defaultValue: productoAEditar?.tipo_producto || ""
    }
  ];

  // peticiones
  const cargarProductos = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:4000/api/producto');
      const result = await res.json();
      if (result.value) setProductos(result.data);
    } catch (error) {
      console.error("Error al cargar los productos:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // acciones de los botones
  const handleGuardar = async (data: any) => {
    try {
      setFormLoading(true);
      const esEdicion = !!productoAEditar;
      const url = esEdicion
        ? `http://localhost:4000/api/producto/${productoAEditar.id_producto}`
        : 'http://localhost:4000/api/producto';

      const res = await fetch(url, {
        method: esEdicion ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await res.json();
      if (result.value) {
        setIsModalOpen(false);
        setProductoAEditar(null);
        cargarProductos();
      }
    } catch (error) {
      console.error("Error guardando:", error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleConfirmarEliminar = async () => {
    if (!productoAEliminar) return;
    setErrorEliminar(null);
    try {
      setDeleteLoading(true);
      const res = await fetch(`http://localhost:4000/api/producto/${productoAEliminar.id_producto}`, {
        method: 'DELETE'
      });
      const result = await res.json();

      if (result.value) {
        setIsDeleteModalOpen(false);
        setProductoAEliminar(null);
        cargarProductos();
      } else {
        setErrorEliminar(result.message || "No se puede eliminar este producto porque está referenciado en el inventario.");
      }
    } catch (error) {
      setErrorEliminar("Error de conexión con el servidor.");
    } finally {
      setDeleteLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    cargarProductos();
  }, [cargarProductos]);

  if (!mounted) return null;

  return (
    <div className="p-6 flex flex-col gap-6 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden" >
      {/* cabecera*/}
      <header className="flex justify-between items-center p-2 ">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Catálogo de Productos</h1>
        
        </div>
        <Button color="primary" onClick={() => { setProductoAEditar(null); setIsModalOpen(true); }}>
          Registrar Producto
        </Button>
      </header>

      {/* tabla */}
      <div className={loading ? "opacity-50 pointer-events-none transition-opacity" : "opacity-100"}>
        <TableModel
          items={productos}
          columns={COLUMNAS_PRODUCTO}
          getRowId={(item) => item.id_producto}
          actions={{
            onEdit: (item) => { setProductoAEditar(item); setIsModalOpen(true); },
            onDelete: (item) => { 
              setProductoAEliminar(item); 
              setErrorEliminar(null);
              setIsDeleteModalOpen(true); 
            }
          }}
        />
      </div>

      {/*estado del formulario */}
      <ModalOverlay isOpen={isModalOpen} onOpenChange={setIsModalOpen}>
        <Modal className="max-w-md bg-white p-6 rounded-2xl shadow-xl border border-gray-100 outline-none">
          <Dialog>
            <div className="w-full flex flex-col gap-4">
              <h2 className="text-lg font-bold text-gray-900">
                {productoAEditar ? "Editar Producto" : "Nuevo Producto"}
              </h2>
              <FormModel
                key={productoAEditar?.id_producto || "nuevo-prod"}
                fields={CAMPOS_PRODUCTO}
                onSubmit={handleGuardar}
                loading={formLoading}
                submitLabel={productoAEditar ? "Actualizar" : "Registrar"}
                extraActions={
                  <Button type="button" color="secondary" onClick={() => setIsModalOpen(false)}>
                    Cancelar
                  </Button>
                }
              />
            </div>
          </Dialog>
        </Modal>
      </ModalOverlay>

      {/* alerta del error */}
      <ModalOverlay isOpen={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <Modal className="max-w-sm bg-white p-6 rounded-2xl shadow-xl border border-red-100 outline-none">
          <Dialog>
            <div className="w-full flex flex-col gap-5">
              <header className="text-center">
                <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full mb-4 ${errorEliminar ? 'bg-orange-100' : 'bg-red-100'}`}>
                  <span className={`text-xl font-bold ${errorEliminar ? 'text-orange-600' : 'text-red-600'}`}>
                    !
                  </span>
                </div>
                <h2 className="text-lg font-bold text-gray-900">
                  {errorEliminar ? "No se puede eliminar" : "¿Eliminar producto?"}
                </h2>
                
                {errorEliminar ? (
                  <div className="mt-3 p-3 bg-red-50 border border-red-100 rounded-lg text-left">
                    <p className="text-sm text-red-800 font-medium">
                      {errorEliminar}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 mt-2">
                    ¿Confirmas que deseas eliminar <strong>{productoAEliminar?.tipo_producto}</strong>?
                  </p>
                )}
              </header>

              <div className="flex gap-3">
                <Button className="flex-1" color="secondary" onClick={() => setIsDeleteModalOpen(false)}>
                  {errorEliminar ? "Entendido" : "Cancelar"}
                </Button>
                {!errorEliminar && (
                  <Button 
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white border-none" 
                    isLoading={deleteLoading}
                    onClick={handleConfirmarEliminar}
                  >
                    Confirmar
                  </Button>
                )}
              </div>
            </div>
          </Dialog>
        </Modal>
      </ModalOverlay>
    </div>
  );
}