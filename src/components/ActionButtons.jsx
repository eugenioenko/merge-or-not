export default function ActionButtons({ disabled, onChoose }) {
  return (
    <div className="mx-auto flex w-full max-w-[1200px] gap-3 px-5 py-4">
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChoose('reject')}
        className="flex-1 rounded-xs border border-[var(--border)] bg-[var(--bg-primary)] py-3 text-sm font-semibold text-[var(--accent-red)] transition hover:bg-red-50 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40"
      >
        Reject
      </button>
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChoose('merge')}
        className="flex-1 rounded-xs border border-[var(--accent-green)] bg-[var(--accent-green)] py-3 text-sm font-semibold text-white transition hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40"
      >
        Merge
      </button>
    </div>
  )
}
