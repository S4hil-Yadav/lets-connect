export async function unFollow(followedUserId) {
  const res = await fetch("/api/v1/follow/unfollow/" + followedUserId, {
    method: "DELETE",
  });
  const data = await res.json();
  if (!res.ok || data.success === false) throw new Error(data.message);
}
export async function cancelFollowRequest(receiverId) {
  const res = await fetch(
    "/api/v1/follow/cancel-follow-request/" + receiverId,
    {
      method: "DELETE",
    },
  );
  const data = await res.json();
  if (!res.ok || data.success === false) throw new Error(data.message);
}
export async function sendFollowRequest(receiverId) {
  const res = await fetch("/api/v1/follow/send-follow-request/" + receiverId, {
    method: "POST",
  });
  const data = await res.json();
  if (!res.ok || data.success === false) throw new Error(data.message);
}

export async function acceptFollowRequest(senderId) {
  const res = await fetch("/api/v1/follow/accept-follow-request/" + senderId, {
    method: "POST",
  });
  const data = await res.json();
  if (!res.ok || data.success === false) throw new Error(data.message);
}

export async function rejectFollowRequest(senderId) {
  const res = await fetch("/api/v1/follow/reject-follow-request/" + senderId, {
    method: "DELETE",
  });
  const data = await res.json();
  if (!res.ok || data.success === false) throw new Error(data.message);
}
