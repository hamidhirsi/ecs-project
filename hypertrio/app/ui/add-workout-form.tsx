'use client';

import { useState } from 'react';

interface AddWorkoutFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (workoutName: string, exercises: string[]) => void;
}

export default function AddWorkoutForm({ isOpen, onClose, onSubmit }: AddWorkoutFormProps) {
    const [workoutName, setWorkoutName] = useState('');
    const [exercises, setExercises] = useState<string[]>([]);
    const [selectedExercise, setSelectedExercise] = useState('');
    const [showExerciseInput, setShowExerciseInput] = useState(false);

    const availableExercises = [
        "Bench Press", "Deadlift", "Squat", "Overhead Press", 
        "Bent Over Row", "Lateral Raise", "Biceps Curl", 
        "Triceps Extension", "Chest Press", "Shoulder Press",
        "Pull-ups", "Rows", "Leg Press", "Face Pulls",
        "Hammer Curls", "Incline Press", "Lat Pulldowns", "Dips"
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (workoutName && exercises.length > 0) {
            onSubmit(workoutName, exercises);
            setWorkoutName('');
            setExercises([]);
            onClose();
        }
    };

    const addExercise = () => {
        if (selectedExercise && !exercises.includes(selectedExercise)) {
            setExercises([...exercises, selectedExercise]);
            setSelectedExercise('');
            setShowExerciseInput(false);
        }
    };

    const removeExercise = (exercise: string) => {
        setExercises(exercises.filter(e => e !== exercise));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-base-100 rounded-lg p-6 w-96 max-h-[80vh] overflow-y-auto">
                <h2 className="text-2xl font-bold text-primary mb-4">Add New Workout</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="label">
                            <span className="label-text">Workout Name</span>
                        </label>
                        <input
                            type="text"
                            value={workoutName}
                            onChange={(e) => setWorkoutName(e.target.value)}
                            className="input input-bordered w-full"
                            placeholder="Enter workout name"
                            required
                        />
                    </div>

                    <div>
                        <label className="label">
                            <span className="label-text">Exercises</span>
                        </label>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {exercises.map((exercise, index) => (
                                <div
                                    key={index}
                                    className="bg-primary text-primary-content px-3 py-1 rounded-full flex items-center gap-2"
                                >
                                    <span>{exercise}</span>
                                    <button
                                        type="button"
                                        onClick={() => removeExercise(exercise)}
                                        className="hover:text-error"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                        
                        {showExerciseInput ? (
                            <div className="flex flex-col gap-2">
                                <select
                                    value={selectedExercise}
                                    onChange={(e) => setSelectedExercise(e.target.value)}
                                    className="select select-bordered w-full"
                                >
                                    <option value="">Select an exercise</option>
                                    {availableExercises
                                        .filter(exercise => !exercises.includes(exercise))
                                        .map((exercise, index) => (
                                            <option key={index} value={exercise}>
                                                {exercise}
                                            </option>
                                        ))}
                                </select>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={addExercise}
                                        className="btn btn-primary flex-1"
                                        disabled={!selectedExercise}
                                    >
                                        Add
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowExerciseInput(false)}
                                        className="btn btn-ghost"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={() => setShowExerciseInput(true)}
                                className="btn btn-outline btn-primary w-full"
                            >
                                Add Exercise
                            </button>
                        )}
                    </div>

                    <div className="flex gap-2 justify-end mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn btn-ghost"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={!workoutName || exercises.length === 0}
                        >
                            Create Workout
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
