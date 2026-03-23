"use client"
import { Chart } from "primereact/chart"

interface ChartProps {
    data: any;
    options: any;
    className?: string
    height?: string;
}

export const ChartGrafic = ({ data, options, className = "card flex justify-center", height = "320px" }: ChartProps) => {
    return (
        <div className={className} >
            <Chart type="bar" data={data} options={options} style={{ height }} />
        </div>
    )
}