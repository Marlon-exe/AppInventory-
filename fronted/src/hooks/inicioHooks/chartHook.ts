import { useCallback,useEffect, useState } from "react";
import { EntregasService } from "../../api/services/entregaService";
import { buildChartData, buildChartOptions } from "../../utils/chartUtils";

interface ChartData {
    labels: string[];
    datasets: any[];
}

interface DateRange {
    start: { toString: () => string };
    end: { toString: () => string };
}

export const useChartLogic = (selectedRange: DateRange) => {
    const [loading, setLoading] = useState(false);
    const [chartOptions, setChartOptions] = useState({});
    const [chartData, setChartData] = useState<ChartData>({
        labels: [],
        datasets: [],
    });

     const fetchMetricas = useCallback(async () => {
        try {
            setLoading(true);
            const start = selectedRange.start.toString();
            const end = selectedRange.end.toString();
            const dataAPI = await EntregasService.getMetricas(start, end);
            if (Array.isArray(dataAPI)) {
                setChartData(buildChartData(dataAPI));
            }
        } catch (error) {
            console.error("Error cargando metricas", error);
        } finally {
            setLoading(false);
        }
    }, [selectedRange]);

    useEffect(() => {
        setChartOptions(buildChartOptions());
        fetchMetricas();
    }, [fetchMetricas]);

    return {
        chartData,
        chartOptions,
        loading,
        refreshChart: fetchMetricas,
    };
};