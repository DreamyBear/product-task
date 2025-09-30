import { Link } from "react-router-dom";
import type { Product } from "@/types/product";

export default function ProductCard({ p }: { p: Product }) {
  return (
    <Link to={`/products/${p.id}`} className="card">
      <div className="aspect-4-3">
        {p.imageUrl ? (
          <img
            src={p.imageUrl}
            alt={p.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <div style={{ width: "100%", height: "100%" }} className="skel" />
        )}
      </div>
      <div style={{ padding: 12 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 6,
          }}
        >
          <span className="badge">{p.category}</span>
        </div>
        <h4 style={{ margin: "0 0 6px", fontSize: "16px", lineHeight: 1.3 }}>
          {p.name}
        </h4>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 8,
          }}
        >
          <span style={{ fontWeight: 700 }}>
            {p.price.toLocaleString(undefined, {
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
            })}
          </span>
          <span
            aria-hidden
            style={{
              width: 45,
              height: 45,
              borderRadius: "50%",
              background: "var(--color-accent)",
              color: "#1f1f1f",
              display: "grid",
              placeItems: "center",
              fontWeight: 800,
              fontSize: 30
            }}
          >
            +
          </span>
        </div>
      </div>
    </Link>
  );
}
