"use client"
import { useDepartamentoLogic } from "@/src/hooks/departamentoHooks/departamentoLogic";
import { TableBase } from "@/src/componets/ui/table";
import { ModalBase } from "@/src/componets/ui/modal";
import { Input, Button } from "@heroui/react";

const columns = [
    { key: 'id_departamento', label: 'ID' },
    { key: 'nom_departamento', label: 'Departamento' },
];

export default function DepartamentoPage() {
    const {
        departamentos,
        isCreateOpen,
        createForm,
        setCreateForm,
        handleCreateOpen,
        handleCreateClose,
        handleCreateSave,
        isEditOpen,
        editForm,
        setEditForm,
        handleEdit,
        handleEditClose,
        handleEditSave,
        isDeleteOpen,
        handleDelete,
        handleDeleteClose,
        handleDeleteConfirm,
    } = useDepartamentoLogic();

    return (
        <div className="flex flex-col gap-3 p-6">
            <div className="flex justify-between">
                <h2 className="text-xl font-semibold px-1">Departamentos</h2>
                <Button color="primary" onPress={handleCreateOpen}>
                    + Nuevo departamento
                </Button>
            </div>

            <div className="bg-content1 p-6 rounded-3xl shadow-xl border border-divider">
                <TableBase
                    columns={columns}
                    rows={departamentos}
                    rowKey="id_departamento"
                    page={1}
                    totalPages={1}
                    onPageChange={() => { }}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </div>

            {/* Modal crear */}
            <ModalBase
                isOpen={isCreateOpen}
                onClose={handleCreateClose}
                title="Nuevo departamento"
                buttons={[
                    { label: "Cancelar", color: "danger", variant: "flat", onPress: handleCreateClose },
                    { label: "Guardar", color: "primary", onPress: handleCreateSave },
                ]}
            >
                <Input
                    label="Nombre del departamento"
                    placeholder="Ingresa el nombre"
                    variant="bordered"
                    value={createForm.nom_departamento}
                    onChange={(e) => setCreateForm({ nom_departamento: e.target.value })}
                />
            </ModalBase>

            {/* Modal editar */}
            <ModalBase
                isOpen={isEditOpen}
                onClose={handleEditClose}
                title="Editar departamento"
                buttons={[
                    { label: "Cancelar", color: "danger", variant: "flat", onPress: handleEditClose },
                    { label: "Guardar", color: "primary", onPress: handleEditSave },
                ]}
            >
                <Input
                    label="Nombre del departamento"
                    placeholder="Ingresa el nombre"
                    variant="bordered"
                    value={editForm.nom_departamento}
                    onChange={(e) => setEditForm({ nom_departamento: e.target.value })}
                />
            </ModalBase>

            {/* Modal eliminar */}
            <ModalBase
                isOpen={isDeleteOpen}
                onClose={handleDeleteClose}
                title="Eliminar departamento"
                text="¿Estás seguro de eliminar este departamento?"
                buttons={[
                    { label: "Cancelar", color: "default", variant: "flat", onPress: handleDeleteClose },
                    { label: "Eliminar", color: "danger", onPress: handleDeleteConfirm },
                ]}
            />
        </div>
    );
}