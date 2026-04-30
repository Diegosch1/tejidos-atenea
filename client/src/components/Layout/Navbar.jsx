// client/src/components/Layout/Navbar.jsx
import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { ShoppingBag, User, LogOut, Menu, X, Package, Shield } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import Cart from '../Shop/Cart'
import logo from '../../assets/favicon_nobg.png'
import './Navbar.css'

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth()
  const { totalItems } = useCart()
  const navigate = useNavigate()
  const [cartOpen, setCartOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/')
    setMenuOpen(false)
  }

  return (
    <>
      <nav className="navbar">
        <div className="navbar-inner container">

          {/* Logo */}
          <Link to="/" className="navbar-logo" onClick={() => setMenuOpen(false)}>
            <img src={logo} alt="Tejidos Atenea" className="logo-img" />            
            <span className="logo-text">Tejidos Atenea</span>
          </Link>

          {/* Nav links — desktop */}
          <div className="navbar-links">
            <NavLink to="/"     className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'} end>Inicio</NavLink>
            <NavLink to="/shop" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>Tienda</NavLink>
            {isAuthenticated && (
              <NavLink to="/orders" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>
                Mis Pedidos
              </NavLink>
            )}
            {isAdmin && (
              <NavLink to="/admin" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>
                <Shield size={14} style={{marginRight:4}} />Admin
              </NavLink>
            )}
          </div>

          {/* Actions */}
          <div className="navbar-actions">
            <button className="btn-icon cart-btn" onClick={() => setCartOpen(true)} aria-label="Carrito">
              <ShoppingBag size={20} />
              {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
            </button>

            {isAuthenticated ? (
              <div className="user-menu">
                <button className="btn-icon user-btn" title={user?.nombre}>
                  <User size={20} />
                </button>
                <div className="user-dropdown">
                  <p className="user-name">{user?.nombre} {user?.apellido}</p>
                  <p className="user-email">{user?.email}</p>
                  <hr />
                  <Link to="/orders" className="dropdown-item">
                    <Package size={15} /> Mis Pedidos
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" className="dropdown-item">
                      <Shield size={15} /> Panel Admin
                    </Link>
                  )}
                  <button className="dropdown-item danger" onClick={handleLogout}>
                    <LogOut size={15} /> Cerrar Sesión
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="btn btn-primary btn-sm">Entrar</Link>
            )}

            {/* Mobile hamburger */}
            <button className="btn-icon mobile-menu-btn" onClick={() => setMenuOpen(o => !o)}>
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="mobile-menu">
            <NavLink to="/"     onClick={() => setMenuOpen(false)}>Inicio</NavLink>
            <NavLink to="/shop" onClick={() => setMenuOpen(false)}>Tienda</NavLink>
            {isAuthenticated && (
              <NavLink to="/orders" onClick={() => setMenuOpen(false)}>Mis Pedidos</NavLink>
            )}
            {isAdmin && (
              <NavLink to="/admin" onClick={() => setMenuOpen(false)}>Admin</NavLink>
            )}
            {!isAuthenticated && (
              <>
                <NavLink to="/login"    onClick={() => setMenuOpen(false)}>Iniciar Sesión</NavLink>
                <NavLink to="/register" onClick={() => setMenuOpen(false)}>Registrarse</NavLink>
              </>
            )}
            {isAuthenticated && (
              <button className="mobile-logout" onClick={handleLogout}>
                <LogOut size={15} /> Cerrar Sesión
              </button>
            )}
          </div>
        )}
      </nav>

      <Cart isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  )
}