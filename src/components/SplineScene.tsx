import { Suspense, lazy, useEffect, useRef, useState } from 'react'

const Spline = lazy(() => import('@splinetool/react-spline'))

interface SplineSceneProps {
  scene: string
  className?: string
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  const triggerRef = useRef<HTMLSpanElement>(null)
  const [shouldLoad, setShouldLoad] = useState(false)

  useEffect(() => {
    const trigger = triggerRef.current
    if (!trigger || !('IntersectionObserver' in window)) {
      setShouldLoad(true)
      return
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setShouldLoad(true)
        observer.disconnect()
      }
    }, { rootMargin: '600px 0px' })
    observer.observe(trigger)
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <span className="spline-observer" ref={triggerRef} />
      {shouldLoad ? (
        <Suspense fallback={<SplineLoader />}>
          <Spline scene={scene} className={className} />
        </Suspense>
      ) : <SplineLoader />}
    </>
  )
}

function SplineLoader() {
  return (
    <div className="spline-loading" role="status" aria-label="Chargement du guide 3D Majubah">
      <span className="spline-loader" />
      <small>INITIALISATION 3D</small>
    </div>
  )
}
