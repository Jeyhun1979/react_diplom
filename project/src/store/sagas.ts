import { call, put, select, takeLatest, takeEvery } from 'redux-saga/effects'
import {
  fetchCategories,
  fetchTopSales,
  fetchItems,
  fetchItemById,
  postOrder,
} from '../api'
import {
  loadCategories,
  loadCategoriesFailure,
  loadCategoriesSuccess,
  loadCatalog,
  loadCatalogFailure,
  loadCatalogSuccess,
  loadItem,
  loadItemFailure,
  loadItemSuccess,
  loadMoreCatalog,
  loadMoreCatalogFailure,
  loadMoreCatalogSuccess,
  loadTopSales,
  loadTopSalesFailure,
  loadTopSalesSuccess,
} from './shopSlice'
import { placeOrderFailure, placeOrderRequest, placeOrderSuccess } from './cartSlice'
import type { RootState } from './index'
import type { Category, BasicItem, Item } from '../types'
import type { SagaIterator } from '@redux-saga/types'

const selectShopState = (state: RootState) => state.shop

function* handleLoadCategories(): SagaIterator {
  try {
    const categories: Category[] = yield call(fetchCategories)
    yield put(loadCategoriesSuccess(categories))
  } catch (error) {
    yield put(loadCategoriesFailure((error as Error).message || 'Не удалось загрузить категории'))
  }
}

function* handleLoadTopSales(): SagaIterator {
  try {
    const topSales: BasicItem[] = yield call(fetchTopSales)
    yield put(loadTopSalesSuccess(topSales))
  } catch (error) {
    yield put(loadTopSalesFailure((error as Error).message || 'Не удалось загрузить хиты продаж'))
  }
}

function* handleLoadCatalog(): SagaIterator {
  try {
    const state: RootState['shop'] = yield select(selectShopState)
    const { selectedCategoryId, searchQuery } = state
    const items: BasicItem[] = yield call(fetchItems, {
      categoryId: selectedCategoryId,
      offset: 0,
      q: searchQuery,
    })
    yield put(loadCatalogSuccess(items))
  } catch (error) {
    yield put(loadCatalogFailure((error as Error).message || 'Не удалось загрузить каталог'))
  }
}

function* handleLoadMoreCatalog(): SagaIterator {
  try {
    const state: RootState['shop'] = yield select(selectShopState)
    const { selectedCategoryId, searchQuery, offset } = state
    const items: BasicItem[] = yield call(fetchItems, {
      categoryId: selectedCategoryId,
      offset,
      q: searchQuery,
    })
    yield put(loadMoreCatalogSuccess(items))
  } catch (error) {
    yield put(loadMoreCatalogFailure((error as Error).message || 'Не удалось загрузить дополнительные товары'))
  }
}

function* handleLoadItem(action: ReturnType<typeof loadItem>): SagaIterator {
  try {
    const item: Item = yield call(fetchItemById, action.payload)
    yield put(loadItemSuccess(item))
  } catch (error) {
    yield put(loadItemFailure((error as Error).message || 'Не удалось загрузить товар'))
  }
}

function* handlePlaceOrder(action: ReturnType<typeof placeOrderRequest>): SagaIterator {
  try {
    yield call(postOrder, {
      owner: {
        phone: action.payload.phone,
        address: action.payload.address,
      },
      items: action.payload.items,
    })
    yield put(placeOrderSuccess())
  } catch (error) {
    yield put(placeOrderFailure((error as Error).message || 'Не удалось оформить заказ'))
  }
}

export function* rootSaga() {
  yield takeEvery(loadCategories, handleLoadCategories)
  yield takeEvery(loadTopSales, handleLoadTopSales)
  yield takeLatest(loadCatalog, handleLoadCatalog)
  yield takeLatest(loadMoreCatalog, handleLoadMoreCatalog)
  yield takeLatest(loadItem, handleLoadItem)
  yield takeLatest(placeOrderRequest, handlePlaceOrder)
}
