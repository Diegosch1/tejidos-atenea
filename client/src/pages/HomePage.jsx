// client/src/pages/HomePage.jsx
import { Link } from 'react-router-dom'
import { ArrowRight, Heart, Package, Sparkles } from 'lucide-react'
import logo from '../assets/favicon_nobg.png'
import './HomePage.css'

const FEATURES = [
  { icon: Heart,     title: 'Hecho con Amor',     desc: 'Cada pieza está tejida a mano con dedicación y cuidado artesanal.' },
  { icon: Sparkles,  title: 'Diseños Únicos',      desc: 'Creaciones originales que no encontrarás en ningún otro lugar.' },
  { icon: Package,   title: 'Envío Seguro',        desc: 'Empacamos con cuidado para que tu tejido llegue perfecto.' },
]

export default function HomePage() {
  return (
    <div className="home">

      {/* Hero */}
      <section className="hero-section">
        <div className="hero-content container">
          <div className="hero-text anim-slide-up">
            <span className="hero-eyebrow">Tejidos Artesanales 🧶</span>
            <h1 className="hero-title">
              Tejidos con alma,<br />hechos a mano
            </h1>
            <p className="hero-subtitle">
              Descubre nuestra colección de tejidos artesanales hechos con fibras
              naturales y mucho amor. Cada pieza cuenta una historia.
            </p>
            <div className="hero-actions">
              <Link to="/shop" className="btn btn-primary">
                Ver Colección <ArrowRight size={16} />
              </Link>
              <Link to="/register" className="btn btn-secondary">
                Únete a Nosotros
              </Link>
            </div>
          </div>

          <div className="hero-visual anim-fade-in">
            {/* ── ESPACIO PARA IMAGEN HERO ── */}
            {/* Si tienes una imagen, reemplaza con: <img src={heroImg} alt="Tejidos Atenea" /> */}
            <div className="hero-placeholder">
              <span className="hero-yarn"><img src={logo} alt="Tejidos Atenea" /></span>
              <div className="hero-ring hero-ring-1" />
              <div className="hero-ring hero-ring-2" />
              <div className="hero-ring hero-ring-3" />
            </div>
          </div>
        </div>

        <div className="hero-wave">
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="var(--cream-dark)" />
          </svg>
        </div>
      </section>

      {/* Features */}
      <section className="features-section">
        <div className="container">
          <div className="features-grid">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="feature-card">
                <div className="feature-icon-wrap">
                  <Icon size={24} className="feature-icon" />
                </div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card">
            <h2>¿Lista para encontrar tu tejido perfecto?</h2>
            <p>Explora nuestra tienda y descubre piezas que amarás para siempre.</p>
            <Link to="/shop" className="btn btn-primary">
              Explorar Tienda <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}