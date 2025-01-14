import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useGetAuthQuery() {
  return useQuery({
    queryKey: ["authUser"],
    queryFn: () =>
      axios.get("/api/v1/auth/get-auth-user").then((res) => res.data),

    refetchOnReconnect: true,
    retry: (count, error) => count < 3 && error.response?.status === 500,
  });
}
