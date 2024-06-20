import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "./api";
import { MemberType, EditMainCharacterType } from "../types/Member.type";
import { STALE_TIME_MS } from "../constants";

export async function getMember(): Promise<MemberType> {
  return await api.get("/v4/member").then((res) => res.data);
}

export function useMember() {
  const queryClient = useQueryClient();
  return {
    ...useQuery<MemberType, Error>({
      queryKey: ["member"],
      queryFn: getMember,
      staleTime: STALE_TIME_MS, // 1 minute interval
      retry: 0, // Stops on error
    }),
    queryClient,
  };
}

export async function editMainCharacter(
  data: EditMainCharacterType
): Promise<any> {
  return await api
    .patch("/v4/member/main-character", data)
    .then((res) => res.data)
    .catch((error) => console.log(error));
}

export async function editApikey(apiKey: string): Promise<any> {
  const data = {
    apiKey: apiKey,
  };
  return await api
    .patch("/member/api-key", data)
    .then((res) => res.data)
    .catch((error) => console.log(error));
}

export async function deleteUserCharacters(): Promise<any> {
  return await api
    .delete("/v3/member/setting/characters")
    .then((res) => res.data)
    .catch((error) => console.log(error));
}
