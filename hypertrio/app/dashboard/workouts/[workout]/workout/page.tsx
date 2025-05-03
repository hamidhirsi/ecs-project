'use client'
import Exercise from "@/app/ui/exercise";
import { useState, useEffect } from "react";
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useToast } from '@/app/ui/use-toast';

interface Set {
    kg: string;
    reps: string;
    notes: string;
}

interface ExerciseSets {
    [key: string]: Set[];
}

export default function WorkoutPage() {
    const params = useParams();
    const router = useRouter();
    const { data: session } = useSession();
    const { toast } = useToast();
    const workoutName = decodeURIComponent(params.workout as string);
    const [exercises, setExercises] = useState<string[]>([]);
    const [exerciseSets, setExerciseSets] = useState<ExerciseSets>({});

    useEffect(() => {
        const savedExercises = localStorage.getItem('workoutExercises');
        if (savedExercises) {
            setExercises(JSON.parse(savedExercises));
        }
    }, []);

    const handleSetsChange = (exerciseName: string, sets: Set[]) => {
        setExerciseSets(prev => ({
            ...prev,
            [exerciseName]: sets
        }));
    };

    const handleFinishWorkout = async () => {
        try {
            const completedWorkout = {
                user_id: session?.user?.id,
                workout_name: workoutName,
                exercises: exerciseSets,
                completed_at: new Date().toISOString()
            };
            console.log(completedWorkout);

            const response = await fetch('http://localhost:8000/workouts/completed', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(completedWorkout)
            });

            if (!response.ok) {
                throw new Error('Failed to save workout');
            }

            toast({
                title: "Success",
                description: "Workout completed and saved!",
            });

            router.push('/dashboard/workouts');
        } catch (error) {
            console.error('Error saving completed workout:', error);
            toast({
                title: "Error",
                description: "Failed to save workout",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="flex flex-col w-full h-full relative">
            <div className="flex-1 p-8 overflow-y-auto">
                <div className="flex flex-col items-center max-w-2xl mx-auto">
                    <h1 className="text-2xl font-bold text-primary mb-8">{workoutName}</h1>
                    <div className="w-full grid grid-cols-1 gap-4">
                        {exercises.map((exercise: string, index: number) => (
                            <Exercise 
                                key={index} 
                                name={exercise} 
                                onSetsChange={handleSetsChange}
                            />
                        ))}
                    </div>
                </div>
            </div>
            <div className="sticky bottom-0 w-full p-4 bg-base-100 border-t border-base-300">
                <div className="flex justify-end mr-8">
                    <button 
                        className="btn btn-primary w-fit px-8 rounded-md hover:scale-105 transition-transform"
                        onClick={handleFinishWorkout}
                    >
                        Finish Workout
                    </button>
                </div>
            </div>
        </div>
    );
}