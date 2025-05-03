'use client';

import Link from "next/link";
import Menu from "../../../ui/menu";
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useToast } from '@/app/ui/use-toast';
import { useParams, useRouter } from 'next/navigation';

interface Workout {
    _id: string;
    name: string;
    exercises: string[];
    user_id: string;
    created_at: string;
}

const ALL_EXERCISES = [
    "Bench Press", "Deadlift", "Squat", "Overhead Press", 
    "Bent Over Row", "Pull-ups", "Push-ups", "Dips",
    "Lateral Raise", "Front Raise", "Face Pull", "Tricep Extension",
    "Bicep Curl", "Leg Press", "Leg Extension", "Leg Curl",
    "Calf Raise", "Ab Crunch", "Plank", "Russian Twist"
];

export default function Page() {
    const params = useParams();
    const router = useRouter();
    const workoutName = decodeURIComponent(params.workout as string);
    const [exercises, setExercises] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedExercise, setSelectedExercise] = useState("");
    const [workoutId, setWorkoutId] = useState("");
    const { data: session } = useSession();
    const { toast } = useToast();

    const fetchWorkout = async () => {
        try {
            const userId = session?.user?.id;
            if (!userId) {
                throw new Error('No user session found');
            }

            const response = await fetch(`http://localhost:8000/workouts/workouts/${userId}/${workoutName}`);
            if (!response.ok) {
                throw new Error('Failed to fetch workout');
            }

            const workout: Workout = await response.json();
            setWorkoutId(workout._id);
            setExercises(workout.exercises);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching workout:', error);
            toast({
                title: "Error",
                description: "Failed to fetch workout",
                variant: "destructive",
            });
        }
    };

    useEffect(() => {
        if (session?.user?.id) {
            fetchWorkout();
        }
    }, [session, workoutName]);

    const handleAddExercise = async () => {
        if (!selectedExercise) return;

        try {
            const userId = session?.user?.id;
            if (!userId) throw new Error('No user session found');

            const updatedExercises = [...exercises, selectedExercise];
            
            const response = await fetch(`http://localhost:8000/workouts/workouts/${workoutId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: workoutName,
                    exercises: updatedExercises,
                    user_id: userId
                })
            });

            if (!response.ok) throw new Error('Failed to update workout');

            await fetchWorkout(); // Refresh the exercises list
            setIsModalOpen(false);
            setSelectedExercise("");
            
            toast({
                title: "Success",
                description: "Exercise added successfully!",
            });
        } catch (error) {
            console.error('Error adding exercise:', error);
            toast({
                title: "Error",
                description: "Failed to add exercise",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="flex flex-col w-full h-full relative">
            <div className="flex-1 p-8 overflow-y-auto">
                <div className="flex flex-col items-center max-w-2xl mx-auto">
                    <h1 className="text-2xl font-bold text-primary mb-8">{workoutName}</h1>
                    {isLoading ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="loading loading-spinner loading-lg text-primary"></div>
                        </div>
                    ) : (
                        <div className="w-11/12">
                            <Menu exercises={exercises} mode="exercises" />
                        </div>
                    )}
                </div>
            </div>
            <div className="sticky bottom-0 w-full p-4 bg-base-100 border-t border-base-300">
                <div className="flex justify-between items-center max-w-2xl mx-auto px-4">
                    <button 
                        className="btn btn-primary w-fit px-8 rounded-md hover:scale-105 transition-transform"
                        onClick={() => {
                            localStorage.setItem('workoutExercises', JSON.stringify(exercises));
                            router.push(`/dashboard/workouts/${encodeURIComponent(workoutName)}/workout`);
                        }}
                    >
                        Start Workout
                    </button>
                    <button 
                        className="btn btn-outline w-fit px-8 rounded-md hover:scale-105 transition-transform"
                        onClick={() => setIsModalOpen(true)}
                    >
                        Add Exercise
                    </button>

                    {/* Exercise Selection Modal */}
                    <dialog className={`modal ${isModalOpen ? 'modal-open' : ''}`}>
                        <div className="modal-box">
                            <h3 className="font-bold text-lg mb-4">Add Exercise</h3>
                            <select 
                                className="select select-bordered w-full text-base-content"
                                value={selectedExercise}
                                onChange={(e) => setSelectedExercise(e.target.value)}
                            >
                                <option value="">Select an exercise</option>
                                {ALL_EXERCISES
                                    .filter(exercise => !exercises.includes(exercise))
                                    .map((exercise, index) => (
                                        <option key={index} value={exercise}>
                                            {exercise}
                                        </option>
                                    ))
                                }
                            </select>
                            <div className="modal-action">
                                <button 
                                    className="btn btn-ghost"
                                    onClick={() => {
                                        setIsModalOpen(false);
                                        setSelectedExercise("");
                                    }}
                                >
                                    Cancel
                                </button>
                                <button 
                                    className="btn btn-primary"
                                    onClick={handleAddExercise}
                                    disabled={!selectedExercise}
                                >
                                    Add Exercise
                                </button>
                            </div>
                        </div>
                        <form method="dialog" className="modal-backdrop">
                            <button onClick={() => setIsModalOpen(false)}>close</button>
                        </form>
                    </dialog>
                </div>
            </div>
        </div>
    );
}