import { get } from "../../utils/axios/request";

export const getAllUsers = async () => {
  return await get("users/all");
};
