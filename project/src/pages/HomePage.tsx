import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { loadCatalog, loadMoreCatalog } from "../store/shopSlice";
import CategoryTabs from "../components/CategoryTabs/CategoryTabs";
import Preloader from "../components/Preloader/Preloader";
import ProductCard from "../components/ProductCard/ProductCard";

export default function HomePage() {
  const dispatch = useAppDispatch();
  const { topSales, loaders, errors, catalogItems, hasMore } = useAppSelector(
    (state) => state.shop,
  );

  useEffect(() => {
    dispatch(loadCatalog());
  }, [dispatch]);

  const showTopSales =
    loaders.topSales || errors.topSales !== null || topSales.length > 0;

  return (
    <>
      {showTopSales ? (
        <section className="top-sales">
          <h2 className="text-center">Хиты продаж!</h2>
          {loaders.topSales ? (
            <Preloader />
          ) : errors.topSales ? (
            <div className="text-center text-danger">{errors.topSales}</div>
          ) : (
            <div className="row">
              {topSales.map((item) => (
                <ProductCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </section>
      ) : null}
      <section className="catalog">
        <h2 className="text-center">Каталог</h2>
        <CategoryTabs />
        {loaders.catalog ? (
          <Preloader />
        ) : errors.catalog && catalogItems.length === 0 ? (
          <div className="text-center text-danger">{errors.catalog}</div>
        ) : (
          <>
            <div className="row">
              {catalogItems.map((item) => (
                <ProductCard key={item.id} item={item} />
              ))}
            </div>
            {errors.catalog && catalogItems.length > 0 ? (
              <div className="text-center text-danger mb-3">
                {errors.catalog}{" "}
                <button
                  type="button"
                  className="btn btn-link"
                  onClick={() => dispatch(loadMoreCatalog())}
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
                  onClick={() => dispatch(loadMoreCatalog())}
                >
                  {loaders.loadMore ? "Загрузка..." : "Загрузить ещё"}
                </button>
              </div>
            ) : null}
          </>
        )}
      </section>
    </>
  );
}
