import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { BasicItem, Category, Item } from '../types'

const initialState = {
  categories: [] as Category[],
  topSales: [] as BasicItem[],
  catalogItems: [] as BasicItem[],
  selectedCategoryId: 0,
  searchQuery: '',
  offset: 0,
  hasMore: true,
  loaders: {
    categories: false,
    topSales: false,
    catalog: false,
    loadMore: false,
    item: false,
  },
  errors: {
    categories: null as string | null,
    topSales: null as string | null,
    catalog: null as string | null,
  },
  itemDetails: null as Item | null,
  itemError: null as string | null,
}

export const shopSlice = createSlice({
  name: 'shop',
  initialState,
  reducers: {
    loadCategories(state) {
      state.loaders.categories = true
      state.errors.categories = null
    },
    loadCategoriesSuccess(state, action: PayloadAction<Category[]>) {
      state.loaders.categories = false
      state.categories = [{ id: 0, title: 'Все' }, ...action.payload]
    },
    loadCategoriesFailure(state, action: PayloadAction<string>) {
      state.loaders.categories = false
      state.errors.categories = action.payload
    },
    loadTopSales(state) {
      state.loaders.topSales = true
      state.errors.topSales = null
    },
    loadTopSalesSuccess(state, action: PayloadAction<BasicItem[]>) {
      state.loaders.topSales = false
      state.topSales = action.payload
    },
    loadTopSalesFailure(state, action: PayloadAction<string>) {
      state.loaders.topSales = false
      state.errors.topSales = action.payload
    },
    setCategory(state, action: PayloadAction<number>) {
      state.selectedCategoryId = action.payload
      state.catalogItems = []
      state.offset = 0
      state.hasMore = true
      state.errors.catalog = null
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload
      state.catalogItems = []
      state.offset = 0
      state.hasMore = true
      state.errors.catalog = null
    },
    loadCatalog(state) {
      state.loaders.catalog = true
      state.errors.catalog = null
    },
    loadCatalogSuccess(state, action: PayloadAction<BasicItem[]>) {
      state.loaders.catalog = false
      state.catalogItems = action.payload
      state.offset = action.payload.length
      state.hasMore = action.payload.length === 6
    },
    loadCatalogFailure(state, action: PayloadAction<string>) {
      state.loaders.catalog = false
      state.errors.catalog = action.payload
    },
    loadMoreCatalog(state) {
      state.loaders.loadMore = true
      state.errors.catalog = null
    },
    loadMoreCatalogSuccess(state, action: PayloadAction<BasicItem[]>) {
      state.loaders.loadMore = false
      state.catalogItems = [...state.catalogItems, ...action.payload]
      state.offset = state.catalogItems.length
      state.hasMore = action.payload.length === 6
    },
    loadMoreCatalogFailure(state, action: PayloadAction<string>) {
      state.loaders.loadMore = false
      state.errors.catalog = action.payload
    },
    loadItem(state, action: PayloadAction<number>) {
      void action
      state.loaders.item = true
      state.itemDetails = null
      state.itemError = null
    },
    loadItemSuccess(state, action: PayloadAction<Item>) {
      state.loaders.item = false
      state.itemDetails = action.payload
    },
    loadItemFailure(state, action: PayloadAction<string>) {
      state.loaders.item = false
      state.itemError = action.payload
    },
  },
})

export const {
  loadCategories,
  loadCategoriesSuccess,
  loadCategoriesFailure,
  loadTopSales,
  loadTopSalesSuccess,
  loadTopSalesFailure,
  setCategory,
  setSearchQuery,
  loadCatalog,
  loadCatalogSuccess,
  loadCatalogFailure,
  loadMoreCatalog,
  loadMoreCatalogSuccess,
  loadMoreCatalogFailure,
  loadItem,
  loadItemSuccess,
  loadItemFailure,
} = shopSlice.actions

export default shopSlice.reducer
