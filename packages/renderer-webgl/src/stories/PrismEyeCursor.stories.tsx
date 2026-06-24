import type { Meta, StoryObj } from '@storybook/react'
import { PrismEyeCursor } from '../PrismEyeCursor'

const meta: Meta<typeof PrismEyeCursor> = {
  title: 'Renderer/PrismEyeCursor',
  component: PrismEyeCursor,
  parameters: {
    chromatic: { delay: 300, pauseAnimationAtEnd: true },
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof PrismEyeCursor>

export const Default: Story = {}
