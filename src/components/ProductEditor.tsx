import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { useProduct, useProducts } from "@/hooks/useProducts";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/types/product";

/** Zod schema (v4-friendly): coerce price from string -> number */
const FormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  price: z.coerce
    .number()
    .refine((v) => Number.isFinite(v), { message: "Price must be a number" })
    .nonnegative({ message: "Price must be ≥ 0" }),
  description: z.string().min(1, "Description is required"),
  imageUrl: z
    .string()
    .url("Image URL must be a valid URL")
    .optional()
    .or(z.literal("")),
});
type FormData = z.infer<typeof FormSchema>;
type Mode = "create" | "edit";

export default function ProductEditor({ mode }: { mode: Mode }) {
  const isCreate = mode === "create";
  const { id } = useParams();
  const pid = Number(id);
  const { data } = useProduct(pid);
  const { create, update } = useProducts();
  const navigate = useNavigate();

  // Initial state from existing product (edit) or blanks (create)
  const initial: FormData = useMemo(
    () =>
      isCreate
        ? { name: "", category: "", price: 0, description: "", imageUrl: "" }
        : {
            name: data?.name ?? "",
            category: data?.category ?? "",
            price: data?.price ?? 0,
            description: data?.description ?? "",
            imageUrl: data?.imageUrl ?? "",
          },
    [isCreate, data]
  );

  const [form, setForm] = useState<FormData>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {}
  );
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setForm(initial);
    setErrors({});
    setTouched({});
  }, [initial]);

  // Form helpers
  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const validate = (draft: FormData) => {
    const res = FormSchema.safeParse(draft);
    if (res.success) {
      setErrors({});
      return true;
    } else {
      const map: any = {};
      res.error.issues.forEach((i) => {
        const k = i.path[0] as keyof FormData;
        map[k] = i.message;
      });
      setErrors(map);
      return false;
    }
  };

  const onBlur = (e: React.FocusEvent<any>) => {
    setTouched((t) => ({ ...t, [e.target.name]: true }));
    validate(form);
  };

  const focusFirstError = () => {
    const first = (Object.keys(errors) as (keyof FormData)[])[0];
    if (first) {
      const el = document.querySelector<HTMLInputElement | HTMLTextAreaElement>(
        `[name="${String(first)}"]`
      );
      el?.focus();
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate(form)) {
      focusFirstError();
      return;
    }

    const payload = { ...form, price: Number(form.price) };

    if (isCreate) {
      await create.mutateAsync(payload as any);
      navigate("/products", {
        state: { toast: "Product created." },
        replace: true,
      });
    } else {
      await update.mutateAsync({ id: pid, payload: payload as any });
      navigate(`/products/${pid}`, {
        state: { toast: "Product updated." },
        replace: true,
      });
    }
  };

  const pending = create.isPending || update.isPending;

  // ---- LIVE PREVIEW (right side) ----
  // Build a Product-shaped object from the current form for ProductCard
  const previewProduct: Product = {
    id: isCreate ? -1 : pid,
    name: form.name || "Product name",
    category: form.category || "Category",
    price: Number(form.price) || 0,
    description:
      form.description || "Short description will appear on the details page.",
    imageUrl: form.imageUrl || "", // ProductCard shows a skeleton if empty
  };

  return (
    <form
      className="editor-layout"
      onSubmit={onSubmit}
      style={{ marginTop: 8 }}
    >
      {/* Left: form card */}
      <div className="card" style={{ padding: 16 }}>
        <h2 style={{ marginTop: 0 }}>
          {isCreate ? "Add Product" : "Edit Product"}
        </h2>

        <div style={{ display: "grid", gap: 12 }}>
          <Field
            label="Name"
            name="name"
            value={form.name}
            onChange={onChange}
            onBlur={onBlur}
            error={touched.name && errors.name}
          />
          <Field
            label="Category"
            name="category"
            value={form.category}
            onChange={onChange}
            onBlur={onBlur}
            error={touched.category && errors.category}
          />
          <Field
            label="Price"
            name="price"
            type="number"
            step="0.01"
            inputMode="decimal"
            value={String(form.price)}
            onChange={onChange}
            onBlur={onBlur}
            // prevent wheel/arrow increments (you asked for this earlier)
            onWheel={(e) => e.currentTarget.blur()}
            onKeyDown={(e) => {
              if (
                ["ArrowUp", "ArrowDown", "PageUp", "PageDown"].includes(e.key)
              )
                e.preventDefault();
            }}
            error={touched.price && errors.price}
          />
          <Field
            label="Image URL"
            name="imageUrl"
            placeholder="https://…"
            value={form.imageUrl ?? ""}
            onChange={onChange}
            onBlur={onBlur}
            error={touched.imageUrl && errors.imageUrl}
          />
          <TextArea
            label="Description"
            name="description"
            value={form.description}
            onChange={onChange}
            onBlur={onBlur}
            error={touched.description && errors.description}
          />
        </div>

        {/* Actions */}
        <div
          style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}
        >
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => history.back()}
            disabled={pending}
          >
            Cancel
          </button>
          <button className="btn" type="submit" disabled={pending}>
            {pending ? "Saving…" : "Save"}
          </button>
        </div>
      </div>

      {/* Right: Live preview (sticky on desktop) */}
      <div className="preview-sticky" aria-live="polite">
        <div className="help" style={{ marginBottom: 8 }}>
          Live preview
        </div>
        <ProductCard p={previewProduct} preview />{" "}
      </div>
    </form>
  );
}

/* ---------- Field components ---------- */

function Field(props: {
  label: string;
  name: keyof FormData;
  value: any;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onBlur: React.FocusEventHandler<HTMLInputElement>;
  type?: string;
  step?: string;
  placeholder?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  onWheel?: React.WheelEventHandler<HTMLInputElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
  error?: string | false;
}) {
  const { label, name, error, ...rest } = props;
  return (
    <label style={{ display: "block" }}>
      <div style={{ marginBottom: 6 }}>{label}</div>
      <input
        className="input"
        name={name}
        {...rest}
        aria-invalid={!!error}
        aria-describedby={`${name}-err`}
      />
      {error ? (
        <div
          id={`${name}-err`}
          role="alert"
          className="help"
          style={{ color: "var(--color-danger)" }}
        >
          {error}
        </div>
      ) : (
        <div className="help" style={{ minHeight: 18 }} />
      )}
    </label>
  );
}

function TextArea(props: {
  label: string;
  name: keyof FormData;
  value: string;
  onChange: React.ChangeEventHandler<HTMLTextAreaElement>;
  onBlur: React.FocusEventHandler<HTMLTextAreaElement>;
  error?: string | false;
}) {
  const { label, name, error, ...rest } = props;
  return (
    <label style={{ display: "block" }}>
      <div style={{ marginBottom: 6 }}>{label}</div>
      <textarea
        className="textarea"
        rows={5}
        name={name}
        {...rest}
        aria-invalid={!!error}
        aria-describedby={`${name}-err`}
      />
      {error ? (
        <div
          id={`${name}-err`}
          role="alert"
          className="help"
          style={{ color: "var(--color-danger)" }}
        >
          {error}
        </div>
      ) : (
        <div className="help" style={{ minHeight: 18 }} />
      )}
    </label>
  );
}
