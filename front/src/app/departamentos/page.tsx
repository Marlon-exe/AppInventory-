"use client"
import { useEffect, useState, useCallback } from "react"
import { TableModel, ColumnConfig } from "@/components/application/table/table-model";
import { Button } from "@/components/base/buttons/button";
import { FormModel, FieldConfig } from "@/components/application/forms/form-model";
import { Modal, ModalOverlay, Dialog } from "@/components/application/modals/modal";

interface Departamento {
  id_departamento: number;
  nom_departamento: string;
}

const COLUMNAS_DEPTOS: ColumnConfig<Departamento>[] = [
  { key: "id_departamento", label: "ID", className: "w-20 text-tertiary" },
  { key: "nom_departamento", label: "Nombre del Departamento", isRowHeader: true }
];

export default function DepartamentosPage() {
  //estados
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const [deptoAEditar, setDeptoAEditar] = useState<Departamento | null>(null);
  const [deptoAEliminar, setDeptoAEliminar] = useState<Departamento | null>(null);
  
  const [errorEliminar, setErrorEliminar] = useState<string | null>(null);

  const CAMPOS_DEPARTAMENTO: FieldConfig[] = [
    {
      name: "nom_departamento",
      label: "Nombre del departamento",
      placeholder: "Ej. Recursos Humanos",
      isRequired: true,
      defaultValue: deptoAEditar?.nom_departamento || ""
    }
  ];

  const cargarDepartamentos = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:4000/api/departamento');
      const result = await res.json();
      if (result.value) setDepartamentos(result.data);
    } catch (error) { console.error("Error cargando:", error); } 
    finally { setLoading(false); }
  }, []);

  const handleGuardar = async (data: any) => {
    try {
      setFormLoading(true);
      const esEdicion = !!deptoAEditar;
      const url = esEdicion
        ? `http://localhost:4000/api/departamento/${deptoAEditar.id_departamento}`
        : 'http://localhost:4000/api/departamento';

      const res = await fetch(url, {
        method: esEdicion ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await res.json();
      if (result.value) {
        setIsModalOpen(false);
        setDeptoAEditar(null);
        cargarDepartamentos();
      }
    } catch (error) { console.error("Error guardando:", error); } 
    finally { setFormLoading(false); }
  };

  const handleConfirmarEliminar = async () => {
    if (!deptoAEliminar) return;
    setErrorEliminar(null);

    try {
      setDeleteLoading(true);
      const res = await fetch(`http://localhost:4000/api/departamento/${deptoAEliminar.id_departamento}`, {
        method: 'DELETE'
      });
      const result = await res.json();
      
      if (result.value) {
        setIsDeleteModalOpen(false);
        setDeptoAEliminar(null);
        cargarDepartamentos();
      } else {
        // Mensaje de error del backend
        setErrorEliminar(result.message || "No se puede eliminar este departamento porque tiene personal o registros asociados.");
      }
    } catch (error) { 
      setErrorEliminar("Error de comunicación con el servidor.");
    } finally { 
      setDeleteLoading(false); 
    }
  };

  useEffect(() => {
    setMounted(true);
    cargarDepartamentos();
  }, [cargarDepartamentos]);

  if (!mounted) return null;

  return (
    <div className="p-6 flex flex-col gap-6">
      <header className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">Departamentos</h1>
        <Button color="primary" onClick={() => { setDeptoAEditar(null); setIsModalOpen(true); }}>
          Nuevo Departamento
        </Button>
      </header>

      <TableModel
        items={departamentos}
        columns={COLUMNAS_DEPTOS}
        getRowId={(item) => item.id_departamento}
        actions={{
          onEdit: (item) => { setDeptoAEditar(item); setIsModalOpen(true); },
          onDelete: (item) => { 
            setDeptoAEliminar(item); 
            setErrorEliminar(null);
            setIsDeleteModalOpen(true); 
          }
        }}
      />

      {/* formulario flotante */}
      <ModalOverlay isOpen={isModalOpen} onOpenChange={setIsModalOpen}>
        <Modal className="max-w-md bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
          <Dialog>
            <div className="w-full flex flex-col gap-4">
              <header>
                <h2 className="text-lg font-bold text-gray-900">
                  {deptoAEditar ? "Editar Departamento" : "Nuevo Departamento"}
                </h2>
              </header>

              <FormModel
                key={deptoAEditar?.id_departamento || "nuevo"}
                fields={CAMPOS_DEPARTAMENTO}
                onSubmit={handleGuardar}
                loading={formLoading}
                submitLabel={deptoAEditar ? "Actualizar" : "Guardar"}
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

      {/* Alerta al eliminar algo y mensaje de error */}
      <ModalOverlay isOpen={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <Modal className="max-w-sm bg-white p-6 rounded-2xl shadow-xl border border-red-100">
          <Dialog>
            <div className="w-full flex flex-col gap-5">
              <header className="text-center">
                <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full mb-4 ${errorEliminar ? 'bg-orange-100' : 'bg-red-100'}`}>
                  <span className={`text-xl font-bold ${errorEliminar ? 'text-orange-600' : 'text-red-600'}`}>
                    {errorEliminar ? '!' : 'i'}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-gray-900">
                  {errorEliminar ? "Acción denegada" : "Confirmar eliminación"}
                </h2>
                
                {errorEliminar ? (
                  <div className="mt-3 p-3 bg-red-50 border border-red-100 rounded-lg">
                    <p className="text-sm text-red-800 font-medium leading-relaxed">
                      {errorEliminar}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                    ¿Estás seguro de eliminar <strong>{deptoAEliminar?.nom_departamento}</strong>? Esta acción no se puede deshacer.
                  </p>
                )}
              </header>

              <div className="flex gap-3">
                <Button 
                  className="flex-1" 
                  color="secondary" 
                  onClick={() => setIsDeleteModalOpen(false)}
                >
                  {errorEliminar ? "Entendido" : "Cancelar"}
                </Button>
                
                {!errorEliminar && (
                  <Button 
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white border-none transition-colors" 
                    isLoading={deleteLoading}
                    onClick={handleConfirmarEliminar}
                  >
                    Eliminar
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