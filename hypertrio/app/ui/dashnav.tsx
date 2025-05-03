import Link from "next/link";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export default function DashNav() {
    return (
        <div className="flex flex-row justify-end items-center w-screen h-20 bg-base-200 opacity-50">
            <div className="flex flex-row gap-6 mr-14">
                <Link href="/dashboard/profile">
                    <AccountCircleIcon fontSize="large" sx={{ color: 'black' }} />
                </Link>
            </div>
        </div>
    );
}