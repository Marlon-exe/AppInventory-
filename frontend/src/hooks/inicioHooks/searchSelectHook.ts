import { useState } from 'react';

interface SearchOption {
    label: string;
    display?:string;
    value: string | number;
}

export const useSearchSelect = (options: SearchOption[], onAddNew?: (query: string) => void) => {
    const [query, setQuery] = useState('');
    

   const filteredOptions: SearchOption[] = (() => {
        if (query.trim().length === 0) return options;

        const filtered = options.filter(o =>
            o.label.toLowerCase().includes(query.toLowerCase())
        );

        if (filtered.length === 0 && onAddNew) {
            return [{ label: `+ Añadir "${query}" como nueva persona`, value: '__add_new__' }];
        }

        return filtered;
    })();

    const handleInputChange = (val: string) => setQuery(val);

    const handleSelectionChange = (key: any, onChange: (val: any) => void) => {
        if (key === '__add_new__') {
            onAddNew?.(query);
            return;
        }
        onChange(key ? Number(key) : null);
    };

    return { filteredOptions, handleInputChange, handleSelectionChange };
};