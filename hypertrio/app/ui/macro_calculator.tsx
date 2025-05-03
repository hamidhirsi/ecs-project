'use client';
import { useState } from 'react';

type ActivityLevels = {
    [key: string]: number;
    m: number;
    l: number;
    l1: number;
    l2: number;
    g: number;
    g1: number;
    g2: number;
};

type MacroResult = {
    tdee: number;
    protein: number;
    carbs: number;
    fat: number;
} | null;

export default function MacroCalculator() {
    const [age, setAge] = useState<number>(0);
    const [gender, setGender] = useState<'male' | 'female'>('male');
    const [height, setHeight] = useState<number>(0);
    const [weight, setWeight] = useState<number>(0);
    const [activityLevel, setActivityLevel] = useState<string>('m');
    const [goal, setGoal] = useState<'maintain' | 'lose' | 'gain'>('maintain');
    const [result, setResult] = useState<MacroResult>(null);

    const activityLevels: ActivityLevels = {
        m: 1.2,    // Sedentary
        l: 1.375,  // Light
        l1: 1.465, // Light+
        l2: 1.55,  // Moderate
        g: 1.725,  // Active
        g1: 1.9,   // Very Active
        g2: 2.0    // Extra Active
    };

    const calculateMacros = () => {
        let bmr = 0;
        if (gender === 'male') {
            bmr = 10 * weight + 6.25 * height - 5 * age + 5;
        } else {
            bmr = 10 * weight + 6.25 * height - 5 * age - 161;
        }

        let tdee = Math.round(bmr * activityLevels[activityLevel]);

        // Adjust TDEE based on goal
        switch (goal) {
            case 'lose':
                tdee -= 500;
                break;
            case 'gain':
                tdee += 500;
                break;
            default:
                break;
        }

        // Calculate macros
        const protein = Math.round(weight * 2); 
        const fat = Math.round((tdee * 0.25) / 9); // 25% of calories from fat
        const carbs = Math.round((tdee - (protein * 4 + fat * 9)) / 4); // Remaining calories from carbs

        setResult({
            tdee,
            protein,
            carbs,
            fat
        });
    };

    return (
        <div className="card bg-base-200 w-full max-w-xl shadow-xl m-4">
            
                {result ? (
                    <div className="card-body flex flex-col items-center justify-between min-h-[400px]">
                        <div className="text-center flex-grow flex flex-col justify-center">
                            <h3 className="text-xl font-bold text-base-content mb-4">Your Daily Macros</h3>
                            <div className="stats stats-vertical shadow w-full">
                                <div className="stat">
                                    <div className="stat-title">Calories (TDEE)</div>
                                    <div className="stat-value text-primary">{result.tdee}</div>
                                </div>
                                <div className="stat">
                                    <div className="stat-title">Protein</div>
                                    <div className="stat-value text-secondary">{result.protein}g</div>
                                    <div className="stat-desc">{result.protein * 4} calories</div>
                                </div>
                                <div className="stat">
                                    <div className="stat-title">Carbs</div>
                                    <div className="stat-value text-accent">{result.carbs}g</div>
                                    <div className="stat-desc">{result.carbs * 4} calories</div>
                                </div>
                                <div className="stat">
                                    <div className="stat-title">Fat</div>
                                    <div className="stat-value text-info">{result.fat}g</div>
                                    <div className="stat-desc">{result.fat * 9} calories</div>
                                </div>
                            </div>
                        </div>
                        <button 
                            type="button" 
                            className="btn btn-primary w-fit px-8 rounded-md hover:scale-105 transition-transform mt-8"
                            onClick={() => setResult(null)}
                        >
                            Recalculate
                        </button>
                    </div>
                ) : (
                <div className="card-body flex flex-col min-h-[400px]">
                    <div className="flex-grow">
                        <h2 className="card-title text-base-content mb-4">Macro Calculator</h2>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text text-base-content">Age</span>
                            </label>
                            <input
                                type="number"
                                className="input input-bordered text-base-content"
                                value={age || ''}
                                onChange={(e) => setAge(Number(e.target.value))}
                            />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text text-base-content">Height (cm)</span>
                            </label>
                            <input
                                type="number"
                                className="input input-bordered text-base-content"
                                value={height || ''}
                                onChange={(e) => setHeight(Number(e.target.value))}
                            />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text text-base-content">Weight (kg)</span>
                            </label>
                            <input
                                type="number"
                                className="input input-bordered text-base-content"
                                value={weight || ''}
                                onChange={(e) => setWeight(Number(e.target.value))}
                            />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text text-base-content">Gender</span>
                            </label>
                            <select
                                className="select select-bordered text-base-content"
                                value={gender}
                                onChange={(e) => setGender(e.target.value as 'male' | 'female')}
                            >
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text text-base-content">Activity Level</span>
                            </label>
                            <select
                                className="select select-bordered text-base-content"
                                value={activityLevel}
                                onChange={(e) => setActivityLevel(e.target.value)}
                            >
                                <option value="m">Sedentary (office job)</option>
                                <option value="l">Light Exercise (1-2 days/week)</option>
                                <option value="l1">Light+ Exercise (2-3 days/week)</option>
                                <option value="l2">Moderate Exercise (3-5 days/week)</option>
                                <option value="g">Active (6-7 days/week)</option>
                                <option value="g1">Very Active (2x per day)</option>
                                <option value="g2">Extra Active (physical job + training)</option>
                            </select>
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text text-base-content">Goal</span>
                            </label>
                            <select
                                className="select select-bordered text-base-content"
                                value={goal}
                                onChange={(e) => setGoal(e.target.value as 'maintain' | 'lose' | 'gain')}
                            >
                                <option value="maintain">Maintain Weight</option>
                                <option value="lose">Lose Weight (-500 cal)</option>
                                <option value="gain">Gain Weight (+500 cal)</option>
                            </select>
                        </div>
                    </div>
                    <div className="card-actions justify-end mt-4">
                        <button 
                            className="btn btn-primary w-fit px-8 rounded-md hover:scale-105 transition-transform" 
                            onClick={calculateMacros}
                        >
                            Calculate Macros
                        </button>
                    </div>
                </div>
                )}
        </div>
    );
}