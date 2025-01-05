import { Card } from "@/components/ui/card";
import { ResumePreview } from "@/components/resume/ResumePreview";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ComparisonViewProps {
  originalResume: any;
  optimizedResume: any;
}

export function ComparisonView({ originalResume, optimizedResume }: ComparisonViewProps) {
  console.log("Original Resume:", originalResume);
  console.log("Optimized Resume:", optimizedResume);

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
          <ResumePreview 
            data={optimizedResume} 
            isOptimized={true}
            originalContent={originalResume}
          />
        </ScrollArea>
      </Card>
    </div>
  );
}