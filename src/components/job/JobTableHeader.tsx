import { cn } from "@/lib/utils";

export function JobTableHeader() {
  return (
    <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-slate-50 text-sm font-medium text-slate-500">
      <div className="col-span-4">Title</div>
      <div className="col-span-3 text-center">Status</div>
      <div className="col-span-3 text-center">Date Added</div>
      <div className="col-span-2 text-right">Actions</div>
    </div>
  );
}