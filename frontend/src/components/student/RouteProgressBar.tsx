import React from 'react';
import { Check, MapPin, Compass, Sparkles } from 'lucide-react';

interface RouteProgressBarProps {
  currentStep: number; // 1, 2, 3
  totalSteps?: number;
  onStepClick?: (step: number) => void;
}

interface StepInfo {
  number: number;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const RouteProgressBar: React.FC<RouteProgressBarProps> = ({
  currentStep,
  totalSteps = 3,
  onStepClick,
}) => {
  const steps: StepInfo[] = [
    {
      number: 1,
      title: 'Stop 1: Student Identity',
      subtitle: 'Age, College & Qualification',
      icon: MapPin,
    },
    {
      number: 2,
      title: 'Stop 2: Hyperlocal Zone',
      subtitle: 'Locality & Preferred Work',
      icon: Compass,
    },
    {
      number: 3,
      title: 'Stop 3: Availability & Skills',
      subtitle: 'Days, Hours & Skills',
      icon: Sparkles,
    },
  ];

  return (
    <div className="w-full py-4 px-2 sm:px-4">
      {/* Route Badge */}
      <div className="flex items-center justify-between mb-3 text-xs">
        <div className="flex items-center gap-1.5 font-semibold text-marigold-800 bg-marigold-100/80 px-2.5 py-1 rounded-full border border-marigold-200">
          <span className="w-2 h-2 rounded-full bg-marigold-600 animate-ping inline-block" />
          <span>Local Route Progress</span>
        </div>
        <span className="font-medium text-ink-500">
          Stop {currentStep} of {totalSteps}
        </span>
      </div>

      {/* Progress Track Line & Stops */}
      <div className="relative">
        {/* Background Track Line */}
        <div className="absolute top-5 left-8 right-8 h-1 bg-paper-border -translate-y-1/2 z-0 hidden sm:block" />

        {/* Active Progress Track Line */}
        <div
          className="absolute top-5 left-8 h-1 bg-gradient-to-r from-marigold-500 to-marigold-600 -translate-y-1/2 z-0 transition-all duration-500 ease-out hidden sm:block"
          style={{
            width: `${((currentStep - 1) / (totalSteps - 1)) * 80}%`,
          }}
        />

        {/* Steps Grid */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 relative z-10">
          {steps.map((step) => {
            const isCompleted = currentStep > step.number;
            const isActive = currentStep === step.number;
            const isPending = currentStep < step.number;
            const isClickable = onStepClick && step.number < currentStep;

            const Icon = step.icon;

            return (
              <div
                key={step.number}
                onClick={() => isClickable && onStepClick(step.number)}
                className={`flex flex-col items-center sm:items-start text-center sm:text-left transition-all ${
                  isClickable ? 'cursor-pointer group' : ''
                }`}
              >
                {/* Stop Marker Node */}
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-all shadow-sm ${
                      isCompleted
                        ? 'bg-tealdeep-700 text-white shadow-tealdeep-700/20'
                        : isActive
                        ? 'bg-gradient-to-br from-marigold-500 to-marigold-600 text-white ring-4 ring-marigold-500/20 shadow-marigold-600/30 scale-105'
                        : 'bg-[#FDFBF7] text-ink-400 border border-paper-border'
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-5 h-5 stroke-[2.5]" />
                    ) : (
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    )}
                  </div>
                </div>

                {/* Stop Labels */}
                <div className="w-full">
                  <p
                    className={`text-xs sm:text-sm font-heading font-semibold transition-colors truncate ${
                      isActive
                        ? 'text-marigold-900 font-bold'
                        : isCompleted
                        ? 'text-tealdeep-900'
                        : 'text-ink-400'
                    }`}
                  >
                    {step.title}
                  </p>
                  <p className="text-[11px] text-ink-500 hidden sm:block truncate">
                    {step.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RouteProgressBar;
