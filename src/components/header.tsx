import Link from "next/link";

export function Header() {
    return (
        <nav className="max-w-5xl m-auto w-full relative flex items-center justify-between">
            <div className="flex items-center justify-between gap-8 pt-5">
                <Link href={"/"}
                    className="text-2xl font-bold text-black hover:opacity-80">0xAPI
                </Link>

                <div className="ml-[600px] flex items-center gap-8">
                    <Link
                        href="/#features"
                        className="font-medium text-sm text-black hover:opacity-90"
                    >
                        Features
                    </Link>

                    <Link
                        href="/#pricing"
                        className="font-medium text-sm text-black hover:opacity-90"
                    >
                        Pricing
                    </Link>

                    <Link
                        href="/dashboard"
                        className="font-medium text-sm text-white bg-black py-2 px-4 rounded-lg hover:opacity-90"
                    >
                        Dashboard
                    </Link>
                </div>
            </div>


        </nav>
    );
}
