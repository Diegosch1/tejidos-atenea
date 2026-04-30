// client/src/App.jsx
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Layout/Navbar'
import Footer from './components/Layout/Footer'
import ProtectedRoute from './components/Layout/ProtectedRoute'
import HomePage from './pages/HomePage'
import ShopPage from './pages/ShopPage'
import OrderHistoryPage from './pages/OrderHistoryPage'
import AdminPage from './pages/AdminPage'
import NotFoundPage from './pages/NotFoundPage'
import Login from './components/Auth/Login'
import Register from './components/Auth/Register'

export default function App() {
  return (
    <div className="app-wrapper">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/"         element={<HomePage />} />
          <Route path="/shop"     element={<ShopPage />} />
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/orders"   element={
            <ProtectedRoute><OrderHistoryPage /></ProtectedRoute>
          } />
          <Route path="/admin"    element={
            <ProtectedRoute adminOnly><AdminPage /></ProtectedRoute>
          } />
          <Route path="*"         element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}