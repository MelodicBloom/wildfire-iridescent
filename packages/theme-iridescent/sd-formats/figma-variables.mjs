/**
 * Figma Variables JSON format for Style Dictionary v4
 * Outputs a flat map of { variableName: value } for Figma Variables REST API.
 */
export default function figmaVariablesFormat({ dictionary }) {
  const variables = {}

  dictionary.allTokens.forEach((token) => {
    // Convert token path to camelCase variable name
    const name = token.path
      .map((part, i) =>
        i === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1)
      )
      .join('')
    variables[name] = token.$value ?? token.value
  })

  return JSON.stringify({ variables }, null, 2)
}
