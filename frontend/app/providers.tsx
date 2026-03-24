'use client'

import { HeroUIProvider } from '@heroui/react'
import { PrimeReactProvider } from 'primereact/api';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrimeReactProvider>
      <HeroUIProvider > 
        {children}
      </HeroUIProvider>
    </PrimeReactProvider>
  )
}