import { useMutation } from "convex/react";
import { useState } from "react";

export const useApiMutation = (mutationFn: any) => {
  const [pending, setPending] = useState(false);

  const mutation = useMutation(mutationFn);

  const mutate = (args: any) => {
    setPending(true);
    return mutation(args)
      .finally(() => setPending(false))
      .then((result: any) => {
        return result;
      })
      .catch((error: any) => {
        throw error;
      });
  };

  return { isLoading: pending, mutate };
};
