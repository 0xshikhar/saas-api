import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { getServerSession } from 'next-auth';
import Stripe from 'stripe';

import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';
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

export async function createCheckoutLink(customer: string) {
    const checkout = await stripe.checkout.sessions.create({
        success_url: "https://localhost:3000/dashboard/billing?success=true",
        cancel_url: "https://localhost:3000/dashboard/billing?success=true",
        customer: customer,
        line_items: [{
            price: 'price_1NcwpcSGm76Ry5nlM9UXwRRw'
        }],
        mode: "subscription"
    })
    console.log("checkout", checkout)
    return checkout.url;
}

export async function createCustomer() {
    const session = await getServerSession(authOptions);
    if (session) {
        const user = await prisma.user.findFirst({
            where: { email: session.user?.email }
        })

        // if there is no user profile
        if (!user?.stripe_customer_id) {
            const customer = await stripe.customers.create({
                email: String(user?.email)
            })

            await prisma.user.update({
                where: {
                    id: user?.id
                },
                data: {
                    stripe_customer_id: customer.id,
                }
            })
        }

        if (!user?.api_key) {
            await prisma.user.update({
                where: {
                    id: user?.id
                },
                data: {
                    api_key: "secret_" + randomUUID()
                }
            })
        }

        const user2 = await prisma.user.findFirst({
            where: { email: session.user?.email }
        })
        return user2?.stripe_customer_id;
    }
    // const customer = await stripe.customers.create({
    //     email: 'customer@example.com',
    // });
    // console.log(customer.id);
}
