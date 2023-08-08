import { Header } from "@/components/header"
import { loggedIn } from "@/lib/auth"
import { createCheckoutLink, hasSubscription, createCustomer } from "@/lib/stripe"

export default async function DashboardLayout({ children, }: { children: React.ReactNode }) {
    await loggedIn();
    
    return (
        <div className="">
            <Header />
            <div className="max-w-5xl m-auto w-full px-4 ">
                {children}
            </div>
        </div>
    )
}