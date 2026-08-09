// Storage layer for Ascend Calisthenics.
//
// Everything here is written as async functions on purpose, even though the
// current implementation (localStorage) doesn't need to be async. That way,
// when you're ready to move to real accounts + a database (e.g. Supabase),
// you swap the *inside* of these functions for real network calls and every
// component that calls them keeps working exactly the same way.
//
// Data shape kept in localStorage:
// {
//   profile: { name: string },
//   completed: { [skillId]: true },
//   notes: { [skillId]: string }
// }

const STORAGE_KEY = 'ascend-calisthenics:data'

function readAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { profile: null, completed: {}, notes: {} }
    const parsed = JSON.parse(raw)
    return {
      profile: parsed.profile ?? null,
      completed: parsed.completed ?? {},
      notes: parsed.notes ?? {},
    }
  } catch (err) {
    console.error('Ascend: failed to read local storage', err)
    return { profile: null, completed: {}, notes: {} }
  }
}

function writeAll(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    return true
  } catch (err) {
    console.error('Ascend: failed to write local storage', err)
    return false
  }
}

export async function getProfile() {
  return readAll().profile
}

export async function setProfile(profile) {
  const data = readAll()
  data.profile = profile
  writeAll(data)
  return profile
}

export async function getProgress() {
  const data = readAll()
  return { completed: data.completed, notes: data.notes }
}

export async function toggleSkillComplete(skillId) {
  const data = readAll()
  if (data.completed[skillId]) {
    delete data.completed[skillId]
  } else {
    data.completed[skillId] = true
  }
  writeAll(data)
  return data.completed
}

export async function setSkillNote(skillId, note) {
  const data = readAll()
  if (note && note.trim().length > 0) {
    data.notes[skillId] = note
  } else {
    delete data.notes[skillId]
  }
  writeAll(data)
  return data.notes
}

export async function resetAllProgress() {
  const data = readAll()
  data.completed = {}
  data.notes = {}
  writeAll(data)
  return data
}
