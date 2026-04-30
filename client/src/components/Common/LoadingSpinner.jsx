// client/src/components/Common/LoadingSpinner.jsx
import './LoadingSpinner.css'

export default function LoadingSpinner({ fullPage = false, size = 'md' }) {
  if (fullPage) {
    return (
      <div className="loading-fullpage">
        <div className={`spinner spinner-${size}`} />
        <p className="loading-text">Cargando…</p>
      </div>
    )
  }
  return <div className={`spinner spinner-${size}`} />
}