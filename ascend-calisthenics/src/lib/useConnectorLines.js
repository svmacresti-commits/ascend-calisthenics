import { useEffect, useState, useCallback } from 'react'

// Computes SVG path strings connecting each skill node to its prerequisite
// node(s), based on actual rendered DOM positions. Recomputes on resize and
// whenever the set of nodes changes (e.g. after data loads).
export function useConnectorLines({ containerRef, nodeRefsMap, skills }) {
  const [paths, setPaths] = useState([])
  const [size, setSize] = useState({ width: 0, height: 0 })

  const recompute = useCallback(() => {
    const container = containerRef.current
    if (!container) return

    const containerRect = container.getBoundingClientRect()
    const next = []

    for (const skill of skills) {
      const toEl = nodeRefsMap.current.get(skill.id)
      if (!toEl) continue
      const toRect = toEl.getBoundingClientRect()
      const toX = toRect.left + toRect.width / 2 - containerRect.left
      const toY = toRect.top - containerRect.top

      for (const prereqId of skill.prereqs) {
        const fromEl = nodeRefsMap.current.get(prereqId)
        if (!fromEl) continue
        const fromRect = fromEl.getBoundingClientRect()
        const fromX = fromRect.left + fromRect.width / 2 - containerRect.left
        const fromY = fromRect.bottom - containerRect.top

        const midY = (fromY + toY) / 2
        const d = `M ${fromX} ${fromY} C ${fromX} ${midY}, ${toX} ${midY}, ${toX} ${toY}`

        next.push({ key: `${prereqId}->${skill.id}`, d, from: prereqId, to: skill.id })
      }
    }

    setPaths(next)
    setSize({ width: container.scrollWidth, height: container.scrollHeight })
  }, [containerRef, nodeRefsMap, skills])

  useEffect(() => {
    recompute()
    const raf = requestAnimationFrame(recompute)

    const ro = new ResizeObserver(() => recompute())
    if (containerRef.current) ro.observe(containerRef.current)
    window.addEventListener('resize', recompute)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      window.removeEventListener('resize', recompute)
    }
  }, [recompute, containerRef])

  return { paths, size, recompute }
}
