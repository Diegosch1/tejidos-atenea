// client/src/components/Admin/AdminDashboard.jsx
import { useState, useEffect } from 'react'
import { Package, ShoppingBag, Clock, CheckCircle, TrendingUp } from 'lucide-react'
import { productService } from '../../services/productService'
import orderService from '../../services/orderService'
import LoadingSpinner from '../Common/LoadingSpinner'
import './AdminDashboard.css'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [pData, oData] = await Promise.all([
          productService.getAll({ limit: 100 }),
          orderService.getAll({ limit: 10 })
        ])
        const products = pData.products || pData
        const orders   = oData.orders   || oData

        const totalVentas = orders
          .filter(o => o.estado !== 'cancelado')
          .reduce((s, o) => s + Number(o.total), 0)

        setStats({
          productos:  products.length,
          pedidos:    orders.length,
          pendientes: orders.filter(o => o.estado === 'pendiente').length,
          entregados: orders.filter(o => o.estado === 'entregado').length,
          ventas:     totalVentas,
        })
        setRecentOrders(orders.slice(0, 5))
      } catch {}
      finally { setLoading(false) }
    }
    load()
  }, [])

  if (loading) return <LoadingSpinner fullPage />

  const CARDS = [
    { label: 'Productos', value: stats.productos, icon: ShoppingBag, color: 'var(--primary)' },
    { label: 'Pedidos',   value: stats.pedidos,   icon: Package,     color: 'var(--sage)' },
    { label: 'Pendientes',value: stats.pendientes, icon: Clock,       color: 'var(--amber)' },
    { label: 'Entregados',value: stats.entregados, icon: CheckCircle, color: 'var(--success)' },
  ]

  return (
    <div className="admin-dashboard">
      <div className="dash-stats">
        {CARDS.map(c => {
          const Icon = c.icon
          return (
            <div key={c.label} className="stat-card">
              <div className="stat-icon" style={{ background: c.color + '18', color: c.color }}>
                <Icon size={22} />
              </div>
              <div>
                <p className="stat-value">{c.value}</p>
                <p className="stat-label">{c.label}</p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="dash-ventas">
        <div className="dash-ventas-inner">
          <TrendingUp size={20} className="dash-ventas-icon" />
          <div>
            <p className="dash-ventas-label">Ventas totales (pedidos activos)</p>
            <p className="dash-ventas-value">${stats.ventas.toLocaleString('es-CO')}</p>
          </div>
        </div>
      </div>

      <div className="dash-recent">
        <h3>Últimos pedidos</h3>
        {recentOrders.length === 0 ? (
          <p className="text-muted">No hay pedidos aún.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th><th>Total</th><th>Estado</th><th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(o => (
                <tr key={o.id}>
                  <td>#{o.id}</td>
                  <td>${Number(o.total).toLocaleString('es-CO')}</td>
                  <td><span className="badge badge-primary">{o.estado}</span></td>
                  <td style={{ fontSize: '.8rem', color: 'var(--ink-soft)' }}>
                    {new Date(o.created_at).toLocaleDateString('es-CO')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}