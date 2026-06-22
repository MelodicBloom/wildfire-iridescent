import type { Meta, StoryObj } from '@storybook/react'
import { TiltedChromaCard } from '../components/TiltedChromaCard'
import { AbaloneCanvas } from '../components/AbaloneCanvas'

const meta: Meta = {
  title: 'Accessibility/Suite',
  parameters: {
    chromatic: { delay: 300, pauseAnimationAtEnd: true },
    layout: 'centered',
  },
}

export default meta

/** Keyboard focus ring visible on TiltedChromaCard */
export const FocusRing: StoryObj = {
  render: () => (
    <TiltedChromaCard
      style={{ width: '360px', height: '480px' }}
      aria-label="Featured project card"
    >
      <p style={{ color: 'white', padding: '1rem' }}>Tab to focus this card</p>
    </TiltedChromaCard>
  )
}

/** Reduced motion — shader animation zeroed via token override */
export const ReducedMotion: StoryObj = {
  globals: { motion: 'reduced' },
  parameters: {
    chromatic: { delay: 100, pauseAnimationAtEnd: true },
  },
  render: () => (
    <div style={{ display: 'flex', gap: '2rem' }}>
      <AbaloneCanvas style={{ width: '300px', height: '200px' }} />
      <TiltedChromaCard
        style={{ width: '300px', height: '200px' }}
        aria-label="Reduced motion card"
      >
        <p style={{ color: 'white', padding: '1rem' }}>No animation</p>
      </TiltedChromaCard>
    </div>
  )
}

/** High-contrast check — white text on dark surface */
export const HighContrast: StoryObj = {
  render: () => (
    <TiltedChromaCard
      style={{ width: '360px', height: '200px', background: 'var(--iridescent-color-surface, #050510)' }}
      aria-label="High contrast card"
    >
      <p style={{
        color: '#ffffff',
        padding: '1rem',
        fontSize: '1rem',
        lineHeight: 1.5
      }}>
        WCAG AA: white (#fff) on #050510 = 20.9:1 contrast ratio
      </p>
    </TiltedChromaCard>
  )
}
