/**
 * Style Dictionary v4 config
 * Platforms: css, esm, figma
 * Prefix: 'iridescent' → --iridescent-* CSS variables
 */
import StyleDictionary from 'style-dictionary'
import { fileURLToPath } from 'url'
import path from 'path'
import figmaVariablesFormat from './sd-formats/figma-variables.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

StyleDictionary.registerFormat({
  name: 'json/figma-variables',
  format: figmaVariablesFormat,
})

const sd = new StyleDictionary({
  source: [path.join(__dirname, 'tokens/**/*.json')],
  log: { verbosity: 'default' },
  platforms: {
    css: {
      transformGroup: 'css',
      prefix: 'iridescent',
      buildPath: 'dist/',
      files: [
        {
          destination: 'iridescent.css',
          format: 'css/variables',
          options: { outputReferences: false },
        },
      ],
    },
    esm: {
      transformGroup: 'js',
      buildPath: 'dist/',
      files: [
        {
          destination: 'tailwind.tokens.mjs',
          format: 'javascript/esm',
        },
      ],
    },
    figma: {
      transformGroup: 'js',
      buildPath: 'dist/',
      files: [
        {
          destination: 'figma.tokens.json',
          format: 'json/figma-variables',
        },
      ],
    },
  },
})

await sd.buildAllPlatforms()
