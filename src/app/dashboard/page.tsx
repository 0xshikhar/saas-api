import { createCustomer, createCheckoutLink, hasSubscription } from "@/lib/stripe";
import Link from "next/link";
import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { stripe } from "@/lib/stripe";
const prisma = new PrismaClient();

export default async function Page() {
    const session = await getServerSession(authOptions)

    console.log("loading page ...")
    const customer = await createCustomer();

    const hasSub = await hasSubscription();
    console.log(hasSub ? "has" : "has not");

    const checkoutLink = await createCheckoutLink(String(customer))
    console.log("checkout link", checkoutLink)

    const user = await prisma.user.findFirst({
        where: {
            email: session?.user?.email
        }
    })

    // log last 10 api logs of the user
    const top10Logs = await prisma.log.findMany({
        where: {
            userId: user?.id
        },
        orderBy: {
            created: "desc",
        },
        take: 10
    })

    // get current usage of the api
    let currentUsage = 0
    if (hasSub) {
        const subscription = await stripe.subscriptions.list({
            customer: String(user?.stripe_customer_id)
        });

        const invoice = await stripe.invoices.retrieveUpcoming({
            subscription: subscription.data.at(0)?.id
        })

        // getting usage amount here - 1 API request => 10 Rs
        currentUsage = invoice.amount_due
    }

    return (
        <div>
            {
                hasSub ?
                    <>
                        <div className="min-h-[60vh] py-10 flex flex-col gap-4 place-items-center rounded-lg bg-green-100 mt-12 justify-center">
                            <div className="text-center text-xl pb-5">You have a subscription</div>
                            {/* <div className="flex align-center justify-center items-center">
                                <Link href={String(checkoutLink)} className="align-center rounded-xl font-[18px] px-6 py-4 bg-black text-white hover:underline">
                                    Checkout Now
                                </Link>
                            </div> */}
                            <div className="min-w-[50rem] divide-y divide-zinc-300 border border-zinc-400 rounded-md" >
                                <div className="text-sm text-black px-6 py-4" >API Key :</div>
                                <div className="p-3">{user?.api_key}</div>
                            </div>
                            <div className="min-w-[50rem] divide-y divide-zinc-300 border border-zinc-400 rounded-md" >
                                <div className="text-sm text-black px-6 py-4" >Current Usage :</div>
                                <div className="p-3">{currentUsage/1000}</div>
                            </div>
                            <div className="min-w-[50rem] divide-y divide-zinc-300 border border-zinc-400 rounded-md" >
                                <div className="text-sm text-black px-6 py-4" >Log Events:</div>
                                <div className=" bg-zinc-100 rounded-lg ">
                                    {top10Logs.map((item, index) => (
                                        <div className="flex items-center p-2 gap-4" key={index}>
                                            <div>
                                                {item.method}
                                            </div>
                                            <div>
                                                {item.status}
                                            </div>
                                            <div>
                                                {item.userId}
                                            </div>
                                            <div>
                                                {String(item.created.toUTCString())}
                                            </div>
                                        </div>
                                    ))
                                    }
                                </div>
                            </div>

                        </div>
                    </>
                    :
                    <>
                        <div className="min-h-[60vh] grid  place-items-center rounded-lg bg-red-100 mt-12 justify-center">
                            <div className="text-center text-xl ">You have no active subscription</div>
                            <div className="flex align-center justify-center items-center">
                                <Link href={String(checkoutLink)} className="align-center rounded-xl font-[18px] px-6 py-4 bg-black text-white hover:underline">
                                    Checkout Now
                                </Link>
                            </div>

                        </div>
                    </>
            }
        </div>
    )
}