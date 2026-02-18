"use client"

import { useMemo, useCallback, useState} from "react";
import { Button } from "@/components/base/buttons/button";
import { FormModel } from "@/components/application/forms/form-model";
import { ColumnConfig, TableModel } from "@/components/application/table/table-model";

type CatalogoItem = { nombre: string };

type CatalogoApiResponse = {
    success: boolean;
    total: number;
    paginas: number;
    data: CatalogoItem[];
};

const COLUMNAS_CATALOGO: ColumnConfig<CatalogoItem>[] = [
    {
        key: "nombre",
        label: "Producto",
        isRowHeader: true
    }
];
export default function CatalogoPage() {
    const [items, setItems] = useState<CatalogoItem[]>([]);
    const [meta, setMeta] = useState({ total: 0, paginas: 0 });
    const [loading, setLoading] = useState(false);
    const [ultimaBusqueda, setUltimaBusqueda] = useState("");

    const buscar = useCallback(async (form: any) => {
        const valor = String(form.valor ?? "").trim();
        if (!valor) return;

        try {
            setLoading(true);
            setUltimaBusqueda(valor);

            const res: CatalogoApiResponse = await fetch(
                `http://localhost:4000/api/catalogo?valor=${encodeURIComponent(valor)}`,
                { cache: "no-store" }
            ).then((r) => r.json());

            if (!res.success) {
                setItems([]);
                setMeta({ total: 0, paginas: 0 });
                alert("No se pudo consultar el catálogo");
                return;
            }

            setItems(res.data ?? []);
            setMeta({ total: res.total ?? 0, paginas: res.paginas ?? 0 });
        } catch (e) {
            console.error(e);
            alert("Error de conexión consultando el catálogo");
        } finally {
            setLoading(false);
        }

    }, []);

    const titulo = useMemo(() => {
        if (!ultimaBusqueda) return "Resultados"
        return `Resultados para: ${ultimaBusqueda}`;
    }, [ultimaBusqueda]);


return (
    <div className="p-1">
      <div className="bg-white p-6 rounded-2xl shadow-sm flex flex-col gap-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Catálogo</h1>
      </div>

        {/* bucador */}
        <div className="flex flex-col gap-3">
          <FormModel
            fields={[
              {
                name: "valor",
                label: "Buscar producto",
                isRequired: true,
                //placeholder: "Ej: A3, papel, impresora, toner...",
              },
            ]}
            onSubmit={buscar}
            loading={loading}
            submitLabel="Buscar"
            extraActions={
              <Button
                type="button"
                color="secondary"
                onClick={() => {
                  setItems([]);
                  setMeta({ total: 0, paginas: 0 });
                  setUltimaBusqueda("");
                }}
              >
                Limpiar
              </Button>
            }
          />
        </div>

        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-800">{titulo}</h2>
          <div className="text-sm text-gray-500">
            {meta.total > 0 ? (
              <>
                Total: <span className="font-semibold">{meta.total}</span> · Páginas:{" "}
                <span className="font-semibold">{meta.paginas}</span>
              </>
            ) : (
              "—"
            )}
          </div>
        </div>

        
        <TableModel
          items={items}
          columns={COLUMNAS_CATALOGO}
          getRowId={(it) => it.nombre}
        />
      </div>
    </div>
  );
}