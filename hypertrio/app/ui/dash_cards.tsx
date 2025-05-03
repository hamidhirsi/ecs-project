"use client";

import { Button } from "@/app/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/ui/card";
import { Progress } from "@/app/ui/progress";
import { Download, MessageCircle, Flame, Dumbbell } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { fetchWorkoutCount } from "@/app/lib/utils";


interface DashCardProps {
  title: string;
  description: string;
  value: number;
  max: number;
  icon: React.ReactNode;
  buttonFunction: () => void;
  buttonText: string;
}

function DashCard({ title, description, value, max, icon, buttonFunction, buttonText }: DashCardProps) {
  const percentage = Math.round((value / max) * 100);
  
  return (
    <Card className="w-full h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex flex-col space-y-1.5">
          <CardTitle className="text-lg">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <div className="p-2 bg-primary/10 rounded-full">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-row items-center justify-between">
          <span className="text-4xl font-bold">{value}</span>
          <span className="text-sm text-muted-foreground">/{max}</span>
        </div>
        <Progress value={percentage} className="h-2 mt-2" />
        <div className="mt-1 text-xs text-right text-muted-foreground">
          {percentage}% Complete
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" className="w-full" onClick={buttonFunction}>
          {buttonText}
        </Button>
      </CardFooter>
    </Card>
  );
}

export function MessageProgressCard() {
  const exportMessages = () => {
    console.log("Exporting message progress data...");
    
    alert("Message progress data exported!");
  };

  return (
    <DashCard
      title="Message Progress"
      description="Weekly message completion rate"
      value={75}
      max={100}
      icon={<MessageCircle className="h-5 w-5 text-primary" />}
      buttonFunction={exportMessages}
      buttonText="Export Messages"
    />
  );
}

export function CalorieTrackingCard() {
  const router = useRouter();
  const { data: session } = useSession();
  const [todayCalories, setTodayCalories] = useState<{ total_calories: number; calorie_goal: number } | null>(null);

  useEffect(() => {
    const fetchTodayCalories = async () => {
      try {
        if (!session?.user?.id) return;
        const response = await fetch(`http://localhost:8000/calories/today/${session.user.id}`);
        if (!response.ok) throw new Error('Failed to fetch today\'s calories');
        const data = await response.json();
        setTodayCalories(data);
      } catch (error) {
        console.error('Error fetching today\'s calories:', error);
      }
    };

    fetchTodayCalories();
    // Refresh every minute
    const interval = setInterval(fetchTodayCalories, 60000);
    return () => clearInterval(interval);
  }, [session]);

  const redirectCalories = () => {
    router.push('dashboard/calorie_log');
  };

  return (
    <DashCard
      title="Calorie Tracking"
      description="Daily calorie goal progress"
      value={todayCalories?.total_calories || 0}
      max={todayCalories?.calorie_goal || 2000}
      icon={<Flame className="h-5 w-5 text-primary" />}
      buttonFunction={redirectCalories}
      buttonText="Log Calories"
    />
  );
}

export function WorkoutProgressCard() {
  const [workoutCount, setWorkoutCount] = useState(0);
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();

  useEffect(() => {
    if (pathname !== '/dashboard') return;
    const getWorkoutCount = async () => {
      try {
        const count = await fetchWorkoutCount(session);
        setWorkoutCount(count);
      } catch (error) {
        console.error('Error fetching workout count:', error);
      }
    };
    getWorkoutCount();
  }, [pathname, session]);

  const redirectWorkouts = () => {
    router.push('dashboard/workouts');
  };

  return (
    <DashCard
      title="Workout Progress"
      description="Track your workout completion rate"
      value={workoutCount}
      max={7}
      icon={<Dumbbell className="h-5 w-5 text-primary" />}
      buttonFunction={redirectWorkouts}
      buttonText="Start Workout"
    />
  );
}