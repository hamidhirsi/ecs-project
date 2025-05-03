'use client';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useRouter } from 'next/navigation';

type WorkoutMenuProps = {
  workouts?: Record<string, string[]>;
  exercises?: string[];
  mode: 'workouts' | 'exercises';
};

export default function WorkoutMenu({ workouts = {}, exercises = [], mode }: WorkoutMenuProps) {
  const router = useRouter();
  const items = mode === 'workouts' ? Object.keys(workouts) : exercises;

  const handleItemClick = (item: string) => {
    if (mode === 'workouts') {
      router.push(`workouts/${encodeURIComponent(item)}`);
    }
  };

  return (
    <div className="mt-10 w-full max-h-[400px] overflow-y-scroll rounded-box">
      <ul className="flex flex-row menu  bg-base-200 w-11/12 rounded-box p-4 space-y-2 max-h-[500px] overflow-y-scroll">
        {items.map((item: string, index: number) => (
          <li key={item} 
              onClick={() => handleItemClick(item)}
              className={`${mode === 'workouts' ? 'cursor-pointer w-full' : 'w-full'} `}
          >
            <a className="flex justify-between items-center  py-10 text-lg hover:bg-primary hover:text-primary-content">
              {item}
              {mode === 'workouts' && <ArrowForwardIcon />}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function WorkoutList({workouts}: {workouts: Record<string, string[]>}){
  return(
    <div className="w-5/6 m-5 h-80 bg-base-200 rounded-box overflow-scroll">
      {Object.keys(workouts).map((workout) => (
        <div key={workout} className="flex flex-row justify-center items-center hover:bg-primary group rounded-xl ease-in-out duration-200 m-2">
          <span className="text-base-content text-lg m-1 p-6 group-hover:text-base-100 pointer-events-none select-none flex-grow">
            {workout}
          </span>
        </div>
      ))}
    </div>
  )
}