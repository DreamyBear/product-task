import { Link } from "react-router-dom";

export default function EmptyState() {
  return (
    <div style={{ textAlign: "center", padding: "40px 0" }}>
      <h3 style={{ margin: 0 }}>No products found</h3>
      <p className="help" style={{ marginTop: 6 }}>
        Get started by adding your first product.
      </p>
      <Link
        to="/products/new"
        className="btn"
        style={{ display: "inline-block", marginTop: 14 }}
      >
        Add Product
      </Link>
    </div>
  );
}
