interface Workout {
    _id: string;
    name: string;
    exercises: string[];
    created_at: string;
    updated_at?: string;
}

interface WorkoutRequest {
    name: string;
    exercises: string[];
}

export async function getWorkouts(): Promise<Workout[]> {
    const response = await fetch('/api/workouts', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch workouts');
    }

    return response.json();
}

export async function addWorkout(workout: WorkoutRequest): Promise<{ id: string }> {
    const response = await fetch('/api/workouts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(workout),
    });

    if (!response.ok) {
        throw new Error('Failed to add workout');
    }

    return response.json();
}

export async function updateWorkout(id: string, workout: WorkoutRequest): Promise<{ id: string }> {
    const response = await fetch(`/api/workouts/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(workout),
    });

    if (!response.ok) {
        throw new Error('Failed to update workout');
    }

    return response.json();
}

export async function deleteWorkout(id: string): Promise<{ id: string }> {
    const response = await fetch(`/api/workouts/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to delete workout');
    }

    return response.json();
}
