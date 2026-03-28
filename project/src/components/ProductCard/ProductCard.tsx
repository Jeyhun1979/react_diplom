import type { BasicItem } from '../../types'
import { Link } from 'react-router-dom'
import './ProductCard.css'

export default function ProductCard({ item }: { item: BasicItem }) {
  return (
    <div className="col-12 col-sm-6 col-lg-4">
      <div className="card catalog-item-card">
        <img src={item.images[0]} className="card-img-top img-fluid" alt={item.title} />
        <div className="card-body">
          <p className="card-text">{item.title}</p>
          <p className="card-text">{item.price.toLocaleString('ru-RU')} руб.</p>
          <Link className="btn btn-outline-primary" to={`/catalog/${item.id}.html`}>
            Заказать
          </Link>
        </div>
      </div>
    </div>
  )
}
