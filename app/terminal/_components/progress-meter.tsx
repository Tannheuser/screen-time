type ProgressMeterProps = {
  label: string;
  value: number;
  max: number;
};

export function ProgressMeter({ label, value, max }: ProgressMeterProps) {
  const boundedMax = Math.max(0, max);
  const boundedValue = Math.min(Math.max(0, value), boundedMax);
  const percentage = boundedMax === 0 ? 0 : (boundedValue / boundedMax) * 100;

  return (
    <div>
      <div className="mb-3 flex items-center justify-between font-mono text-xs uppercase tracking-[0.2em] text-cyan-200">
        <span>{label}</span>
        <span>
          {boundedValue} / {boundedMax}
        </span>
      </div>

      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={boundedMax}
        aria-valuenow={boundedValue}
        aria-valuetext={`${boundedValue} of ${boundedMax} completed`}
        className="h-3 rounded-full border border-cyan-200/20 bg-black/30 p-0.5"
      >
        <div
          className="h-full rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(103,232,249,0.9)] transition-[width] duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
