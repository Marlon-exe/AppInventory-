
export const buildChartData = (dataAPI: any[]) => {
    const labels: string[] = [...new Set(dataAPI.map((d) => d.fecha))].sort();
    const productos: string[] = [...new Set(dataAPI.map((d) => d.producto))];

    const colores = [
        '#3B82F6', '#10B981', '#F59E0B', '#EF4444',
        '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'
    ];
    const formatearDia = (fecha: string) => {
        const [year, month, day] = fecha.split('-').map(Number);
        const date = new Date(year, month - 1, day);
        return date.toLocaleDateString('es-ES', { weekday: 'long' })
            .replace(/^\w/, c => c.toUpperCase());
    };
    const labelsFormateados = labels.map(formatearDia);

    const datasets = productos.map((producto, i) => ({
        type: 'bar',
        label: producto,
        backgroundColor: colores[i % colores.length],
        borderRadius: 6,
        stack: 'stack0',
        maxBarThickness: 60,
        data: labels.map(fecha => {
            const entry = dataAPI.find((d) => d.fecha === fecha && d.producto === producto);
            return entry ? entry.cantidad : 0;
        })
    }));

    return { labels: labelsFormateados, datasets };
};

export const buildChartOptions = () => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    return {
        maintainAspectRatio: false,
        aspectRatio: 0.8,
        plugins: {
            tooltip: {
                mode: 'index',
                intersect: false,
                callbacks: {
                    afterBody: (items: any[]) => {
                        const total = items.reduce((sum, item) => sum + item.parsed.y, 0);
                        return [``, `Total: ${total}`];
                    }
                }
            },
            legend: {
                labels: { color: textColor }
            },
        },
        scales: {
            x: {
                stacked: true,
                ticks: { color: textColorSecondary },
                grid: { color: surfaceBorder }
            },
            y: {
                stacked: true,
                ticks: {
                    color: textColorSecondary,
                    stepSize: 5,
                    precision: 0,
                    callback: (value: number) => Number.isInteger(value) ? value : null,
                },
                grid: { color: surfaceBorder },
                min: 0
            }
        }
    };
};