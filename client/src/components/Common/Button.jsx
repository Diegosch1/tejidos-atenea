// client/src/components/Common/Button.jsx
import LoadingSpinner from './LoadingSpinner'

export default function Button({
  children, onClick, type = 'button',
  variant = 'primary', size = '',
  loading = false, disabled = false,
  className = '', ...props
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`btn btn-${variant} ${size ? `btn-${size}` : ''} ${className}`}
      {...props}
    >
      {loading && <LoadingSpinner size="sm" />}
      {children}
    </button>
  )
}