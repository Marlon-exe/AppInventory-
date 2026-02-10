"use client"
import { useState } from "react";
import type { SortDescriptor } from "react-aria-components"

import { PaginationPageMinimalCenter } from "../pagination/pagination";
import { Table, TableCard } from "./table";
import { Button } from "@/components/base/buttons/button";


//Inyeccion de cabeceras
export interface ColumnConfig<T> {
    key: string;
    label: string;
    isRowHeader?: boolean;
    allowsSorting?: boolean;
    render?: (item: T) => React.ReactNode;
    className?: string
}
export interface TableActions<T> {
    onEdit?: (item: T) => void;
    onDelete?: (item: T) => void;
    onView?: (item: T) => void;
}

interface TableModelProps<T> {
    items: T[];
    columns: ColumnConfig<T>[];
    actions?: TableActions<T>;
    paginaActual?: number;
    totalPaginas?: number;
    onPageChange?: (page: number) => void;
    ariaLabel?: string;
    getRowId: (item: T) => string | number;
    defaultSortColumn?: string;
    defaultSortDirection?: "ascending" | "descending";
}

export function TableModel<T extends object>({
    items,
    columns,
    actions,
    paginaActual,
    totalPaginas,
    onPageChange,
    ariaLabel = "Tabla de datos",
    getRowId,
    defaultSortColumn,
    defaultSortDirection = "ascending"
}: TableModelProps<T>) {
    const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
        column: defaultSortColumn || columns[0]?.key,
        direction: defaultSortDirection,
    });

    const allColumns: ColumnConfig<T>[] = [
        ...columns,
        ...(actions ? [{
            key: "actions",
            label: "", 
            className: "text-right",
            render: (item: T) => (
                <div className="flex items-center justify-end gap-3">
                    {actions.onView && (
                        <Button size="sm" color="link-color" onClick={() => actions.onView!(item)}>
                            View
                        </Button>
                    )}
                    {actions.onEdit && (
                        <Button size="sm" color="link-color" onClick={() => actions.onEdit!(item)}>
                            Edit
                        </Button>
                    )}
                    {actions.onDelete && (
                        <Button size="sm" color="link-gray" onClick={() => actions.onDelete!(item)} className="text-error-600">
                            Delete
                        </Button>
                    )}
                </div>
            )
        }] : [])
    ];
    return (
        <TableCard.Root>
            <Table
                aria-label={ariaLabel}
                selectionMode="none"
                sortDescriptor={sortDescriptor}
                onSortChange={setSortDescriptor}
            >
                <Table.Header>
                    {allColumns.map((column) => (
                        <Table.Head
                            key={column.key}
                            id={column.key}
                            label={column.label}
                            isRowHeader={column.isRowHeader}
                            allowsSorting={column.allowsSorting}
                        />
                    ))}
                </Table.Header>
                <Table.Body items={items}>
                    {(item) => (
                        <Table.Row id={getRowId(item)}>
                            {allColumns.map((column) => (
                                <Table.Cell
                                    key={column.key}
                                    className={column.className}
                                >
                                    {column.render
                                        ? column.render(item)
                                        : String((item as any)[column.key] ?? '')}
                                </Table.Cell>
                            ))}
                        </Table.Row>
                    )}
                </Table.Body>
            </Table>
            {typeof paginaActual === 'number' && typeof totalPaginas === 'number' && onPageChange && (
                <PaginationPageMinimalCenter
                    page={paginaActual}
                    total={totalPaginas}
                    onPageChange={onPageChange}
                    className="px-4 py-3 md:px-6 md:pt-3 md:pb-4"
                />
            )}
        </TableCard.Root>
    )
}