import { createCustomer, createCheckoutLink, hasSubscription } from "@/lib/stripe";
import Link from "next/link";
import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
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
    return (
        <div>
            {
                hasSub ?
                    <>
                        <div className="min-h-[60vh] flex flex-col gap-4 place-items-center rounded-lg bg-green-100 mt-12 justify-center">
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