import SearchQueryingState from "@/components/search/SearchQueryingState";
import WorkstationShell from "@/components/layout/WorkstationShell";

export default function Loading() {
  return (
    <WorkstationShell>
      <div className="flex-1 flex items-center justify-center">
        <SearchQueryingState />
      </div>
    </WorkstationShell>
  );
}
