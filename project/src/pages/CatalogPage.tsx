import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  loadCatalog,
  loadMoreCatalog,
  setCategory,
  setSearchQuery,
} from "../store/shopSlice";
import type { BasicItem } from "../types";
import CategoryTabs from "../components/CategoryTabs/CategoryTabs";
import Preloader from "../components/Preloader/Preloader";
import ProductCard from "../components/ProductCard/ProductCard";

function CatalogPageContent({
  initialValue,
  catalogItems,
  loaders,
  error,
  hasMore,
  onSubmit,
  onLoadMore,
}: {
  initialValue: string;
  catalogItems: BasicItem[];
  loaders: { catalog: boolean; loadMore: boolean };
  error: string | null;
  hasMore: boolean;
  onSubmit: (value: string) => void;
  onLoadMore: () => void;
}) {
  const [value, setValue] = useState(initialValue);

  return (
    <section className="catalog">
      <h2 className="text-center">Каталог</h2>
      <form
        className="catalog-search-form form-inline"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit(value.trim());
        }}
      >
        <input
          className="form-control"
          placeholder="Поиск"
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
      </form>
      <CategoryTabs />
      {loaders.catalog ? (
        <Preloader />
      ) : error && catalogItems.length === 0 ? (
        <div className="text-center text-danger">{error}</div>
      ) : (
        <>
          <div className="row">
            {catalogItems.map((item) => (
              <ProductCard key={item.id} item={item} />
            ))}
          </div>
          {error && catalogItems.length > 0 ? (
            <div className="text-center text-danger mb-3">
              {error}{" "}
              <button
                className="btn btn-link"
                type="button"
                onClick={onLoadMore}
              >
                Повторить
              </button>
            </div>
          ) : null}
          {hasMore ? (
            <div className="text-center">
              <button
                className="btn btn-outline-primary"
                disabled={loaders.loadMore}
                onClick={onLoadMore}
              >
                {loaders.loadMore ? "Загрузка..." : "Загрузить ещё"}
              </button>
            </div>
          ) : null}
        </>
      )}
    </section>
  );
}

export default function CatalogPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const { catalogItems, loaders, errors, hasMore, categories } = useAppSelector(
    (state) => state.shop,
  );

  const getMatchingCategory = (value: string) => {
    const query = value.toLowerCase();
    return categories.find((category) => {
      const title = category.title.toLowerCase();
      return (
        query &&
        (title === query || title.includes(query) || query.includes(title))
      );
    });
  };

  useEffect(() => {
    const trimmed = q.trim();
    const matchingCategory = getMatchingCategory(trimmed);

    if (matchingCategory) {
      dispatch(setSearchQuery(""));
      dispatch(setCategory(matchingCategory.id));
    } else {
      dispatch(setSearchQuery(trimmed));
      dispatch(setCategory(0));
    }

    dispatch(loadCatalog());
  }, [dispatch, q, categories]);

  const handleSubmit = (value: string) => {
    const trimmed = value.trim();
    const matchingCategory = getMatchingCategory(trimmed);

    if (matchingCategory) {
      dispatch(setSearchQuery(""));
      dispatch(setCategory(matchingCategory.id));
    } else {
      dispatch(setSearchQuery(trimmed));
      dispatch(setCategory(0));
    }

    navigate(
      trimmed ? `/catalog?q=${encodeURIComponent(trimmed)}` : "/catalog",
    );
    dispatch(loadCatalog());
  };

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
  );
}
