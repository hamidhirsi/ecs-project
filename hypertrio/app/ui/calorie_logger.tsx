'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { RestaurantMenu, Add, Delete } from '@mui/icons-material';
import { useToast } from './use-toast';

interface FoodEntry {
    name: string;
    calories: number;
    timestamp: string;
}

interface DayEntry {
    _id: string;
    user_id: string;
    date: string;
    food: FoodEntry[];
    total_calories: number;
    calorie_goal: number;
}

export default function CalorieLogger() {
    const { data: session } = useSession();
    const { toast } = useToast();
    const [todayEntry, setTodayEntry] = useState<DayEntry | null>(null);
    const [newFood, setNewFood] = useState('');
    const [newCalories, setNewCalories] = useState('');

    // Fetch today's entries
    const fetchTodayEntries = async () => {
        try {
            if (!session?.user?.id) return;
            const response = await fetch(`http://localhost:8000/calories/today/${session.user.id}`);
            if (!response.ok) throw new Error('Failed to fetch today\'s entries');
            const data = await response.json();
            setTodayEntry(data);
        } catch (error) {
            console.error('Error fetching entries:', error);
            toast({
                title: 'Error',
                description: 'Failed to fetch today\'s entries',
                variant: 'destructive',
            });
        }
    };

    useEffect(() => {
        fetchTodayEntries();
    }, [session]);

    const handleAddEntry = async () => {
        if (!newFood || !newCalories || !session?.user?.id) return;

        try {
            const response = await fetch(`http://localhost:8000/calories/log/${session.user.id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    food: newFood,
                    calories: parseInt(newCalories)
                }),
            });

            if (!response.ok) throw new Error('Failed to add food entry');
            
            // Refresh entries
            await fetchTodayEntries();
            
            // Clear inputs
            setNewFood('');
            setNewCalories('');
            
            toast({
                title: 'Success',
                description: 'Food entry added',
            });
        } catch (error) {
            console.error('Error adding food entry:', error);
            toast({
                title: 'Error',
                description: 'Failed to add food entry',
                variant: 'destructive',
            });
        }
    };

    if (!session?.user) {
        return <div>Please sign in to use the calorie logger</div>;
    }

    return (
        <div className="flex flex-col w-full max-w-3xl mx-auto p-6 gap-6">
            <div className="flex flex-col items-center gap-4">
                <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
                    <RestaurantMenu />
                    Calorie Logger
                </h1>
                <div className="stats shadow">
                    <div className="stat">
                        <div className="stat-title">Total Calories Today</div>
                        <div className="stat-value text-primary">{todayEntry?.total_calories || 0}</div>
                        <div className="stat-desc">
                            Target: {todayEntry?.calorie_goal || 0} kcal
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-row gap-4">
                <input
                    type="text"
                    placeholder="Food item"
                    className="input input-bordered flex-1 text-base-content"
                    value={newFood}
                    onChange={(e) => setNewFood(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Calories"
                    className="input input-bordered w-32 text-base-content"
                    value={newCalories}
                    onChange={(e) => setNewCalories(e.target.value)}
                    min="0"
                />
                <button
                    className="btn btn-primary"
                    onClick={handleAddEntry}
                    disabled={!newFood || !newCalories}
                >
                    <Add />
                    Add
                </button>
            </div>

            <div className="flex flex-col gap-2">
                {!todayEntry?.food.length ? (
                    <div className="text-center text-base-content/60">
                        No entries yet
                    </div>
                ) : (
                    todayEntry.food.map((entry, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between p-4 bg-base-200 rounded-lg"
                        >
                            <div className="flex-1">
                                <div className="font-medium">{entry.name}</div>
                                <div className="text-sm text-base-content/60">
                                    {entry.calories} calories
                                </div>
                                <div className="text-xs text-base-content/40">
                                    {new Date(entry.timestamp).toLocaleTimeString()}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
