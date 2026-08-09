export default function ProgressHeader({ name, completedCount, totalCount, onReset }) {
  const pct = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100)

  return (
    <header className="header">
      <div className="header-top">
        <div className="header-brand">
          <span className="header-brand-mark">A</span>
          <span className="header-brand-text">ASCEND</span>
        </div>
        <div className="header-profile">
          <span className="header-profile-name">{name}</span>
          <button className="btn btn-ghost btn-small" onClick={onReset}>
            Reset progress
          </button>
        </div>
      </div>
      <div className="header-progress">
        <div className="header-progress-track">
          <div className="header-progress-fill" style={{ width: `${pct}%` }} />
        </div>
        <div className="header-progress-label">
          <span className="mono">{completedCount}</span>
          <span className="text-dim"> / {totalCount} skills</span>
          <span className="mono header-progress-pct">{pct}%</span>
        </div>
      </div>
    </header>
  )
}
