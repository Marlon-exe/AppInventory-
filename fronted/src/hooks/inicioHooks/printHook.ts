import { useState } from 'react';
import { generarPDFEntregas } from '@/src/utils/printUtils';
import { EntregasService } from '@/src/api/services/entregaService';

export const usePrintLogic = (selectedRange: any) => {
    const [isPdfOpen, setIsPdfOpen] = useState(false);
    const [pdfUrl, setPdfUrl] = useState('');

    const handleImprimir = async () => {
        if (!selectedRange?.start || !selectedRange?.end) return;

        const start = selectedRange.start.toString();
        const end = selectedRange.end.toString();

        const registros = await EntregasService.getAllReport(start, end);
        const url = await generarPDFEntregas(registros, { start, end });

        setPdfUrl(url);
        setIsPdfOpen(true);
    };

    return { isPdfOpen, setIsPdfOpen, pdfUrl, handleImprimir };
};