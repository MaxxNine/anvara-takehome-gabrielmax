export function HomeBProofBand() {
  return (
    <div className="relative">
      <div className="absolute inset-0 border-y border-white/10 bg-black/20 backdrop-blur-sm" />
      <div className="relative mx-auto max-w-7xl px-6 py-5 sm:px-8 sm:py-7 lg:px-10 lg:py-8 xl:px-12">
        <p className="text-center text-[10px] font-bold uppercase tracking-[0.24em] text-white/50 sm:text-[11px]">
          Used by teams at
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 sm:mt-6 sm:gap-x-10 sm:gap-y-4 lg:mt-7 lg:gap-x-14 lg:gap-y-6">
          {['GRAZIA', 'SEPHORA', 'Huel', 'CR1821A', 'Huel'].map((brand, i) => (
            <span
              key={i}
              className={`tracking-widest text-white/70 ${
                i === 0 || i === 3
                  ? 'font-serif text-[1.15rem] italic sm:text-[1.45rem] lg:text-[1.9rem]'
                  : 'text-[1.15rem] font-semibold sm:text-[1.35rem] lg:text-[1.85rem]'
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
