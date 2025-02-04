import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export function useMarkNotificationsAsReadQuery() {
  return useMutation({
    mutationFn: (notifications) =>
      axios.put("/api/v1/notifications/read-all", notifications),
  });
}
