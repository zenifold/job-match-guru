import { cn } from "@/lib/utils";

interface Step {
  title: string;
  description: string;
}

interface StepsProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

export function Steps({ steps, currentStep, className }: StepsProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="relative">
        <div className="absolute left-0 top-2 h-0.5 w-full bg-gray-200">
          <div
            className="absolute h-full bg-primary transition-all duration-500 ease-in-out"
            style={{
              width: `${((currentStep + 1) / steps.length) * 100}%`,
            }}
          />
        </div>
        <div className="relative flex justify-between">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className={cn(
                "flex flex-col items-center",
                index <= currentStep
                  ? "text-primary"
                  : "text-gray-500"
              )}
            >
              <div
                className={cn(
                  "flex h-4 w-4 items-center justify-center rounded-full border transition-colors duration-500",
                  index <= currentStep
                    ? "border-primary bg-primary"
                    : "border-gray-300 bg-white"
                )}
              >
                {index < currentStep && (
                  <svg
                    className="h-2.5 w-2.5 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <div className="mt-2 text-center">
                <div className="text-sm font-medium">{step.title}</div>
                <div className="mt-1 text-xs">{step.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}