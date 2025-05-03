export const runtime = "nodejs";
import SideBar from "../ui/sidebar";
import DashNav from "../ui/dashnav";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import SessionGuardProvider from "./SessionGuardProvider";
import { Toaster } from "@/app/ui/toaster";


export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();
    if (!session?.user) redirect("/login");
    return (
        <div className="flex flex-row h-screen w-screen bg-base-100">
            <SideBar />
            <DashNav />
            <div className="absolute top-20 left-56 right-0 bottom-0 bg-base-100 flex flex-row"> 
                <SessionGuardProvider session={session}>
                  {children}
                </SessionGuardProvider>
            </div>
            <Toaster />
        </div>
    );
}