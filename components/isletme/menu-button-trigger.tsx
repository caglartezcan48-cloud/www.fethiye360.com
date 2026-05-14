'use client'

import { useState } from 'react'
import { List } from 'lucide-react'
import { OrderLayout } from './order-layout'

interface MenuButtonTriggerProps {
  products: any[]
  businessName: string
  whatsappNumber?: string
  className?: string
  label?: string
}

export function MenuButtonTrigger({ 
  products, 
  businessName, 
  whatsappNumber, 
  className, 
  label 
}: MenuButtonTriggerProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)} 
        className={className}
      >
        <List className="w-4 h-4" /> {label || 'MENÜYÜ GÖR'}
      </button>

      {/* Katalog Overlay */}
      <OrderLayout 
        products={products} 
        businessName={businessName} 
        whatsappNumber={whatsappNumber}
        isFullMenuOpen={isOpen}
        onCloseMenu={() => setIsOpen(false)}
      />
    </>
  )
}
