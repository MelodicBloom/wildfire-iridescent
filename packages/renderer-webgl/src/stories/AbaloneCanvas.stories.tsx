import type { Meta, StoryObj } from '@storybook/react'
import { AbaloneCanvas } from '../AbaloneCanvas'

const meta: Meta<typeof AbaloneCanvas> = {
  title: 'Renderer/AbaloneCanvas',
  component: AbaloneCanvas,
  parameters: {
    chromatic: { delay: 300, pauseAnimationAtEnd: true },
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof AbaloneCanvas>

export const Default: Story = {
  args: {
    style: { width: '800px', height: '600px' },
  },
}
