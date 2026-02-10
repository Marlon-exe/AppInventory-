"use client"
import { useState, useMemo, useRef, useEffect } from "react";

interface SearchSelectProps {
  label: string;
  options: { label: string; value: string | number }[];
  value: any;
  onChange: (value: any) => void;
  onAddNew: (searchQuery: string) => void;
  placeholder?: string;
  isRequired?: boolean;
}

export function SearchSelect({ label, options, value, onChange, onAddNew, placeholder = "Buscar...", isRequired }: SearchSelectProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const filtered = useMemo(() => 
    options.filter(o => o.label.toLowerCase().includes(query.toLowerCase())), 
  [options, query]);

  const currentLabel = options.find(o => o.value === value)?.label || "";

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 relative" ref={containerRef}>
      <label className="text-sm font-semibold text-gray-700 sm:w-1/3 shrink-0">
        {label} {isRequired && <span className="text-red-500">*</span>}
      </label>
      <div className="flex-1 relative w-full">
        <input
          type="text"
          className="h-10 w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={currentLabel || placeholder}
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }}
        />
        {isOpen && (
          <div className="absolute z-110 mt-1 w-full max-h-56 overflow-auto rounded-md bg-white shadow-xl border border-gray-200">
            {filtered.length > 0 ? (
              filtered.map(o => (
                <div key={o.value} className="px-4 py-2 text-sm hover:bg-blue-50 cursor-pointer" 
                     onClick={() => { onChange(o.value); setQuery(""); setIsOpen(false); }}>
                  {o.label}
                </div>
              ))
            ) : (
              <div className="px-4 py-2 text-sm text-blue-600 font-bold hover:bg-gray-50 cursor-pointer"
                   onClick={() => { onAddNew(query); setIsOpen(false); }}>
                + Añadir "{query}" como nueva persona
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}