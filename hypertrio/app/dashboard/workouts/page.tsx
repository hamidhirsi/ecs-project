'use client';

import React, { useState, useEffect } from "react";
import Menu from "@/app/ui/menu";
import AddWorkoutForm from "@/app/ui/add-workout-form";
import { useToast } from "@/app/ui/use-toast";
import { useSession } from "next-auth/react";

interface Workout {
    _id: string;
    name: string;
    exercises: string[];
    created_at: string;
}

interface WorkoutData {
    [key: string]: string[];
}

export default function Workouts() {
    const [isAddWorkoutOpen, setIsAddWorkoutOpen] = useState(false);
    const [workouts, setWorkouts] = useState<WorkoutData>({});
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();
    const { data: session } = useSession();

    const fetchWorkouts = async () => {
        try {
            const userId = session?.user?.id;
            if (!userId) {
                throw new Error('No user session found');
            }

            const response = await fetch(`http://localhost:8000/workouts/workouts/${userId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch workouts');
            }
            const workoutsList: Workout[] = await response.json();
            
            const workoutsMap: WorkoutData = {};
            workoutsList.forEach(workout => {
                workoutsMap[workout.name] = workout.exercises;
            });
            
            setWorkouts(workoutsMap);
        } catch (error) {
            console.error('Error fetching workouts:', error);
            toast({
                title: "Error",
                description: "Failed to fetch workouts",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (session?.user?.id) {
            fetchWorkouts();
        }
    }, [session]);

    const handleAddWorkout = async (workoutName: string, exercises: string[]) => {
        try {
            const userId = session?.user?.id;
            if (!userId) {
                throw new Error('No user session found');
            }

            const response = await fetch('http://localhost:8000/workouts/workouts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: workoutName,
                    exercises: exercises,
                    user_id: userId
                })
            });

            if (!response.ok) {
                throw new Error('Failed to add workout');
            }
            
            await fetchWorkouts(); // Refresh the list after adding
            setIsAddWorkoutOpen(false); // Close the modal

            toast({
                title: "Success",
                description: "Workout added successfully",
            });
        } catch (error) {
            console.error('Error adding workout:', error);
            toast({
                title: "Error",
                description: "Failed to add workout",
                variant: "destructive",
            });
        }
    };
    
    return (
        <div className="relative w-full h-full">
            <div className="flex flex-col items-center w-full h-full">
                <div className="flex flex-row items-center justify-center h-1/6 w-full">
                    <h1 className="text-2xl font-bold text-primary">
                        Workouts
                    </h1>
                </div>
                <div className="flex-1 max-w-4xl justify-center w-full rounded-box">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="loading loading-spinner loading-lg text-primary"></div>
                        </div>
                    ) : (
                            <Menu workouts={workouts} mode="workouts" />
                    )}
                </div>    
            </div>

            <button 
                onClick={() => setIsAddWorkoutOpen(true)}
                className="fixed bottom-8 right-8 btn btn-primary w-fit px-8 rounded-full shadow-lg hover:scale-105 transition-transform"
            >
                Add Workout
            </button>

            <AddWorkoutForm 
                isOpen={isAddWorkoutOpen}
                onClose={() => setIsAddWorkoutOpen(false)}
                onSubmit={handleAddWorkout}
            />
        </div>
    );
}

