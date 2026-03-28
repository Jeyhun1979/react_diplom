import type { Category, Item, BasicItem } from '../types'

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:7070'

const json = async (input: RequestInfo, init?: RequestInit) => {
  const response = await fetch(input, init)

  if (!response.ok) {
    const payload = await response.text()
    throw new Error(payload || response.statusText)
  }

  if (response.status === 204) {
    return null
  }

  return response.json()
}

export const fetchCategories = async (): Promise<Category[]> => {
  return json(`${BASE_URL}/api/categories`)
}

export const fetchTopSales = async (): Promise<BasicItem[]> => {
  return json(`${BASE_URL}/api/top-sales`)
}

export const fetchItems = async (params: {
  categoryId: number
  offset: number
  q: string
}): Promise<BasicItem[]> => {
  const url = new URL(`${BASE_URL}/api/items`)
  const { categoryId, offset, q } = params

  if (categoryId) {
    url.searchParams.set('categoryId', String(categoryId))
  }

  if (offset) {
    url.searchParams.set('offset', String(offset))
  }

  if (q.trim().length) {
    url.searchParams.set('q', q.trim())
  }

  return json(url.toString())
}

export const fetchItemById = async (id: number): Promise<Item> => {
  return json(`${BASE_URL}/api/items/${id}`)
}

export const postOrder = async ({
  owner,
  items,
}: {
  owner: { phone: string; address: string }
  items: Array<{ id: number; price: number; count: number }>
}): Promise<null> => {
  return json(`${BASE_URL}/api/order`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ owner, items }),
  })
}
