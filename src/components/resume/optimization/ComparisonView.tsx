import { Card } from "@/components/ui/card";
import { ResumePreview } from "@/components/resume/ResumePreview";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

interface ComparisonViewProps {
  originalResume: any;
  optimizedResume: any;
  isLoading?: boolean;
}

export function ComparisonView({ originalResume, optimizedResume, isLoading = false }: ComparisonViewProps) {
  console.log("Original Resume in ComparisonView:", originalResume);
  console.log("Optimized Resume in ComparisonView:", optimizedResume);

  if (!originalResume) {
    return (
      <div className="text-center p-8">
        <p className="text-sm text-muted-foreground">
          Unable to load original resume. Please try again.
        </p>
      </div>
    );
  }

  const LoadingSkeleton = () => (
    <div className="space-y-4">
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-2 gap-4 h-[600px]">
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Original Resume</h3>
        <ScrollArea className="h-[500px]">
          <ResumePreview data={originalResume} />
        </ScrollArea>
      </Card>
      
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Optimized Resume</h3>
        <ScrollArea className="h-[500px]">
          {isLoading ? (
            <LoadingSkeleton />
          ) : optimizedResume ? (
            <ResumePreview 
              data={optimizedResume.content} 
              isOptimized={true}
              originalContent={originalResume}
            />
          ) : (
            <div className="text-center p-8">
              <p className="text-sm text-muted-foreground">
                Optimization failed. Please try again.
              </p>
            </div>
          )}
        </ScrollArea>
      </Card>
    </div>
  );
}