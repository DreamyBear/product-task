import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/api/products";

export const useProducts = () => {
  const qc = useQueryClient();
  const list = useQuery({ queryKey: ["products"], queryFn: listProducts });

  const create = useMutation({
    mutationFn: createProduct,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });

  const update = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: any }) =>
      updateProduct(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["product", id] });
    },
  });

  const remove = useMutation({
    mutationFn: deleteProduct,
    // Optimistic delete
    onMutate: async (id: number) => {
      await qc.cancelQueries({ queryKey: ["products"] });
      const prev = qc.getQueryData<any>(["products"]);
      if (prev) {
        qc.setQueryData(["products"], (old: any) =>
          (old ?? []).filter((p: any) => p.id !== id)
        );
      }
      return { prev };
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.prev) qc.setQueryData(["products"], ctx.prev);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
    },
  });

  return { list, create, update, remove };
};

export const useProduct = (id: number) =>
  useQuery({ queryKey: ["product", id], queryFn: () => getProduct(id) });
