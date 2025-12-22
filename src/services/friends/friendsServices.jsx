import { get, post, edit } from "../../utils/axios/request";

export const getMyFriends = async () => {
  return await get("friends/my");
};

export const getIncomingFriendRequests = async () => {
  return await get("friends/requests/incoming");
};

export const getOutgoingFriendRequests = async () => {
  return await get("friends/requests/outgoing");
};

export const sendFriendRequest = async (receiverId) => {
  return await post(`friends/requests/to/${receiverId}`, {});
};

export const acceptFriendRequest = async (id) => {
  return await edit(`friends/requests/${id}/accept`, {});
};

export const rejectFriendRequest = async (id) => {
  return await edit(`friends/requests/${id}/reject`, {});
};

export const cancelFriendRequest = async (id) => {
  return await edit(`friends/requests/${id}/cancel`, {});
};
