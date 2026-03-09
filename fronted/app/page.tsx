"use client"

import { usePageLogic } from "@/src/hooks/inicioHooks/logicHome";
import { EntregasView } from "@/src/componets/entregas/entregasView";

export default function EntregasPage() {
  const logic = usePageLogic();

  return <EntregasView logic={logic} />;
}