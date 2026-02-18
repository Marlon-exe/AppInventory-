"use client"
import { Bar, CartesianGrid, Label, Legend, BarChart as RechartsBarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartLegendContent, ChartTooltipContent } from "@/components/application/charts/charts-base";
import { useBreakpoint } from "@/hooks/use-breakpoint";


//Datos que para la barra que son: la fecha transformada en semanas y  la cantidad de producto.
interface BarData {
    data: any[],
    productos: string[]
}

export const BarChart = ({ data, productos }: BarData) => {
    const isDesktop = useBreakpoint("lg");

    /*const colors: Record<string, string> = {
        A: "text-utility-brand-700",
        B: "text-utility-brand-500",
        C: "text-utility-gray-200",
    };*/
    const palette = [
        "text-utility-brand-700",
        "text-utility-brand-500",
        "text-utility-brand-300",
        "text-utility-gray-300",
        "text-utility-blue-500"
    ];
    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center h-60 text-gray-500">
                No hay datos disponibles para el rango seleccionado
            </div>
        );
    }

    return (
        <ResponsiveContainer  width="100%" height={300}>
            <RechartsBarChart
                data={data}
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
                    fill="currentColor"
                    axisLine={false}
                    tickLine={false}
                    tickMargin={11}
                    tickFormatter={(value, index) => {
                        const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
                        return dias[index] || value;
                    }}
                />
                <YAxis axisLine={false} tickLine={false}  allowDecimals={false} />
                <Tooltip
                    content={<ChartTooltipContent />}
                    labelFormatter={(value) => {
                        const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
                        // Muestra los dia en en el recudor de las barras
                        return dias[value] || value;
                    }}
                />

                {/* Barras*/}
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