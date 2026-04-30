// client/src/components/Layout/Footer.jsx
import { Link } from 'react-router-dom'
import logo from '../../assets/favicon_nobg.png'
import './Footer.css'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="footer">
      <div className="footer-inner container">
        <div className="footer-brand">          
          <img src={logo} alt="Tejidos Atenea" className="footer-logo-img" />          
          <p className="footer-tagline">Tejidos con amor, hechos a mano</p>
        </div>

        <div className="footer-links">
          <h4>Tienda</h4>
          <Link to="/shop">Catálogo</Link>
          <Link to="/orders">Mis Pedidos</Link>
        </div>

        <div className="footer-links">
          <h4>Cuenta</h4>
          <Link to="/login">Iniciar Sesión</Link>
          <Link to="/register">Registrarse</Link>
        </div>

        <div className="footer-contact">
          <h4>Contáctanos</h4>
          <p>📧 hola@tejidosatenea.com</p>
          <p>📍 Colombia</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© {year} Tejidos Atenea. Hecho con 🧡 y mucho hilo.</p>
      </div>
    </footer>
  )
}