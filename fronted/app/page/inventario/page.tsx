"use client"
import { useProductoLogic } from "@/src/hooks/inventarioHooks/inventarioLogic";
import { TableBase } from "@/src/componets/ui/table";
import { ModalBase } from "@/src/componets/ui/modal";
import { Input, Button } from "@heroui/react";


const columns = [
    { key: 'id_producto', label: 'ID' },
    { key: 'tipo_producto', label: 'Producto' },
];

export default function CatalogoPage() {
    const {
        productos,
        loading,
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
        isCreateOpen,
        createForm,
        setCreateForm,
        handleCreateOpen,
        handleCreateClose,
        handleCreateSave,
    } = useProductoLogic();

    return (
        <div className="flex flex-col gap-3 p-6">
            <div className="flex justify-between mb-4">
                <h2 className="text-xl font-semibold px-1">Catálogo de Productos</h2>
                <Button color="primary" onPress={handleCreateOpen}>
                    + Nuevo producto
                </Button>
            </div>
            <div className="bg-content1 p-6 rounded-3xl shadow-xl border border-divider">


                <ModalBase
                    isOpen={isCreateOpen}
                    onClose={handleCreateClose}
                    title="Nuevo producto"
                    buttons={[
                        { label: "Cancelar", color: "danger", variant: "flat", onPress: handleCreateClose },
                        { label: "Guardar", color: "primary", onPress: handleCreateSave },
                    ]}
                >
                    <Input
                        label="Nombre del producto"
                        placeholder="Ingresa el nombre"
                        variant="bordered"
                        value={createForm.tipo_producto}
                        onChange={(e) => setCreateForm({ tipo_producto: e.target.value })}
                    />
                </ModalBase>

                <TableBase
                    columns={columns}
                    rows={productos}
                    rowKey="id_producto"
                    page={1}
                    totalPages={1}
                    onPageChange={() => { }}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </div>

            {/* Modal editar */}
            <ModalBase
                isOpen={isEditOpen}
                onClose={handleEditClose}
                title="Editar producto"
                buttons={[
                    { label: "Cancelar", color: "danger", variant: "flat", onPress: handleEditClose },
                    { label: "Guardar", color: "primary", onPress: handleEditSave },
                ]}
            >
                <Input
                    label="Nombre del producto"
                    placeholder="Ingresa el nombre"
                    variant="bordered"
                    value={editForm.tipo_producto}
                    onChange={(e) => setEditForm({ tipo_producto: e.target.value })}
                />
            </ModalBase>

            {/* Modal eliminar */}
            <ModalBase
                isOpen={isDeleteOpen}
                onClose={handleDeleteClose}
                title="Eliminar producto"
                text="¿Estás seguro de eliminar este producto?"
                buttons={[
                    { label: "Cancelar", color: "default", variant: "flat", onPress: handleDeleteClose },
                    { label: "Eliminar", color: "danger", onPress: handleDeleteConfirm },
                ]}
            />
        </div>
    );
}