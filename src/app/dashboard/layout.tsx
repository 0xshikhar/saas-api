import { Header } from "@/components/header"
import { loggedIn } from "@/lib/auth"
import createCustomer, { hasSubscription, stripe } from "@/lib/stripe"

export default async function DashboardLayout({ children, }: { children: React.ReactNode }) {
    await loggedIn();
    await createCustomer();

    // console.log("stripe:", stripe)

    const hasSub = await hasSubscription();
    console.log(hasSub ? "has" : "has not");


    return (
        <div className="">
            <Header />
            <div className="max-w-5xl m-auto w-full px-4 ">
                {children}
            </div>
        </div>
    )
}