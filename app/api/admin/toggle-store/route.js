import { NextResponse } from "next/server";
import authAdmin from "@/middlewares/authAdmin";
import { getAuth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

//toggle store isActive
export async function POST(request) {
    try {
        const { userId } = getAuth(request);
        const isAdmin = await authAdmin(userId);

        if(!isAdmin){
            return  NextResponse.json({error: "not authorized"}, {status: 401})
        }

        const {storeId} = await request.json();

        if (!storeId){
            return NextResponse.json({error: "missing storeId"}, {status: 400})
        }

        //Find the store
        const store = await prisma.store.findUnique({where: {id: storeId}})

        if (!store){
            return NextResponse.json({error: "store not found"}, {status: 404})
        }

        //Toggle isActive
        await prisma.store.update({
            where: {id: storeId},
            data: {isActive: !store.isActive}
        })

        return NextResponse.json({message: "Store status updated successfully"})
        
    }catch (error) {
        console.error(error);
        return NextResponse.json({error: error.code || error.message}, {status: 400})
    }
}