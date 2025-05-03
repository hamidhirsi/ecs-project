"use client"

import { TrendingUp } from "lucide-react"
import { CartesianGrid, XAxis, YAxis, ResponsiveContainer, LineChart, Line, Tooltip, Legend } from "recharts"
import { useState, useMemo } from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/app/ui/chart"

  


const chartConfig = {
  Actual: {
    label: "Actual",
    color: "hsl(var(--chart-1))",
  },
  Projected: {
    label: "Projected",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig

interface Set {
  kg: string;
  reps: string;
  notes: string;
  completed_at: string;
}

interface ExerciseData {
  [key: string]: Set[];
}

export default function AreaGraph({ exerciseData }: { exerciseData?: ExerciseData }) {
  const [selectedExercise, setSelectedExercise] = useState('');
  const [selectedTrainingType, setSelectedTrainingType] = useState<"hypertrophy" | "strength">("hypertrophy");
  const [exerciseSets, setExerciseSets] = useState<Set[]>([]);

  function calculateWeightMultiplier(startWeight: number, currentWeight: number): number {
    const weightDiff = currentWeight - startWeight;
    return 1 + (0.10 * Math.floor(weightDiff / 2)); // +10% per 2kg increase
  }
  
  function getRepMultiplier(reps: number, type: "hypertrophy" | "strength"): number {
    if (type === "hypertrophy") {
      if (reps <= 2) return 0.7; // heavily penalized
      if (reps === 3) return 0.8;
      if (reps === 4) return 0.9;
      if (reps === 5) return 0.95;
      if (reps === 6) return 1.0;
      if (reps === 7) return 1.06;
      if (reps === 8) return 1.09;
      if (reps >= 9) return 1.10 + ((reps - 8) * 0.005); // small diminishing returns after 8
    } else if (type === "strength") {
      if (reps === 1) return 0.9;  // lower reps slightly penalized
      if (reps === 2) return 0.95;
      if (reps === 3) return 1.0;
      if (reps === 4) return 1.05;
      if (reps === 5) return 1.08;
      if (reps >= 6) return 1.08 + ((reps - 5) * 0.003); // very small diminishing returns after 5
    }
    return 1.0; // fallback if somehow invalid
  }
  

  const chartData = useMemo(() => {
    if (!exerciseSets?.length) return [];
    const startWeight = parseFloat(exerciseSets[0].kg);
    
    return exerciseSets.map((set, index) => {
      const weightMultiplier = calculateWeightMultiplier(startWeight, parseFloat(set.kg));
      const reps = parseInt(set.reps, 10) || 0;
      const repMultiplier = getRepMultiplier(reps, selectedTrainingType);
      const score = 100 * weightMultiplier * repMultiplier;
      
      const standardScore = 100 + (index * 15); // Starts at 100 and increases by 15 each session
      return {
        session: index + 1,
        score,
        standard: standardScore,
        weight: parseFloat(set.kg),
        reps: parseInt(set.reps, 10),
        completedAt: set.completed_at
      };
    });
  }, [exerciseSets, selectedTrainingType]);

  const handleExerciseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const exerciseName = e.target.value;
    setSelectedExercise(exerciseName);
    
    if (exerciseData && exerciseName) {
      const sets = exerciseData[exerciseName];
      setExerciseSets(sets);
      console.log(chartData)
    }
  };

  const handleTrainingTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const type = e.target.value as "hypertrophy" | "strength";
    setSelectedTrainingType(type);
    console.log(chartData)
  };

  return (
    <Card className="w-full flex flex-col h-full bg-base-200">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex flex-col space-y-2">
            <CardTitle className="text-primary">Progressive Overload Graph</CardTitle>
            <CardDescription className="text-muted-foreground">
              Shows the progress of the overload
            </CardDescription>
          </div>
          <div>
            <select 
              className="select select-bordered bg-base-100 text-base-content w-44 mr-4"
              value={selectedExercise}
              onChange={handleExerciseChange}
            >
              <option value="" disabled>Select an exercise</option>
              {exerciseData && Object.keys(exerciseData).map((exerciseName) => (
                <option key={exerciseName} value={exerciseName}>
                  {exerciseName}
                </option>
              ))}
            </select>
            <select 
              className="select select-bordered bg-base-100 text-base-content w-24"
              value={selectedTrainingType}
              onChange={handleTrainingTypeChange}
            >
              <option value="" disabled>Select training type</option>
              <option value="hypertrophy">Hypertrophy</option>
              <option value="strength">Strength</option>
              </select>
            </div>
        </div>
      </CardHeader>
      <CardContent className="min-h-[300px] max-h-[500px] flex-1">
        <ChartContainer config={chartConfig} className="h-full w-full" >
          <ResponsiveContainer width="100%" height="100%">
          <LineChart
            width={600}
            height={300}
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="session" label={{ value: "Session", position: "insideBottom", offset: 10 }} />
              <YAxis label={{ value: "Adjusted Weight", angle: -90, position: "insideLeft" }} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-base-100 p-2 rounded-lg border border-base-300 shadow-md">
                        <p className="font-medium text-primary">Session {data.session}</p>
                        <p className="text-sm">Score: {data.score.toFixed(1)}</p>
                        <p className="text-sm">Weight: {data.weight}kg</p>
                        <p className="text-sm">Reps: {data.reps}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend className="text-primary" />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="hsl(var(--primary))" 
                name="Your Performance"
                dot={{ stroke: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: 'hsl(var(--primary))', strokeWidth: 2, fill: 'hsl(var(--primary))' }}
              />
              <Line 
                type="monotone" 
                dataKey="standard" 
                stroke="hsl(var(--accent))" 
                strokeWidth={2}
                name="Progressive Overload Standard"
                strokeDasharray="5 5"
                dot={false}
              />
          </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
