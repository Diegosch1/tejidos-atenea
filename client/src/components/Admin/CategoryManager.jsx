// client/src/components/Admin/CategoryManager.jsx
import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react'
import categoryService from '../../services/categoryService'
import LoadingSpinner from '../Common/LoadingSpinner'

export default function CategoryManager() {
  const [cats, setCats]     = useState([])
  const [loading, setLoading] = useState(true)
  const [editId, setEditId] = useState(null)
  const [form, setForm]     = useState({ nombre: '', descripcion: '' })
  const [newForm, setNewForm] = useState({ nombre: '', descripcion: '' })
  const [creating, setCreating] = useState(false)

  const load = async () => {
    setLoading(true)
    try { const d = await categoryService.getAll(); setCats(d.categories || d) }
    catch {} finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const startEdit = (c) => { setEditId(c.id); setForm({ nombre: c.nombre, descripcion: c.descripcion || '' }) }
  const cancelEdit = () => { setEditId(null) }

  const saveEdit = async (id) => {
    try { await categoryService.update(id, form.nombre, form.descripcion); setEditId(null); load() }
    catch { alert('Error al actualizar') }
  }

  const handleDelete = async (id, nombre) => {
    if (!confirm(`¿Eliminar categoría "${nombre}"?`)) return
    try { await categoryService.remove(id); load() }
    catch { alert('No se pudo eliminar. ¿Tiene productos asignados?') }
  }

  const handleCreate = async () => {
    if (!newForm.nombre) return
    try {
      await categoryService.create(newForm.nombre, newForm.descripcion)
      setNewForm({ nombre: '', descripcion: '' }); setCreating(false); load()
    } catch { alert('Error al crear') }
  }

  return (
    <div className="product-list-panel">
      <div className="panel-header">
        <h2>Categorías</h2>
        <button className="btn btn-primary btn-sm" onClick={() => setCreating(v => !v)}>
          <Plus size={15} /> Nueva categoría
        </button>
      </div>

      {creating && (
        <div className="create-form-card">
          <div className="form-row">
            <div className="form-group">
              <label>Nombre</label>
              <input value={newForm.nombre} onChange={e => setNewForm(f => ({ ...f, nombre: e.target.value }))} />
            </div>
            <div className="form-group">
              <label>Descripción (opcional)</label>
              <input value={newForm.descripcion} onChange={e => setNewForm(f => ({ ...f, descripcion: e.target.value }))} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-primary btn-sm" onClick={handleCreate}>Crear</button>
            <button className="btn btn-ghost btn-sm" onClick={() => setCreating(false)}>Cancelar</button>
          </div>
        </div>
      )}

      {loading ? <LoadingSpinner fullPage /> : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Nombre</th><th>Descripción</th><th>Acciones</th></tr></thead>
            <tbody>
              {cats.map(c => (
                <tr key={c.id}>
                  <td>
                    {editId === c.id
                      ? <input className="inline-edit" value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} />
                      : <strong>{c.nombre}</strong>
                    }
                  </td>
                  <td>
                    {editId === c.id
                      ? <input className="inline-edit" value={form.descripcion} onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))} />
                      : <span className="text-muted">{c.descripcion || '—'}</span>
                    }
                  </td>
                  <td>
                    <div className="table-actions">
                      {editId === c.id ? (
                        <>
                          <button className="btn-icon" onClick={() => saveEdit(c.id)}><Check size={15} /></button>
                          <button className="btn-icon" onClick={cancelEdit}><X size={15} /></button>
                        </>
                      ) : (
                        <>
                          <button className="btn-icon" onClick={() => startEdit(c)}><Pencil size={15} /></button>
                          <button className="btn-icon danger-icon" onClick={() => handleDelete(c.id, c.nombre)}><Trash2 size={15} /></button>
                        </>
                      )}
                    </div>
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