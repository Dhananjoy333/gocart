import { getAuth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import imagekit from '@/configs/imageKit';
import { toFile } from "@imagekit/nodejs";
import { NextResponse } from "next/server";

//create the store
export async function POST(request) {
    try {
        const { userId } = getAuth(request);

        if (!userId) {
            console.log("No UserID found in headers");
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        //Get the data from the form
        const formData = await request.formData();

        const name = formData.get('name');
        const description = formData.get('description');
        const username = formData.get('username'); 
        const email = formData.get('email');
        const contact = formData.get('contact');
        const address = formData.get('address');
        const image = formData.get('image');

        if (!name || !username || !description || !email || !contact || !address || !image) {
            return NextResponse.json({ error: 'missing store info' }, { status: 400 });
        }

        //check if user have already registered a store
        const store = await prisma.store.findUnique({
            where: {userId: userId}
        });

        //if store is already registred then send status of store
        if (store) {
            return NextResponse.json({ status : store.status});
        }

        //check if username is already taken
        const isUsernameTaken = await prisma.store.findFirst({
            where: {username: username.toLowerCase()}
        });

        if (isUsernameTaken) {
            return NextResponse.json({ error: 'Username already taken' }, { status: 400 });
        }
        
        //image upload to imagekit
        const buffer = Buffer.from(await image.arrayBuffer());
        const response = await imagekit.files.upload({
            file: await toFile(buffer, image.name), 
            fileName: image.name,
            folder: "logos"
        });

        const optimizedImage = imagekit.helper.buildSrc({
            // Make sure this matches your .env variable name
            urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT, 
            src: response.filePath, // Use filePath from the upload response
            transformation: [
                {
                    width: 512,
                    quality: "auto", // ImageKit handles 'auto' as 'q-auto'
                    format: 'webp',
                },
            ],
        });

        const newStore = await prisma.store.create({
            data: {
                userId,
                name,
                description,
                username: username.toLowerCase(),
                email,
                contact,
                address,
                logo: optimizedImage,
            }
        });

        //link store to user
        await prisma.user.update({
            where: {id: userId},
            data: {store: {connect: {id: newStore.id}}}
        });

        return NextResponse.json({ message:"applied, waiting for approval" });
        

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.code || error.message}, { status: 400 });
    }
}

//check if user have already registered a store if yes then send status of store !
export async function GET(request) {
    try {
        const { userId } = getAuth(request);

        //check if user have already registered a store
        const store = await prisma.store.findFirst({
            where: {userId: userId}
        });

        //if store is already registred then send status of store
        if (store) {
            return NextResponse.json({ status : store.status});
        }

        return NextResponse.json({ status : "not registered"});
    }catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.code || error.message}, { status: 400 });
    }
}