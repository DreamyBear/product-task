import { ReactNode } from "react";
export default function ProductGrid({ children }: { children: ReactNode }) {
  return <div className="grid">{children}</div>;
}
