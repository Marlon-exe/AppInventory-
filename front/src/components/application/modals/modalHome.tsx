import { Button, Dialog, Modal, ModalOverlay } from "react-aria-components";

interface PDFModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  pdfUrl: string;
}

export const PDFModal = ({ isOpen, onOpenChange, pdfUrl }: PDFModalProps) => {
  return (
    <ModalOverlay
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
    >
      <Modal className="w-[95vw] max-w-5xl h-[90vh] bg-white rounded-2xl shadow-2xl outline-none overflow-hidden">
        <Dialog className="flex flex-col h-full outline-none">
          {/* Cabecera */}
          <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50">
            <h2 className="text-xl font-bold text-gray-800">Vista de Reporte</h2>
            <Button
              onPress={() => onOpenChange(false)}
              className="px-4 py-2 bg-gray-200 hover:bg-red-500 hover:text-white rounded-lg transition-colors"
            >
              Cerrar
            </Button>
          </div>

          {/* Visor de PDF */}
          <div className="flex-1 bg-gray-100">
            {pdfUrl ? (
              <iframe
                src={pdfUrl}
                className="w-full h-full border-none"
                title="Visor PDF"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="text-gray-500 italic">Generando documento...</p>
              </div>
            )}
          </div>
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
};