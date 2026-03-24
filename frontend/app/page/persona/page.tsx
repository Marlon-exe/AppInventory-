"use client"
import { usePersonaLogic } from "@/src/hooks/personaHooks/personaLogic";
import { TableBase } from "@/src/componets/ui/table";
import { ModalBase } from "@/src/componets/ui/modal";
import { Input, Button, Select, SelectItem, Spinner } from "@heroui/react";
import { SearchSelect } from "@/src/componets/ui/autoComplete";
import { useSearchSelect } from "@/src/hooks/inicioHooks/searchSelectHook";

const columns = [
    { key: 'id_persona', label: 'ID' },
    { key: 'nombre', label: 'Nombre' },
    { key: 'cedula', label: 'Cédula' },
    { key: 'nom_departamento', label: 'Departamento' },
];

export default function PersonaPage() {
    const {
        personas,
        isFormOpen,
        isEditing,
        form,
        setForm,
        departamentos,
        loadingCedula,
        handleCedulaBlur,
        handleCreateOpen,

        isNotFoundOpen,
        setIsNotFoundOpen,

        handleEdit,
        handleFormClose,
        handleFormSave,
        isDeleteOpen,
        handleDelete,
        handleDeleteClose,
        handleDeleteConfirm,
    } = usePersonaLogic();

    const depOption = departamentos.map((dep: any) => ({
        label: dep.nom_departamento,
        value: dep.id_departamento
    }));

    const depSelect = useSearchSelect(depOption)

    return (
        <div className="flex flex-col gap-3 p-6 w-full">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Personas</h2>
                <Button color="primary" onPress={() => handleCreateOpen()}>
                    + Nueva persona
                </Button>
            </div>

            <div className="bg-content1 p-6 rounded-3xl shadow-xl border border-divider">
                <TableBase
                    columns={columns}
                    rows={personas}
                    rowKey="id_persona"
                    page={1}
                    totalPages={1}
                    onPageChange={() => { }}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </div>

            {/* Modal crear / editar */}
            <ModalBase
                isOpen={isFormOpen}
                onClose={handleFormClose}
                title={isEditing ? "Editar persona" : "Nueva persona"}
                buttons={[
                    { label: "Cancelar", color: "danger", variant: "flat", onPress: handleFormClose },
                    { label: "Guardar", color: "primary", onPress: handleFormSave },
                ]}
            >
                <Input
                    label="Cédula"
                    placeholder="Ingresa la cédula"
                    variant="bordered"
                    value={form.cedula}
                    onChange={(e) => setForm({ ...form, cedula: e.target.value })}
                    onBlur={handleCedulaBlur}
                    endContent={loadingCedula && <Spinner size="sm" />}
                    maxLength={10}
                />
                <Input
                    label="Nombre"
                    placeholder="Ingresa el nombre"
                    variant="bordered"
                    value={form.nombre}
                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                />
                <SearchSelect
                    label="Departamento"
                    placeholder="Buscar departamento..."
                    options={depSelect.filteredOptions}
                    value={form.id_departamento}
                    onInputChange={depSelect.handleInputChange}
                    onSelectionChange={(key) => depSelect.handleSelectionChange(key, (val) =>
                        setForm({ ...form, id_departamento: val })
                    )}
                />
            </ModalBase>
            <ModalBase
                isOpen={isNotFoundOpen}
                onClose={() => setIsNotFoundOpen(false)}
                title="Persona no encontrada"
                text="La cédula ingresada no existe en el sistema."
                buttons={[
                    { label: "Aceptar", color: "primary", onPress: () => setIsNotFoundOpen(false) },
                ]}
            />

            {/* Modal eliminar */}
            <ModalBase
                isOpen={isDeleteOpen}
                onClose={handleDeleteClose}
                title="Eliminar persona"
                text="¿Estás seguro de eliminar esta persona?"
                buttons={[
                    { label: "Cancelar", color: "default", variant: "flat", onPress: handleDeleteClose },
                    { label: "Eliminar", color: "danger", onPress: handleDeleteConfirm },
                ]}
            />
        </div>
    );
}