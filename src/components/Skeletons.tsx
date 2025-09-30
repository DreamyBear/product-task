export function ProductCardSkeleton() {
  return (
    <div className="card" style={{ padding: 12 }}>
      <div className="aspect-4-3">
        <div className="skel" />
      </div>
      <div style={{ padding: 12 }}>
        <div
          className="skel"
          style={{ height: 16, width: "70%", marginBottom: 8 }}
        />
        <div
          className="skel"
          style={{ height: 14, width: "40%", marginBottom: 8 }}
        />
        <div className="skel" style={{ height: 12, width: "90%" }} />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="card">
      <div className="aspect-4-3">
        <div className="skel" />
      </div>
      <div style={{ padding: 16 }}>
        <div
          className="skel"
          style={{ height: 22, width: "40%", marginBottom: 10 }}
        />
        <div
          className="skel"
          style={{ height: 16, width: "80%", marginBottom: 8 }}
        />
        <div
          className="skel"
          style={{ height: 12, width: "90%", marginBottom: 6 }}
        />
      </div>
    </div>
  );
}
