export function HomeBProofBand() {
  return (
    <div className="relative">
      <div className="absolute inset-0 border-y border-white/10 bg-black/20 backdrop-blur-sm" />
      <div className="relative mx-auto max-w-7xl px-6 py-10 sm:px-10 lg:px-16">
        <p className="text-center text-[11px] font-bold uppercase tracking-[0.24em] text-white/50">
          Used by teams at
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-x-10 gap-y-6 sm:gap-x-16">
          {['GRAZIA', 'SEPHORA', 'Huel', 'CR1821A', 'Huel'].map((brand, i) => (
            <span
              key={i}
              className={`tracking-widest text-white/70 ${
                i === 0 || i === 3
                  ? 'font-serif text-[1.9rem] italic'
                  : 'text-[1.85rem] font-semibold'
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
