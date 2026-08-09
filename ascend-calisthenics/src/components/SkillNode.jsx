import { forwardRef } from 'react'
import { CATEGORIES } from '../data/skills'

const SkillNode = forwardRef(function SkillNode(
  { skill, isComplete, isUnlocked, onClick },
  ref
) {
  const cat = CATEGORIES[skill.category]

  let stateClass = 'node-locked'
  if (isComplete) stateClass = 'node-complete'
  else if (isUnlocked) stateClass = 'node-available'

  return (
    <button
      ref={ref}
      className={`node ${stateClass}`}
      onClick={() => onClick(skill)}
      title={skill.name}
    >
      <span className="node-dot">{cat.code}</span>
      <span className="node-name">{skill.name}</span>
      {isComplete && <span className="node-check">{'\u2713'}</span>}
      {!isComplete && !isUnlocked && <span className="node-lock">{'\u{1F512}'}</span>}
    </button>
  )
})

export default SkillNode
