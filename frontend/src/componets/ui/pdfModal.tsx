"use client"
import { ModalBase } from "@/src/componets/ui/modal";

interface PDFModalProps {
    isOpen: boolean;
    onClose: () => void;
    pdfUrl: string;
}

export const PDFModal = ({ isOpen, onClose, pdfUrl }: PDFModalProps) => (
    <ModalBase
        isOpen={isOpen}
        onClose={onClose}
        title="Vista previa del reporte"
        size="5xl"
        scrollBehavior="inside"
        buttons={[
            { label: "Cerrar", color: "default", variant: "flat", onPress: onClose },
        ]}
    >
        <iframe
            src={pdfUrl}
            className="w-full h-[70vh] rounded-lg border border-divider"
        />
    </ModalBase>
);