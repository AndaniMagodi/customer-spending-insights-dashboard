import { CarFront, Film, ShoppingBag, ShoppingCart, Utensils, Zap, type LucideIcon } from 'lucide-react'

const icons: Record<string, LucideIcon> = {
  'shopping-cart': ShoppingCart,
  film: Film,
  car: CarFront,
  utensils: Utensils,
  'shopping-bag': ShoppingBag,
  zap: Zap,
}

export function CategoryIcon({ name, color, size = 16 }: { name: string; color: string; size?: number }) {
  const Icon = icons[name] ?? ShoppingCart
  return <Icon size={size} aria-hidden="true" style={{ color }} />
}
