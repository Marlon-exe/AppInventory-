"use client";

import { Bar, CartesianGrid, Legend, BarChart as RechartsBarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartLegendContent, ChartTooltipContent } from "@/components/application/charts/charts-base";
import { useBreakpoint } from "@/hooks/use-breakpoint";

interface BarData {
    data: any[];
    productos: string[];
}

const diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

const esLaborable = (isoFecha: string) => {
    const d = new Date(isoFecha);
    const day = d.getDay();
    return day >= 1 && day <= 5;
};

export const BarChart = ({ data, productos }: BarData) => {
    const isDesktop = useBreakpoint("lg");

    const palette = [
        "text-utility-brand-700",
        "text-utility-brand-500",
        "text-utility-brand-300",
        "text-utility-gray-300",
        "text-utility-blue-500",
    ];


    const dataFiltrada = (data ?? []).filter((row) => row?.fecha && esLaborable(row.fecha));

    if (!dataFiltrada || dataFiltrada.length === 0) {
        return (
            <div className="flex items-center justify-center h-60 text-gray-500">
                No hay datos disponibles para el rango seleccionado
            </div>
        );
    }

    return (
        <ResponsiveContainer width="100%" height={300}>
            <RechartsBarChart
                data={dataFiltrada}
                accessibilityLayer={false}
                className="text-tertiary [&_.recharts-text]:text-xs "
                margin={{
                    left: 4,
                    right: 0,
                    top: isDesktop ? 12 : 6,
                    bottom: 18,
                }}
            >
                <CartesianGrid vertical={false} stroke="currentColor" className="text-utility-gray-100" />

                <Legend
                    verticalAlign="top"
                    align="right"
                    layout={isDesktop ? "vertical" : "horizontal"}
                    content={<ChartLegendContent className="-translate-y-2" />}
                />

                <XAxis
                    dataKey="fecha"
                    axisLine={false}
                    tickLine={false}
                    tickMargin={11}
                    tickFormatter={(value) => {
                        const d = new Date(value + "T12:00:00"); // value: "YYYY-MM-DD"
                        return diasSemana[d.getDay()];
                    }}
                />

                <YAxis axisLine={false} tickLine={false} allowDecimals={false} />

                <Tooltip
                    content={<ChartTooltipContent />}
                    labelFormatter={(value) => {
                        const d = new Date(value);
                        return `${diasSemana[d.getDay()]} ${d.toLocaleDateString("es-EC")}`; // ✅ correcto
                    }}
                />

                {productos.map((prod, index) => (
                    <Bar
                        key={prod}
                        dataKey={prod}
                        name={prod}
                        stackId="a"
                        fill="currentColor"
                        className={palette[index % palette.length]}
                        maxBarSize={isDesktop ? 32 : 16}
                        radius={index === productos.length - 1 ? [6, 6, 0, 0] : [0, 0, 0, 0]}
                    />
                ))}
            </RechartsBarChart>
        </ResponsiveContainer>
    );
};
