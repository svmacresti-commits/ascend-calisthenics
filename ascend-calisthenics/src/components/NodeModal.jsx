import { useEffect, useState } from 'react'
import { CATEGORIES, getSkillById } from '../data/skills'

export default function NodeModal({ skill, completed, notes, onClose, onToggleComplete, onSaveNote }) {
  const [noteDraft, setNoteDraft] = useState(notes[skill.id] || '')

  useEffect(() => {
    setNoteDraft(notes[skill.id] || '')
  }, [skill.id, notes])

  const cat = CATEGORIES[skill.category]
  const isComplete = !!completed[skill.id]
  const isUnlocked = skill.prereqs.every((id) => completed[id])

  function handleClose() {
    if (noteDraft !== (notes[skill.id] || '')) {
      onSaveNote(skill.id, noteDraft)
    }
    onClose()
  }

  return (
    <div className="modal-backdrop" onClick={handleClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="tag">{cat.label}</span>
          <button className="modal-close" onClick={handleClose} aria-label="Close">
            {'\u2715'}
          </button>
        </div>

        <h2 className="modal-title">{skill.name}</h2>
        <p className="modal-desc">{skill.desc}</p>

        <div className="modal-cue">
          <span className="modal-cue-label mono">CUE</span>
          <span>{skill.cue}</span>
        </div>

        {skill.prereqs.length > 0 && (
          <div className="modal-prereqs">
            <span className="modal-section-label mono">PREREQUISITES</span>
            <ul className="prereq-list">
              {skill.prereqs.map((id) => {
                const p = getSkillById(id)
                const done = !!completed[id]
                return (
                  <li key={id} className={done ? 'prereq-done' : 'prereq-pending'}>
                    <span className="prereq-dot" />
                    {p ? p.name : id}
                  </li>
                )
              })}
            </ul>
          </div>
        )}

        {!isUnlocked && !isComplete && (
          <div className="modal-locked-note">
            Complete the prerequisites above to unlock this skill.
          </div>
        )}

        <div className="modal-notes">
          <span className="modal-section-label mono">YOUR NOTES</span>
          <textarea
            className="modal-textarea"
            placeholder="Reps, hold times, cues that click for you..."
            value={noteDraft}
            onChange={(e) => setNoteDraft(e.target.value)}
            rows={3}
          />
        </div>

        <button
          className={`btn ${isComplete ? 'btn-success-active' : 'btn-accent'}`}
          onClick={() => onToggleComplete(skill.id)}
          disabled={!isUnlocked && !isComplete}
        >
          {isComplete ? 'Mark as not complete' : 'Mark as complete'}
        </button>
      </div>
    </div>
  )
}
