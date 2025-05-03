'use client';
import { useState } from 'react';

export default function TDEECalculator() {
    const [weight, setWeight] = useState<number>(0);
    const [height, setHeight] = useState<number>(0);
    const [age, setAge] = useState<number>(0);
    const [gender, setGender] = useState<'male' | 'female'>('male');
    const [activityLevel, setActivityLevel] = useState<number>(1.2);
    const [result, setResult] = useState<number | null>(null);

    const calculateTDEE = () => {
        let bmr;
        if (gender === 'male') {
            bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
        } else {
            bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
        }
        setResult(Math.round(bmr * activityLevel));
    };

    return (
        <div className="card bg-base-200 w-full max-w-xl shadow-xl m-4">
            {result ? (
                <div className="card-body flex flex-col items-center justify-between min-h-[400px]">
                    <div className="text-center flex-grow flex flex-col justify-center">
                        <h3 className="text-xl font-bold text-base-content mb-4">Your Total Daily Energy Expenditure</h3>
                        <div className="stats bg-base-100 shadow">
                            <div className="stat">
                                <div className="stat-title">TDEE</div>
                                <div className="stat-value text-primary">{result}</div>
                                <div className="stat-desc">calories per day</div>
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
                <div className="card-body">
                    <h2 className="card-title text-base-content">TDEE Calculator</h2>
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
                            onChange={(e) => setActivityLevel(Number(e.target.value))}
                        >
                            <option value="1.2">Sedentary (office job)</option>
                            <option value="1.375">Light Exercise (1-2 days/week)</option>
                            <option value="1.55">Moderate Exercise (3-5 days/week)</option>
                            <option value="1.725">Heavy Exercise (6-7 days/week)</option>
                            <option value="1.9">Athlete (2x per day)</option>
                        </select>
                    </div>
                    <div className="card-actions justify-end mt-4">
                        <button className="btn btn-primary" onClick={calculateTDEE}>
                            Calculate TDEE
                        </button>
                    </div>
                </div>
            )}
                </div>
    );
}