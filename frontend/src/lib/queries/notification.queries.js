import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export function useGetNotificationsQuery() {
  const queryClient = useQueryClient(),
    authUser = queryClient.getQueryData(["authUser"]);

  return useQuery({
    queryKey: ["notifications", authUser?._id],
    queryFn: () =>
      axios
        .get("/api/v1/notifications/get-notifications")
        .then((res) => res.data),
    staleTime: 0,
  });
}
