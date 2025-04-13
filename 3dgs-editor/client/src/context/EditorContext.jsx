import { createContext, useContext, useMemo } from 'react'
import { RenderSystem } from '../lib/three/renderer'

const EditorContext = createContext()

export function EditorProvider({ children }) {
  const state = useMemo(() => ({
    initRenderer: (container) => {
      const renderer = new RenderSystem(container)
      return () => renderer.dispose()
    },
    // 添加更多编辑器状态和方法
  }), [])

  return (
    <EditorContext.Provider value={state}>
      {children}
    </EditorContext.Provider>
  )
}

export const useEditor = () => useContext(EditorContext)