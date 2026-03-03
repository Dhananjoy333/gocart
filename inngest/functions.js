import { inngest } from "./client";
import prisma from "@/lib/prisma";

//Ingest function to save user data to the database
export const syncUserCreation = inngest.createFunction(
    {id: "sync-user-create"},
    {event: "clerk/user.created"},
    async ({ event}) => {
        const {data} = event;
        await prisma.user.create({
            data: {
                id: data.id,
                email : data.email_addresses[0].email_address,
                name : `${data.first_name} ${data.last_name}`,
                image : data.image_url,
            }
        })
    }
)

//Ingest function to update user data in the database
export const syncUserUpdation = inngest.createFunction(
    {id: "sync-user-update"},
    {event: "clerk/user.updated"},
    async ({ event}) => {
        const {data} = event;
        await prisma.user.update({
            where: {
                id: data.id,
            },
            data: {
                email : data.email_addresses[0].email_address,
                name : `${data.first_name} ${data.last_name}`,
                image : data.image_url,
            }
        })
    }
)

//Ingest function to delete user data from the database
export const syncUserDeletion = inngest.createFunction(
    {id: "sync-user-delete"},
    {event: "clerk/user.deleted"},
    async ({ event }) => {
        const { data } = event;
        await prisma.user.delete({
            where: {
                id: data.id,
            }
        })
    }
)

//Inngest Function to delete coupon on expiry date
export const deleteCouponsOnExpiry = inngest.createFunction(
    {id: "delete-coupons-on-expiry"},
    {event: "app/coupon.expired"},
    async ({ event, step }) => {
        const { data } = event
        const expiryDate = new Date(data.expiresAt)
        await step.sleepUntil("wait-for-expiry", expiryDate)

        await step.run("delete-coupon-from-database",async () => {
            await prisma.coupon.delete({
                where: {code: data.code }
            })
        })
    }
)