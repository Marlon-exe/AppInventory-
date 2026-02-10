"use client"
import { useEffect, useState, useCallback } from "react";
import { BarChart } from "@/components/application/charts/bar-charts-home";
import { TableModel, ColumnConfig } from "@/components/application/table/table-model";
import { transformarDatosParaGrafico, RegistroEntrega, ApiResponseEntregas } from "@/lib/chart-utils";
import { DateRangePickerControlled } from "@/components/application/date-picker/DateRangePickerControlled";
import { Button } from "@/components/base/buttons/button";
import { FormModel, FieldConfig } from "@/components/application/forms/form-model";
import { SearchSelect } from "@/components/application/forms/search-select";
import { Modal, ModalOverlay, Dialog } from "@/components/application/modals/modal";
import type { RangeValue, DateValue } from "react-aria-components";
import { getLocalTimeZone, today, startOfWeek, endOfWeek } from "@internationalized/date";

const COLUMNAS_ENTREGAS: ColumnConfig<RegistroEntrega>[] = [
  { key: "departamento", label: "Departamento", isRowHeader: true, allowsSorting: false },
  { key: "producto", label: "Producto" },
  { key: "fecha", label: "Fecha", className: "whitespace-nowrap text-tertiary" },
  { key: "quien_retiro", label: "Retiró", className: "text-secondary" },
  { key: "quien_entrega", label: "Entregó", className: "text-secondary" },
  { key: "cantidad", label: "Cant.", className: "font-bold text-tertiary" }
];

export default function HomePage() {
  const now = today(getLocalTimeZone());

  // estados 
  const [rangoSemanas, setRangoSemanas] = useState<RangeValue<DateValue> | null>({
    start: startOfWeek(now, 'es-ES'),
    end: endOfWeek(now, 'es-ES').subtract({ days: 2 })
  });
  const [chartInfo, setChartInfo] = useState<{ data: any[]; productos: string[] }>({ data: [], productos: [] });
  const [entregas, setEntregas] = useState<RegistroEntrega[]>([]);
  const [pagination, setPagination] = useState({ actual: 1, totalPaginas: 1 });
  const [loading, setLoading] = useState(true);

  // cataologo
  const [personas, setPersonas] = useState<any[]>([]);
  const [productos, setProductos] = useState<any[]>([]);
  const [departamentos, setDepartamentos] = useState<any[]>([]);

  // modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPersonaModalOpen, setIsPersonaModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [entregaAEliminar, setEntregaAEliminar] = useState<RegistroEntrega | null>(null);

  const [entregaAEditar, setEntregaAEditar] = useState<RegistroEntrega | null>(null);
  const [tempPersonaName, setTempPersonaName] = useState("");

  const [formData, setFormData] = useState({
    id_persona_retiro: "" as string | number,
    id_persona_entrega: "" as string | number,
  });

  //datos 
  const cargarCatalogos = useCallback(async () => {
    try {
      const [resPers, resProd, resDep] = await Promise.all([
        fetch('http://localhost:4000/api/persona').then(r => r.json()),
        fetch('http://localhost:4000/api/producto').then(r => r.json()),
        fetch('http://localhost:4000/api/departamento').then(r => r.json())
      ]);
      if (resPers.value) setPersonas(resPers.data);
      if (resProd.value) setProductos(resProd.data);
      if (resDep.value) setDepartamentos(resDep.data);
    } catch (e) { console.error("Error catálogos:", e); }
  }, []);

  // grafica
  const cargarGraficos = useCallback(async () => {
    if (!rangoSemanas || productos.length === 0) return;
    const inicio = rangoSemanas.start.toString();
    const fin = rangoSemanas.end.toString();
    try {
      const resStats = await fetch(`http://localhost:4000/api/producto-entregado/stats?inicio=${inicio}&fin=${fin}`).then(r => r.json());
      if (resStats.value) {
        const { datosGraficos, tipo_producto } = transformarDatosParaGrafico(productos, resStats.data);
        setChartInfo({ data: datosGraficos, productos: tipo_producto });
      }
    } catch (e) { console.error("Error cargando gráfica:", e); }
  }, [rangoSemanas, productos]);

  //  Tabla
  const cargarTabla = useCallback(async (page: number = 1) => {
    try {
      setLoading(true);
      const res: ApiResponseEntregas = await fetch(`http://localhost:4000/api/producto-entregado?page=${page}`).then(r => r.json());
      if (res.value) {
        setEntregas(res.data.registros);
        setPagination({ actual: res.data.paginaActual, totalPaginas: res.data.paginas });
      }
    } catch (e) { console.error(e); } finally { setLoading(false); }
  }, []);


  useEffect(() => {
    cargarCatalogos();
    cargarTabla(1);
  }, [cargarCatalogos, cargarTabla]);

  useEffect(() => {
    cargarGraficos();
  }, [rangoSemanas, productos, cargarGraficos]);


  const handleGuardarEntrega = async (dataRestante: any) => {
    try {
      setFormLoading(true);
      const esEdicion = !!entregaAEditar;
      const url = esEdicion
        ? `http://localhost:4000/api/producto-entregado/${entregaAEditar.id_producto_entregado}`
        : 'http://localhost:4000/api/producto-entregado';

      const payload = {
        ...dataRestante,
        id_persona_retiro: Number(formData.id_persona_retiro),
        id_persona_entrega: Number(formData.id_persona_entrega),
        cantidad: Number(dataRestante.cantidad)
      };

      const res = await fetch(url, {
        method: esEdicion ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).then(r => r.json());

      if (res.value) {
        setIsModalOpen(false);
        setEntregaAEditar(null);
        setFormData({ id_persona_retiro: "", id_persona_entrega: "" });
        cargarTabla();
        cargarGraficos();
      }
    } catch (e) { console.error(e); } finally { setFormLoading(false); }
  };

  const handleCrearPersona = async (pData: any) => {
    try {
      setFormLoading(true);
      const res = await fetch('http://localhost:4000/api/persona', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cedula: pData.cedula,
          nombre: pData.nombre,
          id_departamento: Number(pData.id_departamento)
        })
      }).then(r => r.json());

      if (res.value) {
        await cargarCatalogos();
        setIsPersonaModalOpen(false);
        setFormData(p => ({ ...p, id_persona_retiro: res.data.id_persona }));
      }
    } catch (e) { console.error(e); } finally { setFormLoading(false); }
  };
  const handleConfirmarEliminar = async () => {
    if (!entregaAEliminar) return;

    try {
      setFormLoading(true);
      const res = await fetch(`http://localhost:4000/api/producto-entregado/${entregaAEliminar.id_producto_entregado}`, {
        method: 'DELETE'
      }).then(r => r.json());

      if (res.value) {
        setIsDeleteModalOpen(false);
        setEntregaAEliminar(null);
        cargarTabla(pagination.actual);
        cargarGraficos();
      } else {
        alert(res.msg || "No se pudo eliminar el registro");
      }
    } catch (e) {
      console.error("Error al eliminar:", e);
    } finally {
      setFormLoading(false);
    }
  };
  return (
    <div className="p-1">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Panel de control</h1>
        <Button color="primary" onClick={() => {
          setEntregaAEditar(null);
          setFormData({ id_persona_retiro: "", id_persona_entrega: "" });
          setIsModalOpen(true);
        }}>
          Nueva Entrega
        </Button>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm flex flex-col gap-10">

        <div className="flex flex-col gap-4">
          <div className="w-50 self-end">
            <DateRangePickerControlled value={rangoSemanas} onChange={setRangoSemanas} />
          </div>
          <div className="w-full h-75">
            <BarChart data={chartInfo.data} productos={chartInfo.productos} />
          </div>
        </div>

        <TableModel
          items={entregas}
          columns={COLUMNAS_ENTREGAS}
          getRowId={(item) => item.id_producto_entregado}
          paginaActual={pagination.actual}
          totalPaginas={pagination.totalPaginas}
          onPageChange={cargarTabla}
          actions={{
            onEdit: (item) => {
              setEntregaAEditar(item);
              setFormData({ id_persona_retiro: item.id_persona_retiro, id_persona_entrega: item.id_persona_entrega });
              setIsModalOpen(true);
            },
            onDelete: (item) => {
              setEntregaAEliminar(item);
              setIsDeleteModalOpen(true);
            }
          }}
        />
      </div>


      <ModalOverlay isOpen={isModalOpen} onOpenChange={setIsModalOpen}>
        <Modal className="max-w-lg bg-white p-6 rounded-2xl shadow-xl border outline-none">
          <Dialog>
            <div className="flex flex-col gap-6">
              <h2 className="text-xl font-bold">{entregaAEditar ? "Editar" : "Registrar"} Entrega</h2>
              <div className="flex flex-col gap-4">
                <SearchSelect
                  label="Persona que retira"
                  isRequired
                  options={personas.map(p => ({
                    label: `${p.nombre} (${p.nom_departamento || 'S/D'})`,
                    value: p.id_persona
                  }))}
                  value={formData.id_persona_retiro}
                  onChange={(val) => setFormData({ ...formData, id_persona_retiro: val })}
                  onAddNew={(name) => { setTempPersonaName(name); setIsPersonaModalOpen(true); }}
                />
                <SearchSelect
                  label="Responsable entrega"
                  isRequired
                  options={personas.map(p => ({ label: p.nombre, value: p.id_persona }))}
                  value={formData.id_persona_entrega}
                  onChange={(val) => setFormData({ ...formData, id_persona_entrega: val })}
                  onAddNew={(name) => { setTempPersonaName(name); setIsPersonaModalOpen(true); }}
                />
                <FormModel
                  key={entregaAEditar?.id_producto_entregado || "nueva"}
                  fields={[
                    { name: "id_producto", label: "Producto", type: "select", isRequired: true, defaultValue: entregaAEditar?.id_producto, options: productos.map(p => ({ label: p.tipo_producto, value: p.id_producto })) },
                    { name: "fecha_entrega", label: "Fecha entrega", type: "date", isRequired: true, defaultValue: entregaAEditar?.fecha || new Date().toISOString().split('T')[0] },
                    { name: "cantidad", label: "Cantidad", type: "number", isRequired: true, defaultValue: entregaAEditar?.cantidad || 1 }
                  ]}
                  onSubmit={handleGuardarEntrega}
                  loading={formLoading}
                  extraActions={<Button color="secondary" type="button" onClick={() => setIsModalOpen(false)}>Cancelar</Button>}
                />
              </div>
            </div>
          </Dialog>
        </Modal>
      </ModalOverlay>

      {/* modo persona */}
      <ModalOverlay isOpen={isPersonaModalOpen} onOpenChange={setIsPersonaModalOpen}>
        <Modal className="max-w-md bg-white p-6 rounded-2xl shadow-2xl border-t-4 border-primary-500 z-120 outline-none">
          <Dialog>
            <div className="flex flex-col gap-4">
              <h2 className="text-lg font-bold">Añadir Nueva Persona</h2>
              <FormModel
                fields={[
                  { name: "cedula", label: "Cédula", isRequired: true, placeholder: "0000000000" },
                  { name: "nombre", label: "Nombre", isRequired: true, defaultValue: tempPersonaName },
                  { name: "id_departamento", label: "Departamento", type: "select", isRequired: true, options: departamentos.map(d => ({ label: d.nom_departamento, value: d.id_departamento })) }
                ]}
                onSubmit={handleCrearPersona}
                loading={formLoading}
                submitLabel="Guardar Persona"
                extraActions={<Button color="secondary" type="button" onClick={() => setIsPersonaModalOpen(false)}>Cancelar</Button>}
              />
            </div>
          </Dialog>
        </Modal>
      </ModalOverlay>

      {/* modal para alvertencia */}
      <ModalOverlay isOpen={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <Modal className="max-w-sm bg-white p-6 rounded-2xl shadow-xl border border-red-100 outline-none">
          <Dialog>
            <div className="flex flex-col gap-5 text-center">
              <h2 className="text-lg font-bold text-gray-800">¿Eliminar registro?</h2>
              <p className="text-sm text-gray-500">
                ¿Estás seguro de borrar la entrega de <strong>{entregaAEliminar?.producto}</strong>?
                Esta acción no se puede deshacer.
              </p>
              <div className="flex gap-3">
                <Button className="flex-1" color="secondary" onClick={() => setIsDeleteModalOpen(false)}>
                  Cancelar
                </Button>
                <Button
                  className="flex-1 bg-red-600 text-white hover:bg-red-700 border-none shadow-sm"
                  onClick={handleConfirmarEliminar}
                >
                  Confirmar
                </Button>
              </div>
            </div>
          </Dialog>
        </Modal>
      </ModalOverlay>
    </div>
  );
}