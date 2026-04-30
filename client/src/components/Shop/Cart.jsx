// client/src/components/Shop/Cart.jsx
import { useState } from 'react'
import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { productService } from '../../services/productService'
import Checkout from './Checkout'
import './Cart.css'

export default function Cart({ isOpen, onClose }) {
  const { items, removeItem, updateQty, total, totalItems, clear } = useCart()
  const { isAuthenticated } = useAuth()
  const [checkoutOpen, setCheckoutOpen] = useState(false)

  if (!isOpen) return null

  return (
    <>
      <div className="cart-overlay" onClick={onClose}>
        <div className="cart-drawer" onClick={e => e.stopPropagation()}>

          <div className="cart-header">
            <div className="cart-title">
              <ShoppingBag size={20} />
              <h2>Carrito {totalItems > 0 && <span className="cart-count">({totalItems})</span>}</h2>
            </div>
            <button className="btn-icon" onClick={onClose}><X size={20} /></button>
          </div>

          <div className="cart-body">
            {items.length === 0 ? (
              <div className="cart-empty">
                <span className="cart-empty-icon">🛍️</span>
                <p>Tu carrito está vacío</p>
                <button className="btn btn-secondary btn-sm" onClick={onClose}>
                  Cerrar carrito
                </button>
              </div>
            ) : (
              <ul className="cart-list">
                {items.map(item => {
                  const img = productService.imgUrl(item.imagen_path)
                  return (
                    <li key={item.product_id} className="cart-item">
                      <div className="cart-item-img">
                        {img
                          ? <img src={img} alt={item.nombre} />
                          : <span>🧶</span>
                        }
                      </div>
                      <div className="cart-item-info">
                        <p className="cart-item-name">{item.nombre}</p>
                        <p className="cart-item-price">
                          ${Number(item.precio).toLocaleString('es-CO')} c/u
                        </p>
                        <div className="cart-item-qty">
                          <button className="qty-btn" onClick={() => updateQty(item.product_id, item.cantidad - 1)}>
                            <Minus size={12} />
                          </button>
                          <span>{item.cantidad}</span>
                          <button
                            className="qty-btn"
                            onClick={() => updateQty(item.product_id, item.cantidad + 1)}
                            disabled={item.cantidad >= item.stock}
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                      <div className="cart-item-right">
                        <p className="cart-item-subtotal">
                          ${(item.precio * item.cantidad).toLocaleString('es-CO')}
                        </p>
                        <button
                          className="btn-icon cart-remove"
                          onClick={() => removeItem(item.product_id)}
                          title="Eliminar"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>

          {items.length > 0 && (
            <div className="cart-footer">
              <div className="cart-total">
                <span>Total</span>
                <span className="cart-total-amount">${total.toLocaleString('es-CO')}</span>
              </div>
              <button
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => {
                  if (!isAuthenticated) {
                    onClose()
                    window.location.href = '/login'
                  } else {
                    setCheckoutOpen(true)
                  }
                }}
              >
                {isAuthenticated ? 'Finalizar Pedido' : 'Inicia sesión para continuar'}
              </button>
              <button
                className="btn btn-ghost btn-sm"
                style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}
                onClick={clear}
              >
                Vaciar carrito
              </button>
            </div>
          )}
        </div>
      </div>

      <Checkout
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        onSuccess={() => { setCheckoutOpen(false); onClose() }}
      />
    </>
  )
}