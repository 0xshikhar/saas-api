import NextAuth,{AuthOptions} from "next-auth"
import DiscordProvider from "next-auth/providers/discord"
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const authOptions = {
    // Configure one or more authentication providers
    adapter: PrismaAdapter(prisma),
    providers: [
        DiscordProvider({
            clientId: String(process.env.DISCORD_CLIENT),
            clientSecret: String(process.env.DISCORD_SECRET),
        }),
        // ...add more providers here
    ],
} as AuthOptions

export default NextAuth(authOptions)