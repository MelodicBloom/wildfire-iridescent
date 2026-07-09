import type { Meta, StoryObj } from '@storybook/react'
import { AbaloneCanvas } from '../components/AbaloneCanvas'
import { TiltedChromaCard } from '../components/TiltedChromaCard'

const meta: Meta = {
  title: 'Tokens/SmokeSuite',
  parameters: {
    chromatic: { delay: 300, pauseAnimationAtEnd: true },
    layout: 'fullscreen',
  },
}

export default meta

type Story = StoryObj

export const DefaultTokens: Story = {
  render: () => (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
        gap: '2rem',
        padding: '2rem',
        background: 'var(--iridescent-surface-page-background, #080a0f)',
      }}
    >
      <AbaloneCanvas style={{ width: '100%', height: '320px' }} />
      <TiltedChromaCard style={{ width: '100%', minHeight: '320px' }}>
        <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
          <p style={{ color: 'var(--iridescent-surface-text-primary, #e8e0ff)', padding: '1rem' }}>
            Default tokens
          </p>
        </div>
      </TiltedChromaCard>
    </div>
  ),
}

export const ReducedMotion: Story = {
  globals: { motion: 'reduced' },
  parameters: {
    chromatic: { delay: 100, pauseAnimationAtEnd: true },
  },
  render: () => (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
        gap: '2rem',
        padding: '2rem',
        background: 'var(--iridescent-surface-page-background, #080a0f)',
      }}
    >
      <AbaloneCanvas style={{ width: '100%', height: '320px' }} />
      <TiltedChromaCard style={{ width: '100%', minHeight: '320px' }}>
        <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
          <p style={{ color: 'var(--iridescent-surface-text-primary, #e8e0ff)', padding: '1rem' }}>
            Reduced motion
          </p>
        </div>
      </TiltedChromaCard>
    </div>
  ),
}
