import { getAuth } from "@clerk/nextjs/server";
import authSeller from "@/middlewares/authSeller";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

//Auth Seller(check whether the user is a seller or not, if seller then return store info)
export async function GET(request) {
    try {
        const { userId } = getAuth(request);
        const isSeller = await authSeller(userId);

        if (!isSeller) {
            return NextResponse.json({ error: 'not authorized' }, { status: 401 });
        }

        const storeInfo = await prisma.store.findUnique({
            where: { userId: userId }});

        return NextResponse.json({ isSeller, storeInfo });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.code || error.message}, { status: 400 });
    }
}

