// client/src/components/Admin/AdminPanel.jsx
import { useState } from 'react'
import { LayoutDashboard, ShoppingBag, Tag, ListOrdered } from 'lucide-react'
import AdminDashboard from './AdminDashboard'
import ProductList from './ProductList'
import CategoryManager from './CategoryManager'
import OrderManager from './OrderManager'
import './AdminPanel.css'

const TABS = [
  { id: 'dashboard', label: 'Dashboard',  icon: LayoutDashboard },
  { id: 'products',  label: 'Productos',  icon: ShoppingBag },
  { id: 'categories',label: 'Categorías', icon: Tag },
  { id: 'orders',    label: 'Pedidos',    icon: ListOrdered },
]

export default function AdminPanel() {
  const [tab, setTab] = useState('dashboard')

  return (
    <div className="admin-panel">
      <aside className="admin-sidebar">
        <h2 className="admin-sidebar-title">Panel Admin</h2>
        <nav className="admin-nav">
          {TABS.map(t => {
            const Icon = t.icon
            return (
              <button
                key={t.id}
                className={`admin-nav-item ${tab === t.id ? 'active' : ''}`}
                onClick={() => setTab(t.id)}
              >
                <Icon size={17} />
                {t.label}
              </button>
            )
          })}
        </nav>
      </aside>

      <div className="admin-content">
        {tab === 'dashboard'  && <AdminDashboard />}
        {tab === 'products'   && <ProductList />}
        {tab === 'categories' && <CategoryManager />}
        {tab === 'orders'     && <OrderManager />}
      </div>
    </div>
  )
}