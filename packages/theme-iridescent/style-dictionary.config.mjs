import StyleDictionary from 'style-dictionary'

const __dirname = new URL('.', import.meta.url).pathname

const sd = StyleDictionary.extend({
  source: [`${__dirname}src/tokens.json`],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'dist/',
      files: [
        {
          destination: 'iridescent.css',
          format: 'css/variables',
          options: { selector: ':root' }
        }
      ]
    },
    dtcg: {
      transformGroup: 'js',
      buildPath: 'dist/',
      files: [
        {
          destination: 'tokens.dtcg.json',
          format: 'json/nested'
        }
      ]
    },
    ts: {
      transformGroup: 'js',
      buildPath: 'dist/',
      files: [
        {
          destination: 'tokens.ts',
          format: 'javascript/es6',
          options: { exportDefault: true }
        }
      ]
    }
  }
})

sd.buildAllPlatforms()
