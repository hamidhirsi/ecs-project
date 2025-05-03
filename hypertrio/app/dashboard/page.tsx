'use client'

import { CalorieTrackingCard, WorkoutProgressCard } from "@/app/ui/dash_cards";
import OverloadGraph from "@/app/ui/area-graph";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Dashboard() {
    const { data: session } = useSession();
    const [exerciseData, setExerciseData] = useState<Record<string, any[]> | undefined>(undefined);

    useEffect(() => {
        const fetchExercises = async () => {
            if (session?.user?.id) {
                try {
                    const response = await fetch(`http://localhost:8000/workouts/exercises/${session.user.id}`);
                    if (!response.ok) throw new Error('Failed to fetch exercises');
                    const data = await response.json();
                    setExerciseData(data);
                } catch (error) {
                    console.error('Error fetching exercises:', error);
                }
            }
        };

        fetchExercises();
    }, [session]);
    console.log(exerciseData);
    return (
        <div className="flex flex-col w-screen h-full">
            <div className="flex flex-row items-center justify-center p-6 gap-10 h-[40%]">
                <div className="w-1/2 h-full">
                    <CalorieTrackingCard />
                </div>
                <div className="w-1/2 h-full">
                    <WorkoutProgressCard />
                </div>
            </div>
            <div className="flex flex-row items-center justify-center p-6 h-[60%]">
                <OverloadGraph exerciseData={exerciseData}/>
            </div>
        </div>
    );
}