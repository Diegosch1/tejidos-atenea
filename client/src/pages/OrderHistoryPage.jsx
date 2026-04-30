// client/src/pages/OrderHistoryPage.jsx
import { useState, useEffect } from 'react'
import { Package, ChevronDown, ChevronUp, X } from 'lucide-react'
import orderService from '../services/orderService'
import LoadingSpinner from '../components/Common/LoadingSpinner'
import './OrderHistoryPage.css'

const STATUS_LABELS = {
  pendiente: { label: 'Pendiente', badge: 'badge-amber' },
  procesando: { label: 'Procesando', badge: 'badge-primary' },
  enviado: { label: 'Enviado', badge: 'badge-sage' },
  entregado: { label: 'Entregado', badge: 'badge-success' },
  cancelado: { label: 'Cancelado', badge: 'badge-danger' },
}

function OrderCard({ order, onCancel }) {
  const [open, setOpen] = useState(false)
  const st = STATUS_LABELS[order.estado] || { label: order.estado, badge: 'badge-primary' }
  const date = new Date(order.created_at).toLocaleDateString('es-CO', {
    day: '2-digit', month: 'long', year: 'numeric'
  })
  const canCancel = order.estado === 'pendiente'

  return (
    <div className="order-card">
      <div className="order-card-header" onClick={() => setOpen(o => !o)}>
        <div className="order-meta">
          <span className="order-number">Pedido #{order.id}</span>
          <span className="order-date">{date}</span>
        </div>
        <div className="order-meta-right">
          <span className={`badge ${st.badge}`}>{st.label}</span>
          <span className="order-total">
            ${Number(order.total).toLocaleString('es-CO')}
          </span>
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </div>

      {open && (
        <div className="order-detail anim-slide-up">
          <div className="order-info-row">
            <span><strong>Cliente:</strong> {order.cliente_nombre} {order.cliente_apellido} - {order.cliente_email}</span>
          </div>
          <div className="order-info-row">
            <span><strong>Pago:</strong> {order.metodo_pago}</span>
          </div>
          <table className="order-items-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Cant.</th>
                <th>Precio</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {(order.items || []).map((it, i) => (
                <tr key={i}>
                  <td>{it.nombre || it.product_id}</td>
                  <td>{it.cantidad}</td>
                  <td>${Number(it.precio_unitario).toLocaleString('es-CO')}</td>
                  <td>${(it.cantidad * it.precio_unitario).toLocaleString('es-CO')}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {canCancel && (
            <div className="order-actions">
              <button className="btn btn-danger btn-sm" onClick={() => onCancel(order.id)}>
                <X size={14} /> Cancelar pedido
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      const data = await orderService.getAll()
      setOrders(data.orders || data)
    } catch { setOrders([]) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const handleCancel = async (id) => {
    if (!confirm('¿Segura que deseas cancelar este pedido?')) return
    try { await orderService.cancelOwn(id); load() }
    catch (err) {
      console.error(err)
      alert(err.response?.data?.error || 'No se pudo cancelar el pedido.')
    }
  }

  return (
    <div className="orders-page">
      <div className="orders-header">
        <div className="container">
          <h1><Package size={28} /> Mis Pedidos</h1>
          <p>Historial de todas tus compras</p>
        </div>
      </div>

      <div className="container orders-body">
        {loading ? (
          <LoadingSpinner fullPage />
        ) : orders.length === 0 ? (
          <div className="empty-state">
            <p>🛍️ Aún no tienes pedidos.</p>
            <a href="/shop" className="btn btn-primary btn-sm">Ir a la tienda</a>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map(o => (
              <OrderCard key={o.id} order={o} onCancel={handleCancel} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}