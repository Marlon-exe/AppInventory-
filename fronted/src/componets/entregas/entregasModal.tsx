import { ModalBase } from "@/src/componets/ui/modal";
import { SearchSelect } from "@/src/componets/ui/autoComplete";
import { Input, Select, SelectItem, DatePicker, Spinner } from "@heroui/react";
import { parseDate } from "@internationalized/date";
import { useSearchSelect } from "@/src/hooks/inicioHooks/searchSelectHook";
import { useMemo } from "react";
import { I18nProvider } from "@react-aria/i18n";

export const EntregasModals = ({ logic }: { logic: any }) => {
    const personaOptions = useMemo(() =>
        logic.personas.map((p: any) => ({
            label: `${p.nombre} (${p.cedula}) (${p.nom_departamento ?? 'S/D'}`,
            value: p.id_persona,
        })), [logic.personas]);


    const retiraSelect = useSearchSelect(personaOptions, logic.personaForm.handleCreateOpen);
    const entregaSelect = useSearchSelect(personaOptions, logic.personaForm.handleCreateOpen);

    return (
        <>
            {/* --- modal crear entrega --- */}
            <ModalBase
                isOpen={logic.isCreateOpen}
                onClose={logic.handleCreateClose}
                title="Nueva entrega"
                size="lg"
                scrollBehavior="inside"
                buttons={[
                    { label: "Cancelar", color: "default", variant: "flat", onPress: logic.handleCreateClose },
                    { label: "Guardar", color: "primary", onPress: logic.handleCreateSave },
                ]}
            >
                <div className="flex flex-col gap-4">
                   
                    <SearchSelect
                        label="Persona que retira"
                        options={retiraSelect.filteredOptions}
                        value={logic.form.id_persona_retiro}
                        onInputChange={retiraSelect.handleInputChange}
                        onSelectionChange={(key) => retiraSelect.handleSelectionChange(key, (val) =>
                            logic.setForm({ ...logic.form, id_persona_retiro: val })
                        )}
                    />
                    <SearchSelect
                        label="Responsable de entrega"
                        options={entregaSelect.filteredOptions}
                        value={logic.form.id_persona_entrega}
                        onInputChange={entregaSelect.handleInputChange}
                        onSelectionChange={(key) => entregaSelect.handleSelectionChange(key, (val) =>
                            logic.setForm({ ...logic.form, id_persona_entrega: val })
                        )}
                    />
                    <Select
                        label="Producto"
                        variant="bordered"
                        selectedKeys={logic.form.id_producto ? [String(logic.form.id_producto)] : []}
                        onSelectionChange={(keys) => logic.setForm({ ...logic.form, id_producto: Number([...keys][0]) })}
                    >
                        {logic.productos.map((p: any) => (
                            <SelectItem key={String(p.id_producto)}>{p.tipo_producto}</SelectItem>
                        ))}
                    </Select>
                    <Input
                        label="Cantidad"
                        type="number"
                        variant="bordered"
                        value={logic.form.cantidad}
                        onChange={(e) => logic.setForm({ ...logic.form, cantidad: e.target.value })}
                    />
                    <I18nProvider locale="es-ES">
                    <DatePicker
                        label="Fecha de entrega"
                        variant="bordered"
                        value={logic.form.fecha_entrega ? parseDate(logic.form.fecha_entrega) : null}
                        onChange={(date) => logic.setForm({ ...logic.form, fecha_entrega: date?.toString() ?? '' })}
                        isDateUnavailable={logic.isDateUnavailable}
                    />
                    </I18nProvider>
                </div>
            </ModalBase>

            {/* modal crear persona*/}
            <ModalBase
                isOpen={logic.personaForm.isFormOpen}
                onClose={logic.personaForm.handleFormClose}
                title="Nueva persona"
                buttons={[
                    { label: "Cancelar", color: "danger", variant: "flat", onPress: logic.personaForm.handleFormClose },
                    { label: "Guardar", color: "primary", onPress: logic.personaForm.handleFormSave },
                ]}
            >
                <div className="flex flex-col gap-4">
                    <Input
                        label="Cédula / ID"
                        variant="bordered"
                        value={logic.personaForm.form.cedula}
                        onChange={(e) => logic.personaForm.setForm({ ...logic.personaForm.form, cedula: e.target.value })}
                        onBlur={logic.personaForm.handleCedulaBlur}
                        endContent={logic.personaForm.loadingCedula && <Spinner size="sm" />}
                        maxLength={10}
                    />
                    <Input
                        label="Nombre completo"
                        variant="bordered"
                        value={logic.personaForm.form.nombre}
                        onChange={(e) => logic.personaForm.setForm({ ...logic.personaForm.form, nombre: e.target.value })}
                    />

                    <Select
                        label="Departamento"
                        variant="bordered"
                        selectedKeys={logic.personaForm.form.id_departamento ? [String(logic.personaForm.form.id_departamento)] : []}
                        onSelectionChange={(keys) => logic.personaForm.setForm({ ...logic.personaForm.form, id_departamento: Number([...keys][0]) })}
                    >
                        {logic.personaForm.departamentos.map((dep: any) => (
                            <SelectItem key={String(dep.id_departamento)}>
                                {dep.nom_departamento}
                            </SelectItem>
                        ))}
                    </Select>
                </div>
            </ModalBase>

            {/* --- modal editar--- */}
            <ModalBase
                isOpen={logic.isEditOpen}
                onClose={logic.handleEditClose}
                title="Editar registro"
                buttons={[
                    { label: "Cancelar", color: "default", variant: "flat", onPress: logic.handleEditClose },
                    { label: "Guardar", color: "primary", onPress: logic.handleEditSave },
                ]}
            >
                <div className="flex flex-col gap-4">
                    <Input
                        label="Cantidad"
                        value={logic.editForm.cantidad}
                        onChange={(e) => logic.setEditForm({ ...logic.editForm, cantidad: e.target.value })}
                        variant="bordered"
                    />
                    <I18nProvider locale="es-ES">
                    <DatePicker
                        label="Fecha de entrega"
                        variant="bordered"
                        value={logic.editForm.fecha_entrega ? parseDate(logic.editForm.fecha_entrega) : null}
                        onChange={(date) => logic.setEditForm({ ...logic.editForm, fecha_entrega: date?.toString() ?? '' })}
                         isDateUnavailable={logic.isDateUnavailable}
                    />
                    </I18nProvider>

                    <SearchSelect
                        label="Entregado por"
                        options={entregaSelect.filteredOptions}
                        value={logic.editForm.id_persona_entrega}
                        onInputChange={entregaSelect.handleInputChange}
                        onSelectionChange={(key) => entregaSelect.handleSelectionChange(key, (val) =>
                            logic.setEditForm({ ...logic.editForm, id_persona_entrega: val })
                        )}
                    />

                    <SearchSelect
                        label="Retirado por"
                        options={retiraSelect.filteredOptions}
                        value={logic.editForm.id_persona_retiro} // Asegúrate de tener el ID en el editForm
                        onInputChange={retiraSelect.handleInputChange}
                        onSelectionChange={(key) => retiraSelect.handleSelectionChange(key, (val) =>
                            logic.setEditForm({ ...logic.editForm, id_persona_retiro: val })
                        )}
                    />
                </div>
            </ModalBase>

            {/* --- modal eliminar--- */}
            <ModalBase
                isOpen={logic.isDeleteOpen}
                onClose={logic.handleDeleteClose}
                title="Eliminar registro"
                text="¿Estás seguro de eliminar este registro?"
                buttons={[
                    { label: "Cancelar", color: "default", variant: "flat", onPress: logic.handleDeleteClose },
                    { label: "Eliminar", color: "danger", onPress: logic.handleDeleteConfirm },
                ]}
            />
            <ModalBase
                isOpen={logic.personaForm.isNotFoundOpen}
                onClose={() => logic.personaForm.setIsNotFoundOpen(false)}
                title="Persona no encontrada"
                text="La cédula ingresada no existe en el sistema."
                buttons={[
                    { label: "Aceptar", color: "primary", onPress: () => logic.personaForm.setIsNotFoundOpen(false) },
                ]}
            />
        </>
    );
};