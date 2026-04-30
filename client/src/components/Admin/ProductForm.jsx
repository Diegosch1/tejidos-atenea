// client/src/components/Admin/ProductForm.jsx
import { useState, useEffect } from 'react'
import { Upload } from 'lucide-react'
import { productService } from '../../services/productService'
import categoryService from '../../services/categoryService'
import Modal from '../Common/Modal'

export default function ProductForm({ isOpen, onClose, onSaved, product }) {
  const isEdit = !!product
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [preview, setPreview] = useState(null)
  const [form, setForm] = useState({
    nombre: '', descripcion: '', precio: '', stock: '', category_id: '', imagen: null
  })

  useEffect(() => {
    categoryService.getAll().then(d => setCategories(d.categories || d)).catch(() => {})
  }, [])

  useEffect(() => {
    if (product) {
      setForm({
        nombre:      product.nombre      || '',
        descripcion: product.descripcion || '',
        precio:      product.precio      || '',
        stock:       product.stock       || '',
        category_id: product.category_id || '',
        imagen:      null,
      })
      setPreview(productService.imgUrl(product.imagen_path))
    } else {
      setForm({ nombre: '', descripcion: '', precio: '', stock: '', category_id: '', imagen: null })
      setPreview(null)
    }
    setError('')
  }, [product, isOpen])

  const handleChange = e => {
    const { name, value, files } = e.target
    if (name === 'imagen' && files?.[0]) {
      setForm(f => ({ ...f, imagen: files[0] }))
      setPreview(URL.createObjectURL(files[0]))
    } else {
      setForm(f => ({ ...f, [name]: value }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const fd = new FormData()
      fd.append('nombre',      form.nombre)
      fd.append('descripcion', form.descripcion)
      fd.append('precio',      form.precio)
      fd.append('stock',       form.stock)
      if (form.category_id) fd.append('category_id', form.category_id)
      if (form.imagen)       fd.append('imagen',      form.imagen)

      if (isEdit) { await productService.update(product.id, fd) }
      else        { await productService.create(fd) }

      onSaved()
    } catch (e) {
      setError(e.response?.data?.error || 'Error al guardar')
    } finally { setLoading(false) }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Editar Producto' : 'Nuevo Producto'}>
      <form onSubmit={handleSubmit}>
        {error && <p className="alert alert-error">{error}</p>}

        <div className="form-row">
          <div className="form-group">
            <label>Nombre *</label>
            <input name="nombre" value={form.nombre} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Categoría</label>
            <select name="category_id" value={form.category_id} onChange={handleChange}>
              <option value="">Sin categoría</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Descripción</label>
          <textarea name="descripcion" value={form.descripcion} onChange={handleChange} rows={3} />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Precio (COP) *</label>
            <input type="number" name="precio" value={form.precio} onChange={handleChange} min="0" step="100" required />
          </div>
          <div className="form-group">
            <label>Stock *</label>
            <input type="number" name="stock" value={form.stock} onChange={handleChange} min="0" required />
          </div>
        </div>

        <div className="form-group">
          <label>Imagen</label>
          <label className="img-upload-label">
            {preview
              ? <img src={preview} alt="Preview" className="img-preview" />
              : <div className="img-upload-placeholder"><Upload size={28} /><span>Subir imagen</span></div>
            }
            <input type="file" name="imagen" accept="image/*" onChange={handleChange} style={{ display: 'none' }} />
          </label>
          {preview && <p className="helper-text mt-8">Haz clic para cambiar</p>}
        </div>

        <div className="modal-actions">
          <button type="button" className="btn btn-ghost" onClick={onClose} disabled={loading}>Cancelar</button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Guardando…' : (isEdit ? 'Guardar cambios' : 'Crear producto')}
          </button>
        </div>
      </form>
    </Modal>
  )
}