import { useState } from 'react'

export default function ProfileGate({ onCreate }) {
  const [name, setName] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    onCreate({ name: trimmed })
  }

  return (
    <div className="gate">
      <div className="gate-card">
        <div className="gate-eyebrow">ASCEND CALISTHENICS</div>
        <h1 className="gate-title">Start your climb</h1>
        <p className="gate-copy">
          Every push-up, hold, and lever on the way to a full planche and beyond.
          Your progress saves in this browser.
        </p>
        <form onSubmit={handleSubmit} className="gate-form">
          <input
            autoFocus
            type="text"
            placeholder="What should we call you?"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="gate-input"
            maxLength={40}
          />
          <button type="submit" className="btn btn-accent" disabled={!name.trim()}>
            Begin
          </button>
        </form>
        <p className="gate-footnote">
          No email, no password — this just labels your saved progress on this device.
        </p>
      </div>
    </div>
  )
}
