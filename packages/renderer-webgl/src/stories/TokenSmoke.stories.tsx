import type { Meta, StoryObj } from '@storybook/react'
import { AbaloneCanvas } from '../components/AbaloneCanvas'
import { TiltedChromaCard } from '../components/TiltedChromaCard'

const meta: Meta = {
  title: 'Tokens/SmokeSuite',
  parameters: {
    chromatic: { delay: 300, pauseAnimationAtEnd: true },
    layout: 'fullscreen'
  }
}

export default meta

export const DefaultTokens: StoryObj = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', padding: '2rem' }}>
      <AbaloneCanvas style={{ width: '400px', height: '300px' }} />
      <TiltedChromaCard style={{ width: '360px', height: '480px' }}>
        <p style={{ color: 'white', padding: '1rem' }}>Default tokens</p>
      </TiltedChromaCard>
    </div>
  )
}

export const ReducedMotion: StoryObj = {
  globals: { motion: 'reduced' },
  parameters: {
    chromatic: { delay: 100, pauseAnimationAtEnd: true }
  },
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', padding: '2rem' }}>
      <AbaloneCanvas style={{ width: '400px', height: '300px' }} />
      <TiltedChromaCard style={{ width: '360px', height: '480px' }}>
        <p style={{ color: 'white', padding: '1rem' }}>Reduced motion</p>
      </TiltedChromaCard>
    </div>
  )
}
