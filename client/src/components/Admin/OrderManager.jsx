// client/src/components/Admin/OrderManager.jsx
import { useState, useEffect } from 'react'
import { RefreshCw } from 'lucide-react'
import orderService from '../../services/orderService'
import LoadingSpinner from '../Common/LoadingSpinner'

const ESTADOS = ['pendiente', 'confirmado', 'enviado', 'entregado', 'cancelado']

const BADGE = {
  pendiente: 'badge-amber',
  confirmado: 'badge-primary',
  enviado: 'badge-sage',
  entregado: 'badge-success',
  cancelado: 'badge-danger',
}

export default function OrderManager() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try { const d = await orderService.getAll(); setOrders(d.orders || d) }
    catch { } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const changeEstado = async (id, estado) => {
    try { await orderService.updateEstado(id, estado); load() }
    catch { alert('Error al actualizar estado') }
  }

  return (
    <div className="product-list-panel">
      <div className="panel-header">
        <h2>Pedidos</h2>
        <button className="btn btn-ghost btn-sm" onClick={load}><RefreshCw size={15} /></button>
      </div>

      {loading ? <LoadingSpinner fullPage /> : orders.length === 0 ? (
        <div className="empty-state"><p>No hay pedidos aún.</p></div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>#</th><th>Cliente</th><th>Total</th><th>Pago</th><th>Estado</th><th>Fecha</th></tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id}>
                  <td>#{o.id}</td>
                  <td style={{ fontSize: '.85rem' }}>
                    <p style={{ fontWeight: 600, margin: 0 }}>{o.cliente_nombre} {o.cliente_apellido}</p>
                    <p style={{ color: 'var(--ink-soft)', margin: 0 }}>{o.cliente_email}</p>
                  </td>
                  <td>${Number(o.total).toLocaleString('es-CO')}</td>
                  <td style={{ fontSize: '.82rem', color: 'var(--ink-mid)' }}>{o.metodo_pago}</td>
                  <td>
                    <select
                      className="estado-select"
                      value={o.estado}
                      onChange={e => changeEstado(o.id, e.target.value)}
                    >
                      {ESTADOS
                        .filter(s => {
                          if (o.estado === 'cancelado' || o.estado === 'entregado') return s === o.estado
                          return true
                        })
                        .map(s => <option key={s} value={s}>{s}</option>)
                      }
                    </select>
                  </td>
                  <td style={{ fontSize: '.78rem', color: 'var(--ink-soft)' }}>
                    {new Date(o.created_at).toLocaleDateString('es-CO')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}