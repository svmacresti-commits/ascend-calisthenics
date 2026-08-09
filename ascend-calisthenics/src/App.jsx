import { useEffect, useState, useCallback } from 'react'
import ProfileGate from './components/ProfileGate'
import ProgressHeader from './components/ProgressHeader'
import SkillTree from './components/SkillTree'
import NodeModal from './components/NodeModal'
import { SKILLS } from './data/skills'
import {
  getProfile,
  setProfile as saveProfile,
  getProgress,
  toggleSkillComplete,
  setSkillNote,
  resetAllProgress,
} from './lib/storage'

export default function App() {
  const [loading, setLoading] = useState(true)
  const [profile, setProfileState] = useState(null)
  const [completed, setCompleted] = useState({})
  const [notes, setNotes] = useState({})
  const [activeSkill, setActiveSkill] = useState(null)

  useEffect(() => {
    async function load() {
      const [p, progress] = await Promise.all([getProfile(), getProgress()])
      setProfileState(p)
      setCompleted(progress.completed)
      setNotes(progress.notes)
      setLoading(false)
    }
    load()
  }, [])

  const handleCreateProfile = useCallback(async (p) => {
    const saved = await saveProfile(p)
    setProfileState(saved)
  }, [])

  const handleToggleComplete = useCallback(async (skillId) => {
    const next = await toggleSkillComplete(skillId)
    setCompleted({ ...next })
  }, [])

  const handleSaveNote = useCallback(async (skillId, note) => {
    const next = await setSkillNote(skillId, note)
    setNotes({ ...next })
  }, [])

  const handleReset = useCallback(async () => {
    const ok = window.confirm(
      'Reset all progress and notes? This cannot be undone.'
    )
    if (!ok) return
    const data = await resetAllProgress()
    setCompleted({ ...data.completed })
    setNotes({ ...data.notes })
  }, [])

  if (loading) {
    return <div className="loading-screen">Loading{'\u2026'}</div>
  }

  if (!profile) {
    return <ProfileGate onCreate={handleCreateProfile} />
  }

  return (
    <div className="app">
      <ProgressHeader
        name={profile.name}
        completedCount={Object.keys(completed).length}
        totalCount={SKILLS.length}
        onReset={handleReset}
      />

      <SkillTree completed={completed} onNodeClick={setActiveSkill} />

      {activeSkill && (
        <NodeModal
          skill={activeSkill}
          completed={completed}
          notes={notes}
          onClose={() => setActiveSkill(null)}
          onToggleComplete={handleToggleComplete}
          onSaveNote={handleSaveNote}
        />
      )}
    </div>
  )
}
