import type { Meta, StoryObj } from '@storybook/react'
import { AbaloneCanvas } from '../components/AbaloneCanvas'
import { TiltedChromaCard } from '../components/TiltedChromaCard'

const meta: Meta = {
  title: 'Accessibility/Suite',
  parameters: {
    chromatic: { delay: 300, pauseAnimationAtEnd: true },
    layout: 'centered',
  },
}

export default meta

type Story = StoryObj

export const FocusRing: Story = {
  render: () => (
    <TiltedChromaCard
      style={{ width: '360px', height: '420px' }}
      aria-label="Featured iridescent project card"
    >
      <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', padding: '1rem' }}>
        <p style={{ color: '#ffffff' }}>Tab to focus this card and verify the visible focus ring.</p>
      </div>
    </TiltedChromaCard>
  ),
}

export const ReducedMotion: Story = {
  globals: { motion: 'reduced' },
  parameters: {
    chromatic: { delay: 100, pauseAnimationAtEnd: true },
  },
  render: () => (
    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
      <AbaloneCanvas
        style={{ width: '300px', height: '220px' }}
        aria-label="Reduced-motion abalone shader preview"
      />
      <TiltedChromaCard
        style={{ width: '300px', height: '220px' }}
        aria-label="Reduced-motion chroma card"
      >
        <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', padding: '1rem' }}>
          <p style={{ color: '#ffffff' }}>Decorative shader motion is token-disabled.</p>
        </div>
      </TiltedChromaCard>
    </div>
  ),
}

export const HighContrast: Story = {
  render: () => (
    <TiltedChromaCard
      style={{ width: '360px', height: '220px', background: 'var(--iridescent-surface-card-background, #0f0e1f)' }}
      aria-label="High contrast card"
    >
      <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', padding: '1rem' }}>
        <p style={{ color: '#ffffff', fontSize: '1rem', lineHeight: 1.5 }}>
          High-contrast text on dark iridescent surface.
        </p>
      </div>
    </TiltedChromaCard>
  ),
}
