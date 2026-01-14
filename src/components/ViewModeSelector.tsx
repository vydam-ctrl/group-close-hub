import { useNavigate } from 'react-router-dom';
import { useViewMode } from '@/contexts/ViewModeContext';
import { cn } from '@/lib/utils';

export function ViewModeSelector() {
    const { viewMode, setViewMode } = useViewMode();
    const navigate = useNavigate();

    const handleModeSwitch = (mode: 'HO' | 'BU') => {
        setViewMode(mode);
        navigate('/');
    };

    return (
        <div className="fixed top-3 left-72 z-[100] flex items-center gap-1 bg-card/40 backdrop-blur-xl p-1 rounded-full border border-border shadow-lg">
            <button
                onClick={() => handleModeSwitch('HO')}
                className={cn(
                    "px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200",
                    viewMode === 'HO'
                        ? "bg-primary text-primary-foreground shadow-md scale-105"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
            >
                HO VIEW
            </button>
            <button
                onClick={() => handleModeSwitch('BU')}
                className={cn(
                    "px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200",
                    viewMode === 'BU'
                        ? "bg-primary text-primary-foreground shadow-md scale-105"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
            >
                BU VIEW
            </button>
        </div>
    );
}
