export default function ProductCard({ product, quantity, onChange, isClosed }) {
  return (
    <div className={`product-card ${isClosed ? 'disabled' : ''}`}>
      <div className="product-img">
        📷<br/>รูปภาพ
      </div>
      <div className="product-info">
        <div className="product-name">{product.name}</div>
        <div className="product-price">{product.price.toLocaleString()} บาท</div>
      </div>
      <div className="qty-control">
        <button
          className="qty-btn"
          onClick={() => onChange(product.id, -1)}
          disabled={isClosed}
        >−</button>
        <input
          type="number"
          className="qty-input"
          value={quantity || 0}
          min="0"
          disabled={isClosed}
          onChange={(e) => onChange(product.id, parseInt(e.target.value) || 0, true)}
        />
        <button
          className="qty-btn"
          onClick={() => onChange(product.id, 1)}
          disabled={isClosed}
        >+</button>
      </div>
    </div>
  )
}
