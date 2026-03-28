import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { setCategory, loadCatalog } from '../../store/shopSlice'
import Preloader from '../Preloader/Preloader'
import './CategoryTabs.css'

export default function CategoryTabs() {
  const dispatch = useAppDispatch()
  const { categories, selectedCategoryId, loaders, errors } = useAppSelector(state => state.shop)

  const handleChange = (id: number) => {
    dispatch(setCategory(id))
    dispatch(loadCatalog())
  }

  if (loaders.categories) {
    return <Preloader />
  }

  if (errors.categories) {
    return <div className="text-center text-danger">{errors.categories}</div>
  }

  return (
    <ul className="catalog-categories nav justify-content-center">
      {categories.map(category => (
        <li className="nav-item" key={category.id}>
          <button
            type="button"
            className={`nav-link${selectedCategoryId === category.id ? ' active' : ''}`}
            onClick={() => handleChange(category.id)}
          >
            {category.title}
          </button>
        </li>
      ))}
    </ul>
  )
}
