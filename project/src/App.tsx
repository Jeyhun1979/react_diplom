import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import HomePage from './pages/HomePage'
import CatalogPage from './pages/CatalogPage'
import AboutPage from './pages/AboutPage'
import ContactsPage from './pages/ContactsPage'
import ItemPage from './pages/ItemPage'
import CartPage from './pages/CartPage'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="catalog.html" element={<CatalogPage />} />
          <Route path="about.html" element={<AboutPage />} />
          <Route path="contacts.html" element={<ContactsPage />} />
          <Route path="catalog/:id.html" element={<ItemPage />} />
          <Route path="cart.html" element={<CartPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
