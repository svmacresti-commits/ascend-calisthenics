import { useRef, useMemo } from 'react'
import { SKILLS, TIERS } from '../data/skills'
import SkillNode from './SkillNode'
import { useConnectorLines } from '../lib/useConnectorLines'

export default function SkillTree({ completed, onNodeClick }) {
  const containerRef = useRef(null)
  const nodeRefsMap = useRef(new Map())

  const isUnlocked = (skill) =>
    skill.prereqs.every((id) => completed[id])

  const byTier = useMemo(() => {
    const map = new Map(TIERS.map((t) => [t.tier, []]))
    for (const s of SKILLS) map.get(s.tier).push(s)
    return map
  }, [])

  const { paths, size } = useConnectorLines({
    containerRef,
    nodeRefsMap,
    skills: SKILLS,
  })

  return (
    <div className="tree-scroll">
      <div className="tree-container" ref={containerRef}>
        <svg
          className="tree-svg"
          width={size.width}
          height={size.height}
          style={{ width: size.width, height: size.height }}
        >
          {paths.map((p) => {
            const fromDone = !!completed[p.from]
            return (
              <path
                key={p.key}
                d={p.d}
                className={fromDone ? 'connector connector-active' : 'connector'}
                fill="none"
              />
            )
          })}
        </svg>

        {TIERS.map(({ tier, label }) => {
          const skills = byTier.get(tier)
          const doneInTier = skills.filter((s) => completed[s.id]).length
          return (
            <section className="tier-row" key={tier}>
              <div className="tier-label">
                <span className="tier-number mono">T{tier}</span>
                <span className="tier-name">{label}</span>
                <span className="tier-count mono">
                  {doneInTier}/{skills.length}
                </span>
              </div>
              <div className="tier-nodes">
                {skills.map((skill) => (
                  <SkillNode
                    key={skill.id}
                    ref={(el) => {
                      if (el) nodeRefsMap.current.set(skill.id, el)
                      else nodeRefsMap.current.delete(skill.id)
                    }}
                    skill={skill}
                    isComplete={!!completed[skill.id]}
                    isUnlocked={isUnlocked(skill)}
                    onClick={onNodeClick}
                  />
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
