/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt, { JwtPayload } from 'jsonwebtoken';
import { UserInfo } from "@/types/user.interface";
import { getCookie } from "./tokenHandler";

export const getUserInfo = async(): Promise<UserInfo | null> => {
    try{
        const accessToken = await getCookie("accessToken");

        if(!accessToken){
            return null;
        }

        const verifiedToken = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET as string) as JwtPayload; 

        if(!verifiedToken){
            return null;
        }

        const userInfo: UserInfo= {
            name: verifiedToken.name || "Unknown User",
            email: verifiedToken.email,
            role: verifiedToken.role
        };

        return userInfo;

    }catch(error: any){
        console.log(error)
        return null;
    }
}