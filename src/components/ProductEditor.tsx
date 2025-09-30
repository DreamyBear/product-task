import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { useProduct, useProducts } from "@/hooks/useProducts";

const FormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  // Coerce strings → number; invalid strings become NaN and fail validation
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
  const [imgOk, setImgOk] = useState<boolean | null>(null);

  useEffect(() => {
    setForm(initial);
    setErrors({});
    setTouched({});
    setImgOk(null);
  }, [initial]);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: name === "price" ? value : value }));
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
    validate({ ...form, price: Number(form.price) });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: FormData = { ...form, price: Number(form.price) };
    if (!validate(payload)) {
      // focus first error
      const first = Object.keys(errors)[0] as keyof typeof errors;
      if (first)
        document
          .querySelector<
            HTMLInputElement | HTMLTextAreaElement
          >(`[name="${first}"]`)
          ?.focus();
      return;
    }

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

  // image probe
  useEffect(() => {
    if (!form.imageUrl) {
      setImgOk(null);
      return;
    }
    let cancelled = false;
    const img = new Image();
    img.onload = () => !cancelled && setImgOk(true);
    img.onerror = () => !cancelled && setImgOk(false);
    img.src = form.imageUrl;
    return () => {
      cancelled = true;
    };
  }, [form.imageUrl]);

  const pending = create.isPending || update.isPending;

  return (
    <form className="card" onSubmit={onSubmit} style={{ padding: 16 }}>
      <h2 style={{ marginTop: 0 }}>
        {isCreate ? "Add Product" : "Edit Product"}
      </h2>

      {/* Grid */}
      <div
        style={{
          display: "grid",
          gap: 16,
          gridTemplateColumns: "1fr",
        }}
      >
        {/* Left: fields */}
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
            value={String(form.price)}
            onChange={onChange}
            onBlur={onBlur}
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

        {/* Right: image preview */}
        <div className="card" style={{ padding: 12 }}>
          <div className="aspect-4-3">
            {form.imageUrl ? (
              imgOk === null ? (
                <div className="skel" />
              ) : imgOk ? (
                <img
                  src={form.imageUrl}
                  alt="Preview"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <div
                  style={{
                    display: "grid",
                    placeItems: "center",
                    color: "var(--color-muted)",
                    border: "1px dashed var(--color-border)",
                  }}
                >
                  Invalid image URL
                </div>
              )
            ) : (
              <div className="skel" />
            )}
          </div>
          <p className="help" style={{ marginTop: 8 }}>
            Paste an image URL to preview it here.
          </p>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
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
    </form>
  );
}

function Field(props: {
  label: string;
  name: keyof FormData;
  value: any;
  onChange: any;
  onBlur: any;
  type?: string;
  step?: string;
  placeholder?: string;
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
  onChange: any;
  onBlur: any;
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
