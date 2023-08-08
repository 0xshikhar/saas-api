import { getServerSession } from "next-auth"
import { redirect } from 'next/navigation'
import { authOptions } from "@/pages/api/auth/[...nextauth]"

export async function loggedIn() {
    const session = await getServerSession(authOptions)
    console.log("session: ", session)
    if (session) {
        console.log("Logged in successfully")
    }
    else {
        console.log("Not Logged in")
        redirect('/api/auth/signin')
    }
}