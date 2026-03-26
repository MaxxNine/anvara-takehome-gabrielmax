export function HomeBProofBand() {
  return (
    <div className="relative">
      <div className="absolute inset-0 border-y border-white/10 bg-black/20 backdrop-blur-sm" />
      <div className="relative mx-auto max-w-7xl px-5 py-6 sm:px-10 sm:py-10 lg:px-16">
        <p className="text-center text-[10px] font-bold uppercase tracking-[0.24em] text-white/50 sm:text-[11px]">
          Used by teams at
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 sm:mt-7 sm:gap-x-16 sm:gap-y-6">
          {['GRAZIA', 'SEPHORA', 'Huel', 'CR1821A', 'Huel'].map((brand, i) => (
            <span
              key={i}
              className={`tracking-widest text-white/70 ${
                i === 0 || i === 3
                  ? 'font-serif text-lg italic sm:text-[1.9rem]'
                  : 'text-lg font-semibold sm:text-[1.85rem]'
              }`}
            >
              {brand}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
