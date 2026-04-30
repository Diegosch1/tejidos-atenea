// client/src/components/Shop/ProductCard.jsx
import { useState } from 'react'
import { ShoppingBag, Plus, Minus } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { productService } from '../../services/productService'
import './ProductCard.css'

export default function ProductCard({ product }) {
  const { addItem, items, updateQty } = useCart()
  const [adding, setAdding] = useState(false)

  const cartItem = items.find(i => i.product_id === product.id)
  const qty = cartItem?.cantidad ?? 0
  const imgUrl = productService.imgUrl(product.imagen_path)

  const handleAdd = () => {
    setAdding(true)
    addItem(product, 1)
    setTimeout(() => setAdding(false), 600)
  }

  const handleQty = (delta) => {
    if (qty + delta < 1) {
      updateQty(product.id, 0)
    } else {
      updateQty(product.id, qty + delta)
    }
  }

  const outOfStock = product.stock <= 0

  return (
    <article className={`product-card ${outOfStock ? 'out-of-stock' : ''}`}>
      <div className="product-img-wrap">
        {imgUrl
          ? <img src={imgUrl} alt={product.nombre} className="product-img" loading="lazy" />
          : <div className="product-img-placeholder">🧶</div>
        }
        {outOfStock && <span className="product-badge-oos">Agotado</span>}
        {product.categoria_nombre && (
          <span className="product-category-tag">{product.categoria_nombre}</span>
        )}
      </div>

      <div className="product-body">
        <h3 className="product-name">{product.nombre}</h3>
        {product.descripcion && (
          <p className="product-desc">{product.descripcion}</p>
        )}
        <div className="product-footer">
          <span className="product-price">
            ${Number(product.precio).toLocaleString('es-CO')}
          </span>

          {!outOfStock && (
            qty > 0 ? (
              <div className="qty-control">
                <button className="qty-btn" onClick={() => handleQty(-1)}><Minus size={14} /></button>
                <span className="qty-num">{qty}</span>
                <button
                  className="qty-btn"
                  onClick={() => handleQty(1)}
                  disabled={qty >= product.stock}
                ><Plus size={14} /></button>
              </div>
            ) : (
              <button
                className={`btn-add ${adding ? 'adding' : ''}`}
                onClick={handleAdd}
                disabled={adding}
              >
                <ShoppingBag size={15} />
                {adding ? '¡Listo!' : 'Agregar'}
              </button>
            )
          )}
        </div>
        {product.stock > 0 && product.stock <= 5 && (
          <p className="product-stock-warn">Solo {product.stock} disponibles</p>
        )}
      </div>
    </article>
  )
}