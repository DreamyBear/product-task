import { Link } from "react-router-dom";
import type { Product } from "@/types/product";
import { motion, type MotionProps } from "framer-motion";

type Props = {
  p: Product;
  preview?: boolean;
  motionProps?: MotionProps;
};

const MotionLink = motion(Link);

export default function ProductCard({
  p,
  preview = false,
  motionProps,
}: Props) {
  if (preview) {
    return (
      <motion.div className="card" {...motionProps}>
        <CardInner p={p} preview />
      </motion.div>
    );
  }

  return (
    <MotionLink to={`/products/${p.id}`} className="card" {...motionProps}>
      <CardInner p={p} />
    </MotionLink>
  );
}

function CardInner({ p, preview = false }: { p: Product; preview?: boolean }) {
  return (
    <>
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
              background: preview
                ? "rgba(249, 208, 63, 0.4)"
                : "var(--color-accent)",
              color: preview ? "#555" : "#1f1f1f",
              display: "grid",
              placeItems: "center",
              fontWeight: 800,
              fontSize: 30,
              opacity: preview ? 0.6 : 1,
              cursor: preview ? "not-allowed" : "pointer",
            }}
          >
            +
          </span>
        </div>
      </div>
    </>
  );
}
