import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <section className="top-sales text-center">
      <h2>404</h2>
      <p>Страница не найдена.</p>
      <Link className="btn btn-outline-primary" to="/">
        Вернуться на главную
      </Link>
    </section>
  )
}
