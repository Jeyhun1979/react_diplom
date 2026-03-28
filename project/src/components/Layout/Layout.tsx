import { useEffect } from 'react'
import { useAppDispatch } from '../../store/hooks'
import { loadCategories, loadTopSales } from '../../store/shopSlice'
import Header from '../Header/Header'
import Banner from '../Banner/Banner'
import Footer from '../Footer/Footer'
import { Outlet } from 'react-router-dom'
import './Layout.css'

export default function Layout() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(loadCategories())
    dispatch(loadTopSales())
  }, [dispatch])

  return (
    <>
      <Header />
      <main className="container">
        <div className="row">
          <div className="col">
            <Banner />
            <Outlet />
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
