import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { getServerSession } from 'next-auth';
import Stripe from 'stripe';

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const stripe = new Stripe(String(process.env.STRIPE_SECRET), {
    apiVersion: '2022-11-15'
});

export async function hasSubscription() {
    const session = await getServerSession(authOptions);
    if (session) {
        const user = await prisma.user.findFirst({
            where: { email: session.user?.email }
        })

        const subscription = await stripe.subscriptions.list({
            customer: String(user?.stripe_customer_id)
        })

        return subscription.data.length > 0;
    }
    return false;
}

export default async function createCustomer() {
    const session = await getServerSession(authOptions);
    if (session) {
        const user = await prisma.user.findFirst({
            where: { email: session.user?.email }
        })

        if (!user?.stripe_customer_id) {
            const customer = await stripe.customers.create({
                email: String(user?.email)
            })

            await prisma.user.update({
                where: {
                    id: user?.id
                },
                data: {
                    stripe_customer_id: customer.id
                }
            })
        }
    }
    // const customer = await stripe.customers.create({
    //     email: 'customer@example.com',
    // });
    // console.log(customer.id);
}
