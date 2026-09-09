/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt, { JwtPayload } from "jsonwebtoken";
import { UserInfo } from "@/types/user.interface";
import { getCookie } from "./tokenHandler";
import { serverFetch } from "@/lib/server-fetch";

export const getUserInfo = async (): Promise<UserInfo | any> => {
  let userInfo: UserInfo | any;

  try {
    const response = await serverFetch.get("/user/me", {
      next: { tags: ["user-info"], revalidate: 180 },
    });

    const result = await response.json();

    if (result.success) {
      const accessToken = await getCookie("accessToken");

      if (!accessToken) {
        return null;
      }

      const verifiedToken = jwt.verify(
        accessToken,
        process.env.JWT_ACCESS_SECRET as string,
      ) as JwtPayload;

      if (!verifiedToken) {
        return null;
      }

      userInfo = {
        name: verifiedToken.name || "Unknown User",
        email: verifiedToken.email,
        role: verifiedToken.role,
      };
    }

    userInfo = {
      name:
        result.data.admin?.name ||
        result.data.doctor?.name ||
        result.data.patient?.name ||
        result.data.name ||
        "Unknown User",
      ...result.data,
    };

    return userInfo;
  } catch (error: any) {
    console.log(error);
    return {
      id: "",
      name: "Unknown User",
      email: "",
      role: "PATIENT",
    };
  }
};
