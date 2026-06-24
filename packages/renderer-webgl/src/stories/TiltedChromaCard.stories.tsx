import type { Meta, StoryObj } from '@storybook/react'
import { TiltedChromaCard } from '../TiltedChromaCard'

const meta: Meta<typeof TiltedChromaCard> = {
  title: 'Renderer/TiltedChromaCard',
  component: TiltedChromaCard,
  parameters: {
    chromatic: { delay: 300, pauseAnimationAtEnd: true },
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof TiltedChromaCard>

export const Default: Story = {
  args: {
    style: { width: '360px', height: '480px' },
    children: <p style={{ color: 'white', padding: '1rem' }}>Card content</p>,
  },
}
