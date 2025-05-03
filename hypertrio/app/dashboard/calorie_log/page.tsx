import Link from "next/link";
import CalorieLogger from "@/app/ui/calorie_logger";

export default function CalorieLog() {
    return (
        <div className=" w-full h-full flex flex-col overflow-scroll">
            <CalorieLogger />
        </div>
    );
}