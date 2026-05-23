export function FullscreenLoader() {
  return (
    <div className="fixed inset-0 bg-slate-950 z-50 flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin" />

        <p className="text-slate-300 mt-6 text-lg">
          Выполняется вход...
        </p>
      </div>
    </div>
  );
}