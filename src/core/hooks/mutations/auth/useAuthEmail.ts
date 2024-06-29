import { useMutation } from "@tanstack/react-query";

import * as authApi from "@core/apis/auth.api";
import type { OkResponse } from "@core/types/api";
import type { CommonUseMutationOptions } from "@core/types/app";
import type { AuthEmailRequest } from "@core/types/auth";

export default (
  options?: CommonUseMutationOptions<AuthEmailRequest, OkResponse>
) => {
  const mutation = useMutation({
    ...options,
    mutationFn: (params) => authApi.authEmail(params),
  });

  return mutation;
};
