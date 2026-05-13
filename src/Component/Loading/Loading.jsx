import { LoaderCircle, Package2, Truck } from "lucide-react";

const Loading = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.98),_rgba(247,247,247,0.95)_45%,_rgba(235,235,235,0.9))] px-4">
      <div className="w-full max-w-md rounded-3xl border border-black/10 bg-white/90 p-8 text-center shadow-[0_24px_80px_rgba(0,0,0,0.12)] backdrop-blur-sm">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[rgba(255,193,7,0.14)] text-black shadow-inner">
          <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg">
            <LoaderCircle
              className="h-10 w-10 animate-spin text-black"
              strokeWidth={1.8}
            />
            <Truck className="absolute bottom-3 right-3 h-5 w-5 text-[--color-primary]" />
          </div>
        </div>

        <div className="mb-4 space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-black/50">
            Zap Shift
          </p>
          <h1 className="text-2xl font-bold text-black">
            Securing your delivery space
          </h1>
          <p className="text-sm leading-6 text-black/60">
            We are checking your session and preparing the fastest route to your
            dashboard.
          </p>
        </div>

        <div className="mb-4 h-2 overflow-hidden rounded-full bg-black/10">
          <div className="h-full w-2/3 rounded-full bg-[linear-gradient(90deg,_var(--color-primary),_rgba(255,193,7,0.45),_var(--color-primary))] bg-[length:200%_100%] animate-[pulse_1.6s_ease-in-out_infinite]" />
        </div>

        <div className="flex items-center justify-center gap-2 text-sm text-black/55">
          <Package2 className="h-4 w-4" />
          <span>Loading secure access</span>
        </div>
      </div>
    </div>
  );
};

export default Loading;
