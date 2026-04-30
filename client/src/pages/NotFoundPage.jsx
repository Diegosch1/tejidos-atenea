// client/src/pages/NotFoundPage.jsx
import { Link } from 'react-router-dom'
import logo from '../assets/favicon_nobg.png'
import './NotFoundPage.css'

export default function NotFoundPage() {
  return (
    <div className="not-found">
      <div className="nf-content">
        <span className="nf-emoji"><img src={logo} alt="Tejidos Atenea" /></span>
        <h1>404</h1>
        <h2>Página no encontrada</h2>
        <p>Parece que este hilo se perdió en el camino…</p>
        <div className="nf-actions">
          <Link to="/"     className="btn btn-primary">Ir al inicio</Link>
          <Link to="/shop" className="btn btn-secondary">Ver la tienda</Link>
        </div>
      </div>
    </div>
  )
}