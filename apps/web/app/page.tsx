'use client'

import dynamic from 'next/dynamic'

const AbaloneCanvas = dynamic(
  () => import('@wm/renderer-webgl').then((m) => ({ default: m.AbaloneCanvas })),
  { ssr: false, loading: () => <div style={{ background: '#0f0e1f', borderRadius: 16, width: '100%', height: 480 }} /> }
)

const TiltedChromaCard = dynamic(
  () => import('@wm/renderer-webgl').then((m) => ({ default: m.TiltedChromaCard })),
  { ssr: false, loading: () => <div style={{ background: '#0f0e1f', borderRadius: 16 }} /> }
)

export default function Home() {
  return (
    <main style={{
      minHeight: '100vh',
      background: 'var(--background)',
      color: 'var(--foreground)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '3rem',
      padding: '4rem 2rem',
    }}>
      <header style={{ textAlign: 'center' }}>
        <h1 style={{
          fontSize: 'clamp(2rem, 6vw, 4rem)',
          fontWeight: 700,
          letterSpacing: '-0.03em',
          background: 'linear-gradient(135deg, #c9b8ff 0%, #7af8ff 50%, #ff9de2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          Wildfire × Iridescent
        </h1>
        <p style={{ opacity: 0.6, marginTop: '0.75rem', fontSize: '1.1rem' }}>
          High-fidelity WebGL shader UI system
        </p>
      </header>

      <section style={{ width: '100%', maxWidth: 900 }}>
        <h2 style={{ fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.4, marginBottom: '1rem' }}>
          Abalone Canvas
        </h2>
        <AbaloneCanvas style={{ width: '100%', height: 480, borderRadius: 16 }} />
      </section>

      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '2rem',
        width: '100%',
        maxWidth: 900,
      }}>
        {['Abalone Pearl', 'Prism Light', 'Chroma Shift'].map((label) => (
          <TiltedChromaCard key={label} style={{ width: 360, height: 280 }}>
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontWeight: 600, fontSize: '1.1rem',
              pointerEvents: 'none',
            }}>
              {label}
            </div>
          </TiltedChromaCard>
        ))}
      </section>
    </main>
  )
}
