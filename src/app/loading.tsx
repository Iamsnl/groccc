export default function Loading() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-4 border-slate-200 border-t-emerald-500 rounded-full animate-spin dark:border-slate-800 dark:border-t-emerald-500"></div>
      <p className="text-slate-500 dark:text-slate-400 font-medium animate-pulse">Loading...</p>
    </div>
  );
}
