import { RoleEnum } from "@/enum/roles";
import useUser from "./useUser";

export default function useIsAdmin() {
  const { user: userData } = useUser();

  return userData?.companies[0]?.role === RoleEnum.ADMIN;
}
