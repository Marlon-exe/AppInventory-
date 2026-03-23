"use client"
import { Autocomplete, AutocompleteItem } from "@heroui/react";

interface SearchOption {
    label: string;
    value: string | number;
}

interface SearchSelectProps {
    label: string;
    options: SearchOption[];
    value: any;
    onChange?: (value: any) => void;
    onInputChange: (val: string) => void;
    onSelectionChange: (key: any) => void;
    placeholder?: string;
    isRequired?: boolean;
     maxLength?: number;
}

export function SearchSelect({ label, options, value, onChange, onInputChange, onSelectionChange, placeholder = "Buscar...", isRequired, maxLength}: SearchSelectProps) {
    return (
        <Autocomplete
            label={label}
            placeholder={placeholder}
            variant="bordered"
            isRequired={isRequired}
            defaultItems={options}
            selectedKey={value ? String(value) : null}
            onInputChange={onInputChange}
            onSelectionChange={onSelectionChange}
            maxLength={maxLength}
        >
            {(item) => (
                <AutocompleteItem
                    key={String(item.value)}
                    className={item.value === '__add_new__' ? 'text-primary font-semibold' : ''}
                >
                    {item.label}
                </AutocompleteItem>
            )}
        </Autocomplete>
    );
}