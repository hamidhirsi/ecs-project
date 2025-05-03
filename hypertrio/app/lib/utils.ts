import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { useSession } from "next-auth/react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface Workout {
    _id: string;
    name: string;
    exercises: string[];
    created_at: string;
}

interface WorkoutData {
    [key: string]: string[];
}

export const fetchWorkouts = async () => {
    const { data: session } = useSession();
    const userId = session?.user?.id;
    if (!userId) {
        throw new Error('No user session found');
    }

    const response = await fetch(`http://localhost:8000/workouts/workouts/${userId}`);
    if (!response.ok) {
        throw new Error('Failed to fetch workouts');
    }
    const workoutsList: Workout[] = await response.json();
    const workoutnum = workoutsList.length;
    
    return workoutnum;
};

export const fetchWorkoutCount = async (session: any) => {
    const userId = session?.user?.id;
    if (!userId) {
        throw new Error('No user session found');
    }

    const response = await fetch(`http://localhost:8000/workouts/workouts_count/${userId}`);
    if (!response.ok) {
        throw new Error('Failed to fetch workout count');
    }
    const workoutnum = await response.json();
    return workoutnum;
};
    