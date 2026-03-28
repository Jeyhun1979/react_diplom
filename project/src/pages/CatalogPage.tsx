import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { loadCatalog, loadMoreCatalog, setSearchQuery } from '../store/shopSlice'
import type { BasicItem } from '../types'
import CategoryTabs from '../components/CategoryTabs/CategoryTabs'
import Preloader from '../components/Preloader/Preloader'
import ProductCard from '../components/ProductCard/ProductCard'

function CatalogPageContent({
  initialValue,
  catalogItems,
  loaders,
  error,
  hasMore,
  onSubmit,
  onLoadMore,
}: {
  initialValue: string
  catalogItems: BasicItem[]
  loaders: { catalog: boolean; loadMore: boolean }
  error: string | null
  hasMore: boolean
  onSubmit: (value: string) => void
  onLoadMore: () => void
}) {
  const [value, setValue] = useState(initialValue)

  return (
    <section className="catalog">
      <h2 className="text-center">Каталог</h2>
      <form
        className="catalog-search-form form-inline"
        onSubmit={event => {
          event.preventDefault()
          onSubmit(value.trim())
        }}
      >
        <input
          className="form-control"
          placeholder="Поиск"
          value={value}
          onChange={event => setValue(event.target.value)}
        />
      </form>
      <CategoryTabs />
      {loaders.catalog ? (
        <Preloader />
      ) : error ? (
        <div className="text-center text-danger">{error}</div>
      ) : (
        <>
          <div className="row">
            {catalogItems.map(item => (
              <ProductCard key={item.id} item={item} />
            ))}
          </div>
          {hasMore ? (
            <div className="text-center">
              <button className="btn btn-outline-primary" disabled={loaders.loadMore} onClick={onLoadMore}>
                {loaders.loadMore ? 'Загрузка...' : 'Загрузить ещё'}
              </button>
            </div>
          ) : null}
        </>
      )}
    </section>
  )
}

export default function CatalogPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const q = searchParams.get('q') ?? ''
  const { catalogItems, loaders, errors, hasMore } = useAppSelector(state => state.shop)

  useEffect(() => {
    dispatch(setSearchQuery(q))
    dispatch(loadCatalog())
  }, [dispatch, q])

  const handleSubmit = (value: string) => {
    const trimmed = value.trim()
    dispatch(setSearchQuery(trimmed))
    navigate(trimmed ? `/catalog.html?q=${encodeURIComponent(trimmed)}` : '/catalog.html')
    dispatch(loadCatalog())
  }

  return (
    <CatalogPageContent
      key={q}
      initialValue={q}
      catalogItems={catalogItems}
      loaders={loaders}
      error={errors.catalog}
      hasMore={hasMore}
      onSubmit={handleSubmit}
      onLoadMore={() => dispatch(loadMoreCatalog())}
    />
  )
}
