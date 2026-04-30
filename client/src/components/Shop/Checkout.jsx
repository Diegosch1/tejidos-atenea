// client/src/components/Shop/Checkout.jsx
import { useState } from 'react'
import { CreditCard, Banknote, CheckCircle } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import orderService from '../../services/orderService'
import Modal from '../Common/Modal'
import './Checkout.css'

const METODOS = [
  { value: 'tarjeta',    label: 'Tarjeta de crédito/débito', icon: CreditCard },
  { value: 'transferencia', label: 'Transferencia bancaria', icon: Banknote },
  { value: 'efectivo', label: 'Pago contra entrega',    icon: Banknote },
]

export default function Checkout({ isOpen, onClose, onSuccess }) {
  const { items, total, clear } = useCart()
  const [metodo, setMetodo]   = useState('tarjeta')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [done, setDone]       = useState(false)

  const handleOrder = async () => {
    setLoading(true); setError('')
    try {
      await orderService.create(metodo, items.map(i => ({
        product_id: i.product_id,
        cantidad:   i.cantidad,
        precio_unitario: i.precio,
      })))
      clear()
      setDone(true)
    } catch (e) {
      setError(e.response?.data?.error || 'Error al procesar el pedido')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setDone(false); setError(''); setMetodo('tarjeta')
    if (done) onSuccess(); else onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={done ? '¡Pedido realizado!' : 'Finalizar Pedido'}>
      {done ? (
        <div className="checkout-success">
          <CheckCircle size={56} className="success-icon" />
          <h3>¡Gracias por tu compra!</h3>
          <p>Tu pedido ha sido recibido. Puedes ver el estado en <strong>Mis Pedidos</strong>.</p>
          <button className="btn btn-primary" onClick={handleClose}>Aceptar</button>
        </div>
      ) : (
        <>
          {/* Resumen */}
          <div className="checkout-summary">
            <h4>Resumen del pedido</h4>
            {items.map(i => (
              <div key={i.product_id} className="checkout-item">
                <span>{i.nombre} × {i.cantidad}</span>
                <span>${(i.precio * i.cantidad).toLocaleString('es-CO')}</span>
              </div>
            ))}
            <div className="checkout-total">
              <strong>Total</strong>
              <strong>${total.toLocaleString('es-CO')}</strong>
            </div>
          </div>

          {/* Método de pago */}
          <h4 className="checkout-section-title">Método de pago</h4>
          <div className="metodo-list">
            {METODOS.map(m => {
              const Icon = m.icon
              return (
                <label key={m.value} className={`metodo-option ${metodo === m.value ? 'selected' : ''}`}>
                  <input
                    type="radio" name="metodo" value={m.value}
                    checked={metodo === m.value}
                    onChange={() => setMetodo(m.value)}
                  />
                  <Icon size={18} />
                  <span>{m.label}</span>
                </label>
              )
            })}
          </div>

          {error && <p className="alert alert-error">{error}</p>}

          <div className="modal-actions">
            <button className="btn btn-ghost" onClick={onClose} disabled={loading}>Cancelar</button>
            <button className="btn btn-primary" onClick={handleOrder} disabled={loading}>
              {loading ? 'Procesando…' : `Confirmar pedido · $${total.toLocaleString('es-CO')}`}
            </button>
          </div>
        </>
      )}
    </Modal>
  )
}