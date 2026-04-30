// client/src/pages/ShopPage.jsx
import ProductGallery from '../components/Shop/ProductGallery'
import './ShopPage.css'

export default function ShopPage() {
  return (
    <div className="shop-page">
      <div className="shop-header">
        <div className="container">
          <h1>Nuestra Tienda</h1>
          <p>Tejidos artesanales hechos con fibras naturales y mucho amor 🧶</p>
        </div>
      </div>
      <div className="container shop-body">
        <ProductGallery />
      </div>
    </div>
  )
}