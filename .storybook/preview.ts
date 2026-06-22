import type { Preview } from '@storybook/react'
import '../packages/theme-iridescent/dist/iridescent.css'

const preview: Preview = {
  globalTypes: {
    motion: {
      description: 'Motion preference override',
      toolbar: {
        title: 'Motion',
        icon: 'lightning',
        items: [
          { value: 'full',    title: 'Full motion'    },
          { value: 'reduced', title: 'Reduced motion' }
        ],
        dynamicTitle: true
      }
    },
    tokenMode: {
      description: 'Token theme mode',
      toolbar: {
        title: 'Tokens',
        icon: 'paintbrush',
        items: [
          { value: 'default', title: 'Default' },
          { value: 'vivid',   title: 'Vivid'   }
        ],
        dynamicTitle: true
      }
    }
  },
  initialGlobals: {
    motion: 'full',
    tokenMode: 'default'
  },
  decorators: [
    (Story, context) => {
      const { motion, tokenMode } = context.globals

      if (motion === 'reduced') {
        document.documentElement.style.setProperty('--motion-duration-micro', '0ms')
        document.documentElement.style.setProperty('--motion-duration-macro', '0ms')
        document.documentElement.style.setProperty('--iridescent-shader-animation-speed', '0')
      } else {
        document.documentElement.style.removeProperty('--motion-duration-micro')
        document.documentElement.style.removeProperty('--motion-duration-macro')
        document.documentElement.style.removeProperty('--iridescent-shader-animation-speed')
      }

      document.documentElement.setAttribute('data-token-mode', tokenMode)
      return <Story />
    }
  ]
}

export default preview
