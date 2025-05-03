import TDEECalculator from '@/app/ui/tdee_calculator';
import Macro_Calculator from '@/app/ui/macro_calculator';
export default function MacroCalculator() {
    return (
        <div className="flex flex-row w-full h-full">
            <TDEECalculator />
            <Macro_Calculator />
        </div>
    );
}