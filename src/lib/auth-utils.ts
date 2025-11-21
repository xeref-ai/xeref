import { type User } from "firebase/auth";
import { auth as adminAuth } from "./firebase-admin";

const ULTRA_USERS = [
    'bugrakarsli@gmail.com',
    'bugra@bugrakarsli.com',
];

export const isUltraUser = (user: User | null): boolean => {
    if (!user || !user.email) {
        return false;
    }
    return ULTRA_USERS.includes(user.email);
};

export const verifyToken = async (token: string) => {
    try {
        const decodedToken = await adminAuth.verifyIdToken(token);
        return decodedToken;
    } catch (error) {
        console.error("Error verifying token:", error);
        return null;
    }
};
