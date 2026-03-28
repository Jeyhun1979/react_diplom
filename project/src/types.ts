export type Category = {
  id: number
  title: string
}

export type ItemSize = {
  size: string
  available: boolean
}

export type Item = {
  id: number
  category: number
  title: string
  price: number
  images: string[]
  sku: string
  manufacturer: string
  color: string
  material: string
  reason: string
  season: string
  heelSize?: string
  oldPrice?: number
  sizes: ItemSize[]
}

export type BasicItem = {
  id: number
  category: number
  title: string
  price: number
  images: string[]
}

export type CartItem = {
  id: number
  size: string
  count: number
  price: number
  title: string
  image: string
  color: string
  sku: string
}
