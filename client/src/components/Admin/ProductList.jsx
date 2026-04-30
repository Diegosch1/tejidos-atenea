// client/src/components/Admin/ProductList.jsx
import { useState, useEffect, useCallback } from 'react'
import { Plus, Pencil, RefreshCw, CircleSlash2, Play } from 'lucide-react'
import { productService } from '../../services/productService'
import LoadingSpinner from '../Common/LoadingSpinner'
import ProductForm from './ProductForm'
import './ProductList.css'

export default function ProductList() {
  const [products, setProducts] = useState([])
  const [loading, setLoading]   = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing]   = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await productService.getAllAdmin({ limit: 100 })
      setProducts(data.products || data)      
      
    } catch {
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const handleDelete = async (id, nombre) => {
    if (!confirm(`Desactivar "${nombre}"?`)) return
    try {
      await productService.remove(id)
      load()
    } catch {
      alert('No se pudo desactivar el producto.')
    }
  }

  const handleReactivate = async (id, nombre) => {
    if (!confirm(`¿Reactivar "${nombre}"? El producto volverá a mostrarse en la tienda.`)) return
    try {
      await productService.reactivate(id)
      load() // Recargar la lista para actualizar ambas tablas
      alert('Producto reactivado correctamente')
    } catch (error) {
      console.error('Error al reactivar:', error)
      alert(error.response?.data?.error || 'No se pudo reactivar el producto.')
    }
  }

  const openNew  = () => { setEditing(null); setFormOpen(true) }
  const openEdit = (p) => { setEditing(p);   setFormOpen(true) }

  const activeProducts   = products.filter(p => p.activo)
  const inactiveProducts = products.filter(p => !p.activo)  
  
  console.log('Products:', products);
  

  return (
    <div className="product-list-panel">
      <div className="panel-header">
        <h2>Productos</h2>
        <div className="panel-header-actions">
          <button className="btn btn-ghost btn-sm" onClick={load}>
            <RefreshCw size={15} />
          </button>
          <button className="btn btn-primary btn-sm" onClick={openNew}>
            <Plus size={15} /> Nuevo producto
          </button>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner fullPage />
      ) : products.length === 0 ? (
        <div className="empty-state">
          <p>No hay productos aún.</p>
          <button className="btn btn-primary btn-sm" onClick={openNew}>
            Crear el primero
          </button>
        </div>
      ) : (
        <>
          {/* 🟢 TABLA ACTIVOS */}
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Imagen</th>
                  <th>Nombre</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Categoría</th>
                  <th>Activo</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {activeProducts.map(p => {
                  const img = productService.imgUrl(p.imagen_path)

                  return (
                    <tr key={p.id}>
                      <td>
                        <div className="admin-product-img">
                          {img ? <img src={img} alt={p.nombre} /> : <span>🧶</span>}
                        </div>
                      </td>
                      <td>
                        <p className="product-table-name">{p.nombre}</p>
                        {p.descripcion && (
                          <p className="product-table-desc">
                            {p.descripcion.slice(0, 60)}…
                          </p>
                        )}
                      </td>
                      <td>${Number(p.precio).toLocaleString('es-CO')}</td>
                      <td>
                        <span className={`badge ${
                          p.stock > 5
                            ? 'badge-sage'
                            : p.stock > 0
                            ? 'badge-amber'
                            : 'badge-danger'
                        }`}>
                          {p.stock}
                        </span>
                      </td>
                      <td>{p.categoria || <span className="text-muted">—</span>}</td>
                      <td>Sí</td>
                      <td>
                        <div className="table-actions">
                          <button
                            className="btn-icon"
                            onClick={() => openEdit(p)}
                            title="Editar"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            className="btn-icon danger-icon"
                            onClick={() => handleDelete(p.id, p.nombre)}
                            title="Desactivar"
                          >
                            <CircleSlash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* 🔻 TABLA INACTIVOS */}
          {inactiveProducts.length > 0 && (
            <div className="admin-table-wrap" style={{ marginTop: '2rem' }}>
              <h3 style={{ marginLeft: '1rem', marginTop: '0.5rem', marginBottom: '0.5rem', opacity: 0.7 }}>
                Productos desactivados
              </h3>

              <table className="admin-table inactive-table">
                <thead>
                  <tr>
                    <th>Imagen</th>
                    <th>Nombre</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Categoría</th>
                    <th>Activo</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {inactiveProducts.map(p => {
                    const img = productService.imgUrl(p.imagen_path)

                    return (
                      <tr key={p.id} className="inactive-row">
                        <td>
                          <div className="admin-product-img">
                            {img ? <img src={img} alt={p.nombre} /> : <span>🧶</span>}
                          </div>
                        </td>
                        <td>
                          <p className="product-table-name">{p.nombre}</p>
                        </td>
                        <td>${Number(p.precio).toLocaleString('es-CO')}</td>
                        <td>{p.stock}</td>
                        <td>{p.categoria || <span className="text-muted">—</span>}</td>
                        <td>No</td>
                        <td>
                          <div className="table-actions">
                            <button
                              className="btn-icon"
                              onClick={() => openEdit(p)}
                              title="Editar"
                            >
                              <Pencil size={15} />
                            </button>
                            <button
                              className="btn-icon success-icon"
                              onClick={() => handleReactivate(p.id, p.nombre)}
                              title="Reactivar producto"
                              style={{ color: '#10b981' }}
                            >
                              <Play size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      <ProductForm
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        onSaved={() => { setFormOpen(false); load() }}
        product={editing}
      />
    </div>
  )
}