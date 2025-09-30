import { useParams, Link, useNavigate } from "react-router-dom";
import { useProduct, useProducts } from "@/hooks/useProducts";
import { ProductDetailSkeleton } from "@/components/Skeletons";

import Spinner from "./Spinner";

export default function ProductDetail() {
  const { id } = useParams();
  const pid = Number(id);
  const { data, isPending, isError, error } = useProduct(pid);
  const { remove } = useProducts();
  const navigate = useNavigate();

  if (isPending) return <ProductDetailSkeleton />;
  if (isError) {
    return (
      <div className="card" style={{ padding: 20 }}>
        <h3 style={{ marginTop: 0 }}>Couldn’t load this product</h3>
        <p className="help">{(error as any)?.message ?? "Unknown error"}</p>
        <button className="btn" onClick={() => location.reload()}>
          Retry
        </button>
      </div>
    );
  }
  
  const onDelete = async () => {
    if (!confirm("Delete this product?")) return;
    await remove.mutateAsync(pid);
    navigate("/products", {
      state: { toast: "Product deleted." },
      replace: true,
    });
  };

  return (
    <div className="card">
      <div className="aspect-4-3">
        {data.imageUrl ? (
          <img
            src={data.imageUrl}
            alt={data.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <div className="skel" />
        )}
      </div>
      <div style={{ padding: 16 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 8,
          }}
        >
          <span className="badge">{data.category}</span>
        </div>
        <h2 style={{ margin: "0 0 8px" }}>{data.name}</h2>
        <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>
          ${data.price.toFixed(2)}
        </div>
        <p className="help" style={{ lineHeight: 1.6 }}>
          {data.description}
        </p>

        <div
          style={{ marginTop: 16, display: "flex", gap: 8, flexWrap: "wrap" }}
        >
          <Link to={`/products/${data.id}/edit`} className="btn">
            Edit
          </Link>
          <button
            className="btn btn-danger"
            onClick={onDelete}
            disabled={remove.isPending}
          >
            {remove.isPending ? "Deleting…" : "Delete"}
          </button>
          <Link to="/products" className="btn btn-ghost">
            Back
          </Link>
        </div>
      </div>
    </div>
  );
}
