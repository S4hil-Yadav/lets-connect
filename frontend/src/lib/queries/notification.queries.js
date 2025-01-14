import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useGetNotificationsQuery() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: () =>
      axios
        .get("/api/v1/notifications/get-notifications")
        .then((res) => res.data),
    staleTime: 0,
  });
}
