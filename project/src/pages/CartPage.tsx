import { useMemo, useState, type FormEvent } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { placeOrderRequest, removeFromCart } from '../store/cartSlice'

export default function CartPage() {
  const dispatch = useAppDispatch()
  const { items, orderStatus, orderError } = useAppSelector(state => state.cart)
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')

  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.count, 0),
    [items],
  )

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!items.length) {
      return
    }
    dispatch(
      placeOrderRequest({
        phone,
        address,
        items: items.map(item => ({ id: item.id, price: item.price, count: item.count })),
      }),
    )
  }

  return (
    <section className="cart">
      <h2 className="text-center">Корзина</h2>
      {items.length === 0 ? (
        <div className="text-center">В корзине пока нет товаров.</div>
      ) : (
        <div className="cart-list">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Товар</th>
                <th>Размер</th>
                <th>Цена</th>
                <th>Количество</th>
                <th>Сумма</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={`${item.id}-${item.size}`}>
                  <td className="align-middle">
                    <div className="cart-item">
                      <img src={item.image} alt={item.title} />
                      <div>
                        <div>{item.title}</div>
                        <div>{item.color}</div>
                      </div>
                    </div>
                  </td>
                  <td className="align-middle">{item.size}</td>
                  <td className="align-middle">{item.price.toLocaleString('ru-RU')}</td>
                  <td className="align-middle">{item.count}</td>
                  <td className="align-middle">{(item.price * item.count).toLocaleString('ru-RU')}</td>
                  <td className="align-middle">
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => dispatch(removeFromCart({ id: item.id, size: item.size }))}
                    >
                      Удалить
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="cart-summary">
            <p>Итого: {total.toLocaleString('ru-RU')} руб.</p>
          </div>
        </div>
      )}
      {items.length > 0 ? (
        <form className="cart-order" onSubmit={handleSubmit}>
          <h3>Оформление заказа</h3>
          <div className="form-group">
            <label>Телефон</label>
            <input
              type="tel"
              className="form-control"
              value={phone}
              onChange={event => setPhone(event.target.value)}
              required
              placeholder="+7xxxxxxxxxxx"
            />
          </div>
          <div className="form-group">
            <label>Адрес</label>
            <input
              type="text"
              className="form-control"
              value={address}
              onChange={event => setAddress(event.target.value)}
              required
              placeholder="Moscow City"
            />
          </div>
          <button className="btn btn-outline-primary" type="submit" disabled={orderStatus === 'loading'}>
            {orderStatus === 'loading' ? 'Оформление...' : 'Оформить заказ'}
          </button>
          {orderStatus === 'success' ? (
            <div className="text-success mt-3">Заказ успешно оформлен.</div>
          ) : null}
          {orderStatus === 'error' ? <div className="text-danger mt-3">{orderError}</div> : null}
        </form>
      ) : null}
    </section>
  )
}
