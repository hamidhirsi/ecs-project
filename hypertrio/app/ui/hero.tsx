import Image from "next/image";
import Link from "next/link";

export default function Hero() {
    return (
        <div className="flex flex-col items-center gap-16 py-8 px-4 max-w-7xl mx-auto">
            <div className="flex flex-row items-center justify-between gap-12">
                <div className="flex-shrink-0">
                    <Image
                        src="/hero.png"
                        alt="Hero"
                        width={650}
                        height={300}
                        className="rounded-lg"
                    />
                </div>
                <div className="flex flex-col gap-6 max-w-xl">
                    <h2 className="text-6xl font-semibold text-primary leading-tight">
                        Optimising Your Workouts with AI
                    </h2>
                    <p className="text-lg font-light text-base-content">
                        Take your fitness journey to the next level with personalized, AI-driven workout plans tailored to your goals. Track, analyse, and improve your performance with insights that adapt as you progress.
                    </p>
                    <Link href="/register">
                        <button type="button" className="btn btn-primary w-fit px-8 rounded-md hover:scale-105 transition-transform">
                            Register
                        </button>
                    </Link>
                </div>
            </div>
            <div className="card w-full max-w-4xl bg-base-300 shadow-xl">
                <div className="card-body bg-base-200 rounded-xl">
                    <h3 className="card-title text-2xl justify-center text-base-content">Everything You Need</h3>
                    <div className="grid grid-cols-2 gap-6 mt-4">
                        <div className="flex items-center gap-3">
                            <div className="badge badge-primary badge-xs"></div>
                            <p className="text-base-content">Tracking Macros</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="badge badge-primary badge-xs"></div>
                            <p className="text-base-content">Tracking Reps and Sets</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="badge badge-primary badge-xs"></div>
                            <p className="text-base-content">Progressively Overloading</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="badge badge-primary badge-xs"></div>
                            <p className="text-base-content">Tailored Workouts</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="badge badge-primary badge-xs"></div>
                            <p className="text-base-content">Dieting Plans</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="badge badge-primary badge-xs"></div>
                            <p className="text-base-content">Progress Tracking</p>
                        </div>
                    </div>
                    <p className="text-xl font-bold text-primary text-center mt-4">All in one place!</p>
                </div>
            </div>
        </div>
    );
}