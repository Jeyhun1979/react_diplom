import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { addToCart } from '../store/cartSlice'
import { loadItem } from '../store/shopSlice'
import Preloader from '../components/Preloader/Preloader'
import type { Item } from '../types'

function ItemPageContent({ itemDetails }: { itemDetails: Item }) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [selectedSize, setSelectedSize] = useState('')
  const [count, setCount] = useState(1)

  const availableSizes = useMemo(
    () => itemDetails.sizes.filter(size => size.available),
    [itemDetails],
  )

  const handleAddToCart = () => {
    if (!selectedSize) {
      return
    }

    dispatch(
      addToCart({
        id: itemDetails.id,
        size: selectedSize,
        count,
        price: itemDetails.price,
        title: itemDetails.title,
        image: itemDetails.images[0] ?? '',
        color: itemDetails.color,
        sku: itemDetails.sku,
      }),
    )
    navigate('/cart.html')
  }

  return (
    <section className="catalog-item">
      <h2 className="text-center">{itemDetails.title}</h2>
      <div className="row">
        <div className="col-12 col-lg-5">
          <img src={itemDetails.images[0]} className="img-fluid" alt={itemDetails.title} />
        </div>
        <div className="col-12 col-lg-7">
          <table className="table table-bordered">
            <tbody>
              <tr>
                <td>Артикул</td>
                <td>{itemDetails.sku}</td>
              </tr>
              <tr>
                <td>Производитель</td>
                <td>{itemDetails.manufacturer}</td>
              </tr>
              <tr>
                <td>Цвет</td>
                <td>{itemDetails.color}</td>
              </tr>
              <tr>
                <td>Материалы</td>
                <td>{itemDetails.material}</td>
              </tr>
              <tr>
                <td>Сезон</td>
                <td>{itemDetails.season}</td>
              </tr>
              <tr>
                <td>Повод</td>
                <td>{itemDetails.reason}</td>
              </tr>
            </tbody>
          </table>
          {availableSizes.length > 0 ? (
            <>
              <div className="text-center">
                <p>
                  Размеры в наличии:{' '}
                  {availableSizes.map(size => (
                    <button
                      type="button"
                      key={size.size}
                      className={`catalog-item-size${selectedSize === size.size ? ' selected' : ''}`}
                      onClick={() => setSelectedSize(size.size)}
                    >
                      {size.size}
                    </button>
                  ))}
                </p>
                <p>
                  Количество:{' '}
                  <span className="btn-group btn-group-sm pl-2">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setCount(prev => Math.max(1, prev - 1))}
                      disabled={count === 1}
                    >
                      -
                    </button>
                    <button type="button" className="btn btn-outline-primary">
                      {count}
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setCount(prev => Math.min(10, prev + 1))}
                      disabled={count === 10}
                    >
                      +
                    </button>
                  </span>
                </p>
              </div>
              <button className="btn btn-danger btn-block btn-lg" onClick={handleAddToCart} disabled={!selectedSize}>
                В корзину
              </button>
            </>
          ) : null}
        </div>
      </div>
    </section>
  )
}

export default function ItemPage() {
  const dispatch = useAppDispatch()
  const { id } = useParams()
  const { itemDetails, loaders, itemError } = useAppSelector(state => state.shop)

  useEffect(() => {
    if (!id) {
      return
    }
    dispatch(loadItem(Number(id)))
  }, [dispatch, id])

  if (loaders.item) {
    return (
      <section className="catalog-item text-center">
        <Preloader />
      </section>
    )
  }

  if (itemError) {
    return <div className="text-center text-danger">{itemError}</div>
  }

  if (!itemDetails) {
    return null
  }

  return <ItemPageContent key={itemDetails.id} itemDetails={itemDetails} />
}
