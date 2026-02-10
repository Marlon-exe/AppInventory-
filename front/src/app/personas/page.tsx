"use client"
import { useEffect, useState, useCallback } from "react"
import { TableModel, ColumnConfig } from "@/components/application/table/table-model";
import { Button } from "@/components/base/buttons/button";
import { FormModel, FieldConfig } from "@/components/application/forms/form-model";
import { Modal, ModalOverlay, Dialog } from "@/components/application/modals/modal";

interface Persona {
  id_persona: number;
  nombre: string;
  cedula: string;
  id_departamento: number;
  nom_departamento: string;
}

interface DeptoSimplificado {
  id_departamento: number;
  nom_departamento: string;
}

const COLUMNAS_PERSONA: ColumnConfig<Persona>[] = [
  { key: "nombre", label: "Nombre Completo", isRowHeader: true, allowsSorting: false },
  { key: "cedula", label: "Cédula", className: "text-secondary font-mono" },
  {
    key: "nom_departamento",
    label: "Departamento",
    render: (item) => (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
        {item.nom_departamento}
      </span>
    )
  }
];

export default function PersonaPage() {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [departamentos, setDepartamentos] = useState<DeptoSimplificado[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [personaAEditar, setPersonaAEditar] = useState<Persona | null>(null);
  const [personaAEliminar, setPersonaAEliminar] = useState<Persona | null>(null);
  const [errorEliminar, setErrorEliminar] = useState<string | null>(null);

  //configuracion de campos
  const getCamposPersona = (): FieldConfig[] => [
    {
      name: "nombre",
      label: "Nombre completo",
      placeholder: "",
      isRequired: true,
      defaultValue: personaAEditar?.nombre || ""
    },
    {
      name: "cedula",
      label: "Cédula de identidad",
      placeholder: "",
      isRequired: true,
      defaultValue: personaAEditar?.cedula || ""
    },
    {
      name: "id_departamento",
      label: "Departamento",
      type: "select",
      isRequired: true,
      defaultValue: personaAEditar?.id_departamento || "",
      options: departamentos.map(d => ({
        label: d.nom_departamento,
        value: d.id_departamento
      }))
    }
  ];

  // caragar datos
  const cargarDatos = useCallback(async () => {
    try {
      setLoading(true);
      const [resPers, resDept] = await Promise.all([
        fetch('http://localhost:4000/api/persona'),
        fetch('http://localhost:4000/api/departamento')
      ]);

      const dataPers = await resPers.json();
      const dataDept = await resDept.json();

      if (dataPers.value) setPersonas(dataPers.data);
      if (dataDept.value) setDepartamentos(dataDept.data);
    } catch (error) {
      console.error("Error cargando datos:", error);
    } finally {
      setLoading(false);
    }
  }, []);


  const handleGuardar = async (data: any) => {
    try {
      setFormLoading(true);
      const esEdicion = !!personaAEditar;

      const payload = {
        ...data,
        id_departamento: Number(data.id_departamento)
      };

      const url = esEdicion
        ? `http://localhost:4000/api/persona/${personaAEditar.id_persona}`
        : 'http://localhost:4000/api/persona';

      const res = await fetch(url, {
        method: esEdicion ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await res.json();
      if (result.value) {
        setIsModalOpen(false);
        setPersonaAEditar(null);
        cargarDatos();
      }
    } catch (error) {
      console.error("Error al guardar:", error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleConfirmarEliminar = async () => {
    if (!personaAEliminar) return;
    setErrorEliminar(null);
    try {
      setDeleteLoading(true);
      const res = await fetch(`http://localhost:4000/api/persona/${personaAEliminar.id_persona}`, {
        method: 'DELETE'
      });
      const result = await res.json();
      if (result.value) {
        setIsDeleteModalOpen(false);
        setPersonaAEliminar(null);
        cargarDatos();
      } else {
        setErrorEliminar(result.message || "No se puede eliminar este registro porque tiene datos asociados o restricciones de seguridad.");
      }
    } catch (error) {
      setErrorEliminar("Error de conexión con el servidor.");
    } finally {
      setDeleteLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    cargarDatos();
  }, [cargarDatos]);

  if (!mounted) return null;

  return (
    <div className="p-6 flex flex-col gap-6">
      <header className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Personal</h1>
          
        </div>
        <Button color="primary" onClick={() => { setPersonaAEditar(null); setIsModalOpen(true); }}>
          Registrar Persona
        </Button>
      </header>

      <TableModel
        items={personas}
        columns={COLUMNAS_PERSONA}
        getRowId={(item) => item.id_persona}
        actions={{
          onEdit: (item) => { setPersonaAEditar(item); setIsModalOpen(true); },
          onDelete: (item) => { setPersonaAEliminar(item); setIsDeleteModalOpen(true); }
        }}
      />

      {/*  formulario */}
      <ModalOverlay isOpen={isModalOpen} onOpenChange={setIsModalOpen}>
        <Modal className="max-w-md bg-white p-6 rounded-2xl shadow-xl border border-gray-100 outline-none">
          <Dialog>
            <div className="w-full flex flex-col gap-4">
              <header className="pb-2">
                <h2 className="text-xl font-bold text-gray-900">
                  {personaAEditar ? "Editar Registro" : "Nuevo Registro"}
                </h2>
              </header>

              <FormModel
                key={personaAEditar?.id_persona || "nuevo-persona"}
                fields={getCamposPersona()}
                onSubmit={handleGuardar}
                loading={formLoading}
                submitLabel={personaAEditar ? "Actualizar" : "Registrar"}
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

      {/* modo eliminar */}
      <ModalOverlay isOpen={isDeleteModalOpen} onOpenChange={(open) => {
        setIsDeleteModalOpen(open);
        if (!open) setErrorEliminar(null);
      }}>
        <Modal className="max-w-sm bg-white p-6 rounded-2xl shadow-xl border border-red-100 outline-none">
          <Dialog>
            <div className="w-full flex flex-col gap-5">
              <header className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
                  <span className="text-red-600 text-xl font-bold">!</span>
                </div>
                <h2 className="text-lg font-bold text-gray-900">¿Eliminar registro?</h2>

                {/* alerta de error*/}
                {errorEliminar ? (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700 font-medium">
                      {errorEliminar}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 mt-2">
                    ¿Estás seguro de eliminar a <strong>{personaAEliminar?.nombre}</strong>?
                  </p>
                )}
              </header>

              <div className="flex gap-3">
                <Button className="flex-1" color="secondary" onClick={() => setIsDeleteModalOpen(false)}>
                  {errorEliminar ? "Cerrar" : "Cancelar"}
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