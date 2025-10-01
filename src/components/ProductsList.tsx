import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import { useProducts } from "@/hooks/useProducts";
import ProductCard from "@/components/ProductCard";
import { ProductGridSkeleton } from "@/components/Skeletons";
import EmptyState from "@/components/EmptyState";
import Banner from "@/components/Banner";

export default function ProductsList() {
  const { list } = useProducts();
  const [q, setQ] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const [toast, setToast] = useState<string | null>(null);
  useEffect(() => {
    const st = (location.state as any) || {};
    if (st.toast) {
      setToast(st.toast);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, []);

  const products = list.data ?? [];

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return products;
    return products.filter((p) => {
      const hay =
        `${p.name} ${p.category} ${p.description ?? ""}`.toLowerCase();
      return hay.includes(term);
    });
  }, [q, products]);

  if (list.isPending) {
    return (
      <section style={{ padding: "20px 0" }}>
        <div className="container">
          <HeaderRow q={q} setQ={setQ} />
          <ProductGridSkeleton count={8} />
        </div>
      </section>
    );
  }

  if (list.isError) {
    return (
      <section style={{ padding: "20px 0" }}>
        <div className="container">
          <HeaderRow q={q} setQ={setQ} />
          <div className="card" style={{ padding: 20 }}>
            <h3 style={{ marginTop: 0 }}>Couldn’t load products</h3>
            <p className="help">
              {(list.error as any)?.message ?? "Unknown error"}
            </p>
            <button className="btn" onClick={() => list.refetch()}>
              Retry
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section style={{ padding: "20px 0" }}>
      <div className="container">
        <Banner message={toast} onClose={() => setToast(null)} autoMs={4000} />

        <HeaderRow q={q} setQ={setQ} />

        {filtered.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid">
            <AnimatePresence initial={false}>
              {filtered.map((p) => (
                <ProductCard
                  key={p.id}
                  p={p}
                  motionProps={{
                    layout: true,
                    initial: { opacity: 0.85, y: 0 }, 
                    animate: { opacity: 1, y: 0 },
                    exit: { opacity: 0, y: 0 }, 
                    transition: { duration: 0.18, ease: "easeOut" }, 
                  }}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
}

function HeaderRow({ q, setQ }: { q: string; setQ: (v: string) => void }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 12,
        alignItems: "center",
        marginBottom: 16,
        flexWrap: "wrap",
      }}
    >
      <h2 style={{ margin: 0, fontSize: "22px", lineHeight: 1 }}>Products</h2>
      <div
        style={{
          marginLeft: "auto",
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
        }}
      >
        <input
          className="input"
          placeholder="Search products…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Search products"
          style={{ width: 260 }}
        />
        <Link to="/products/new" className="btn">
          Add Product
        </Link>
      </div>
    </div>
  );
}
