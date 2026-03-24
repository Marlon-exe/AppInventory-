"use client"
import { usePersonaLogic } from "@/src/hooks/daPersonalHooks/pesonalLogic";
import { Input, Button, Spinner, Avatar, Divider, Chip, Card, CardBody } from "@heroui/react";

const SECCIONES_DATOS = [
  {
    titulo: "Información Personal",
    campos: [
      { key: "fecha_nac", label: "Fecha Nacimiento" },
      { key: "estado_civil", label: "Estado Civil" },
      { key: "email", label: "Correo Electrónico" },
      { key: "direccion", label: "Dirección" },
    ]
  },
  {
    titulo: "Otros",
    campos: [
      { key: "discapacidad", label: "Discapacidad" },
      { key: "porcen_disc", label: "Porcentaje Discap.", suffix: "%" },
      { key: "estado_cuenta", label: "Estado de Cuenta" },
      { key: "cambiar_password", label: "Cambio de Clave" },
    ]
  }
];


export default function PersonaPage() {
  const { persona, loading, busqueda, setBusqueda, buscarPersona } = usePersonaLogic();

  return (
    <div className="flex flex-col gap-4 p-6 w-full max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold">Expediente Digital</h2>

      {/* Buscador */}
      <div className="flex gap-2 mb-4">
        <Input
          placeholder="Cédula..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && buscarPersona(busqueda)}
        />
        <Button color="primary" onPress={() => buscarPersona(busqueda)} isLoading={loading}>
          Buscar
        </Button>
      </div>

      {persona && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-appearance-in">

          {/* Lateral: Foto y Firma */}
          <Card className="lg:col-span-4 shadow-sm border-none">
            <CardBody className="flex flex-col items-center gap-6 p-8 text-center">
              <Avatar src={persona.foto} className="w-48 h-56 rounded-3xl shadow-xl" />
              <div>
                <h3 className="text-xl font-bold text-primary uppercase">{persona.nombre}</h3>
                <p className="text-default-400 font-mono">{persona.cedula}</p>
              </div>
              <Divider />
              <div className="w-full bg-default-50 p-4 rounded-2xl border border-divider">
                <p className="text-[10px] font-bold text-default-400 uppercase mb-2">Firma</p>
                <img src={persona.firma} className="h-12 mx-auto mix-blend-multiply" alt="Firma" />
              </div>
            </CardBody>
          </Card>

          {/* Contenido*/}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {SECCIONES_DATOS.map((seccion, idx) => (
              <Card key={idx} className="shadow-sm border-none mb-4">
                <CardBody className="p-6">
                  <h4 className="text-sm font-bold text-default-800 mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-4 bg-primary rounded-full"></span>
                    {seccion.titulo}
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                    {seccion.campos.map((campo) => (
                      <div key={campo.key} className="flex justify-between py-2 border-b border-divider last:border-0 items-center">
                        <span className="text-[10px] uppercase font-bold text-default-400">
                          {campo.label}
                        </span>
                        <span className="text-sm font-semibold text-default-700 uppercase">
                          {/* Acceso directo al valor sin transformar */}
                          {(persona as any)[campo.key] || '---'}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            ))}

            {/* Bloque Cónyuge  */}
            {persona.conyuge && (
              <Card className="shadow-sm border-none bg-primary-50/20">
                <CardBody className="p-6 flex justify-between items-center">
                  <div>
                    <p className="text-[10px] font-bold text-primary-400 uppercase tracking-widest">Cónyuge</p>
                    <p className="font-bold text-default-800">{persona.conyuge.nombre}</p>
                  </div>
                  <Button size="sm" color="primary" variant="flat" onPress={() => buscarPersona(persona.conyuge.cedula)}>
                    Ver Perfil
                  </Button>
                </CardBody>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}