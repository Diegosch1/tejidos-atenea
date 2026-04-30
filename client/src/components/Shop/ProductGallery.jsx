// client/src/components/Shop/ProductGallery.jsx
import { useState, useEffect, useCallback } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { productService } from '../../services/productService'
import categoryService from '../../services/categoryService'
import ProductCard from './ProductCard'
import LoadingSpinner from '../Common/LoadingSpinner'
import './ProductGallery.css'

export default function ProductGallery() {
  const [products, setProducts]     = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading]       = useState(true)
  const [page, setPage]             = useState(1)
  const [total, setTotal]           = useState(0)
  const [filters, setFilters]       = useState({
    category_id: '', search: '', precio_min: '', precio_max: ''
  })
  const [showFilters, setShowFilters] = useState(false)
  const LIMIT = 12

  useEffect(() => {
    categoryService.getAll().then(d => setCategories(d.categories || d)).catch(() => {})
  }, [])

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const data = await productService.getAll({ ...filters, page, limit: LIMIT })
      setProducts(data.products || data)
      setTotal(data.total || (data.products || data).length)
    } catch { setProducts([]) }
    finally { setLoading(false) }
  }, [filters, page])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  const applyFilter = (key, val) => {
    setFilters(f => ({ ...f, [key]: val }))
    setPage(1)
  }

  const clearFilters = () => {
    setFilters({ category_id: '', search: '', precio_min: '', precio_max: '' })
    setPage(1)
  }

  const hasFilters = filters.category_id || filters.search || filters.precio_min || filters.precio_max
  const pages = Math.ceil(total / LIMIT)

  return (
    <div className="gallery-wrap">
      {/* Toolbar */}
      <div className="gallery-toolbar">
        <div className="search-wrap">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Buscar productos…"
            value={filters.search}
            onChange={e => applyFilter('search', e.target.value)}
            className="search-input"
          />
          {filters.search && (
            <button className="search-clear" onClick={() => applyFilter('search', '')}>
              <X size={14} />
            </button>
          )}
        </div>

        <div className="category-pills">
          <button
            className={`pill ${!filters.category_id ? 'pill-active' : ''}`}
            onClick={() => applyFilter('category_id', '')}
          >Todos</button>
          {categories.map(c => (
            <button
              key={c.id}
              className={`pill ${filters.category_id == c.id ? 'pill-active' : ''}`}
              onClick={() => applyFilter('category_id', c.id)}
            >{c.nombre}</button>
          ))}
        </div>

        <button
          className={`btn btn-ghost btn-sm filter-toggle ${hasFilters ? 'has-filters' : ''}`}
          onClick={() => setShowFilters(v => !v)}
        >
          <SlidersHorizontal size={15} />
          Filtros {hasFilters && <span className="filter-dot" />}
        </button>
      </div>

      {/* Expanded filters */}
      {showFilters && (
        <div className="filter-panel anim-slide-up">
          <div className="filter-row">
            <div className="form-group">
              <label>Precio mínimo</label>
              <input
                type="number" placeholder="0"
                value={filters.precio_min}
                onChange={e => applyFilter('precio_min', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Precio máximo</label>
              <input
                type="number" placeholder="Sin límite"
                value={filters.precio_max}
                onChange={e => applyFilter('precio_max', e.target.value)}
              />
            </div>
            {hasFilters && (
              <button className="btn btn-ghost btn-sm clear-btn" onClick={clearFilters}>
                <X size={14} /> Limpiar
              </button>
            )}
          </div>
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="loading-state"><LoadingSpinner size="lg" /></div>
      ) : products.length === 0 ? (
        <div className="empty-state">
          <p>🧶 No encontramos productos con esos filtros.</p>
          {hasFilters && (
            <button className="btn btn-secondary btn-sm" onClick={clearFilters}>
              Ver todos los productos
            </button>
          )}
        </div>
      ) : (
        <div className="product-grid">
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}

      {/* Pagination */}
      {pages > 1 && (
        <div className="pagination">
          <button className="btn btn-ghost btn-sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
            ← Anterior
          </button>
          <span className="page-info">{page} / {pages}</span>
          <button className="btn btn-ghost btn-sm" disabled={page >= pages} onClick={() => setPage(p => p + 1)}>
            Siguiente →
          </button>
        </div>
      )}
    </div>
  )
}