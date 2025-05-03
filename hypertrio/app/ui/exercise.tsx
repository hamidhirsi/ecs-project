'use client';
import React, { useState } from "react";

type Set = {
    kg: string;
    reps: string;
    notes: string;
};

interface ExerciseProps {
    name: string;
    onSetsChange: (name: string, sets: Set[]) => void;
}

export default function Exercise({ name, onSetsChange }: ExerciseProps) {
    const [isExpanded, setIsExpanded] = useState(true);
    const [sets, setSets] = useState<Set[]>([{ kg: '', reps: '', notes: '' }]);
    const addSet = () => {
        const newSets = [...sets, { kg: '', reps: '', notes: '' }];
        setSets(newSets);
        onSetsChange(name, newSets);
    };

    const updateSet = (index: number, field: keyof Set, value: string) => {
        const newSets = [...sets];
        newSets[index][field] = value;
        setSets(newSets);
        onSetsChange(name, newSets);
    };

    return (
        <div className="card bg-base-200 w-full max-w-xl shadow-xl m-4">
            <div className="card-body p-4">
                <div className="flex justify-between items-center">
                    <h2 className="card-title text-base-content">{name}</h2>
                    <button 
                        className="btn btn-ghost btn-circle btn-sm"
                        onClick={() => setIsExpanded(!isExpanded)}
                    >
                        <span className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                            ▼
                        </span>
                    </button>
                </div>
                
                {isExpanded && (
                    <>
                        <div className="mt-2">
                            <div className="grid grid-cols-3 text-base-content/60 text-sm border-b border-base-300 pb-1">
                                <span>Kg</span>
                                <span>Reps</span>
                                <span>Notes</span>
                            </div>
                            {sets.map((set, index) => (
                                <div key={index} className="grid grid-cols-3 gap-2 text-sm border-b border-base-300 py-2">
                                    <input 
                                        type="number" 
                                        placeholder="kg" 
                                        value={set.kg}
                                        onChange={(e) => updateSet(index, 'kg', e.target.value)}
                                        className="input input-bordered input-sm w-full max-w-xs text-base-content" 
                                    />
                                    <input 
                                        type="number" 
                                        placeholder="reps" 
                                        value={set.reps}
                                        onChange={(e) => updateSet(index, 'reps', e.target.value)}
                                        className="input input-bordered input-sm w-full max-w-xs text-base-content" 
                                    />
                                    <input 
                                        type="text" 
                                        placeholder="notes" 
                                        value={set.notes}
                                        onChange={(e) => updateSet(index, 'notes', e.target.value)}
                                        className="input input-bordered input-sm w-full max-w-xs text-base-content" 
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="card-actions justify-end mt-2">
                            <button className="btn btn-primary btn-sm" onClick={addSet}>
                                Add Set
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}