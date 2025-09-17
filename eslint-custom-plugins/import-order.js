export default {
  rules: {
    "style-imports-last": {
      meta: { type: "layout", fixable: "code", messages: { arrange: "Style imports must be last with a blank line separator." } },
      create(context) {
        const sourceCode = context.sourceCode
        function isStyleImport(node) {
          const v = node.source && node.source.value
          if (typeof v !== "string") return false

          return /(\.module\.)?(css|scss|sass|less)(\?.*)?$/i.test(v)
        }

        return {
          Program(program) {
            const body = program.body
            const firstNonImportIndex = body.findIndex(n => n.type !== "ImportDeclaration")
            const imports = (firstNonImportIndex === -1 ? body : body.slice(0, firstNonImportIndex)).filter(n => n.type === "ImportDeclaration")
            if (imports.length === 0) return
            const style = []
            const nonStyle = []
            for (const imp of imports) (isStyleImport(imp) ? style : nonStyle).push(imp)
            if (style.length === 0) return
            const firstStyleIndex = imports.findIndex(n => isStyleImport(n))
            const lastNonStyleIndex = (() => { let i = -1; for (let k = 0; k < imports.length; k++) if (!isStyleImport(imports[k])) i = k;

              return i })()
            if (firstStyleIndex === -1) return
            const orderBad = lastNonStyleIndex > -1 && lastNonStyleIndex > firstStyleIndex
            if (orderBad) {
              const start = imports[0].range[0]
              const end = imports[imports.length - 1].range[1]
              const nonStyleText = nonStyle.map(n => sourceCode.getText(n).trim()).join("\n")
              const styleText = style.map(n => sourceCode.getText(n).trim()).join("\n")
              const rebuilt = (nonStyleText ? nonStyleText + "\n\n" : "") + styleText + "\n"
              context.report({ node: imports[0], messageId: "arrange", fix(fixer) { return fixer.replaceTextRange([ start, end ], rebuilt) } })

              return
            }
            if (nonStyle.length && style.length) {
              const sepStart = nonStyle[nonStyle.length - 1].range[1]
              const sepEnd = style[0].range[0]
              const between = sourceCode.text.slice(sepStart, sepEnd)
              const normalized = between.replace(/\r\n/g, "\n")
              if (normalized !== "\n\n") {
                context.report({ node: style[0], messageId: "arrange", fix(fixer) { return fixer.replaceTextRange([ sepStart, sepEnd ], "\n\n") } })
              }
            }
          }
        }
      }
    }
    ,
    "ordered-import-groups": {
      meta: {
        type: "layout",
        fixable: "code",
        schema: [
          {
            type: "object",
            properties: {
              groups: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    test: {
                      anyOf: [
                        { type: "string" },
                        { type: "array", items: { type: "string" } }
                      ]
                    },
                    unmatched: { type: "boolean" },
                    label: { type: "string" }
                  },
                  additionalProperties: true
                }
              },
              unmatched: { enum: [ "top", "bottom" ] },
              blankLinesBetweenGroups: { type: "integer", minimum: 0 }
            },
            additionalProperties: false
          }
        ],
        messages: { arrange: "Imports must follow configured group order with normalized spacing." }
      },
      create(context) {
        const sourceCode = context.sourceCode
        const option = context.options && context.options[0] || {}
        const groupsConfig = Array.isArray(option.groups) ? option.groups : []
        const unmatchedPosition = option.unmatched === "bottom" ? "bottom" : "top"
        const blankLines = Number.isInteger(option.blankLinesBetweenGroups) ? Math.max(0, option.blankLinesBetweenGroups) : 1
        const toRegexes = (test) => {
          if (!test) return []
          const arr = Array.isArray(test) ? test : [ test ]

          return arr.map((t) => new RegExp(t, "i"))
        }
        const compiled = groupsConfig.map((g) => ({
          type: g && g.unmatched ? "unmatched" : "pattern",
          tests: g && g.unmatched ? [] : toRegexes(g && g.test),
          label: g && typeof g.label === "string" ? g.label : ""
        }))
        const hasExplicitUnmatched = compiled.some((c) => c.type === "unmatched")
        const matchGroupIndex = (node) => {
          const v = node.source && node.source.value
          if (typeof v !== "string") return -1
          for (let i = 0; i < compiled.length; i++) {
            const { tests, type } = compiled[i]
            if (type === "pattern" && tests.length && tests.some((rx) => rx.test(v))) return i
          }

          return -1
        }
        const blockText = (list, label, includeLabel) => {
          if (!list.length) return ""
          const txt = list.map((n) => sourceCode.getText(n).trim()).join("\n")

          return (includeLabel && label ? `// ${label}\n` : "") + txt
        }
        const joinWithBlankLines = (blocks) => {
          const sep = "\n".repeat(blankLines + 1)

          return blocks.filter(Boolean).join(sep) + "\n"
        }

        return {
          Program(program) {
            const body = program.body
            const firstNonImportIndex = body.findIndex((n) => n.type !== "ImportDeclaration")
            const imports = (firstNonImportIndex === -1 ? body : body.slice(0, firstNonImportIndex)).filter((n) => n.type === "ImportDeclaration")
            if (imports.length === 0) return
            const grouped = compiled.map(() => [])
            const rest = []
            for (const imp of imports) {
              const idx = matchGroupIndex(imp)
              if (idx === -1) rest.push(imp)
              else grouped[idx].push(imp)
            }
            const blocks = []
            const blockLabels = []
            if (compiled.length) {
              let firstBlockAdded = false
              for (let i = 0; i < compiled.length; i++) {
                const c = compiled[i]
                const isFirst = !firstBlockAdded
                const includeLabel = isFirst ? (c.type === "unmatched") : true
                if (c.type === "pattern") {
                  const txt = blockText(grouped[i], c.label, includeLabel)
                  if (txt) { blocks.push(txt); blockLabels.push(includeLabel ? c.label : ""); firstBlockAdded = true }
                } else {
                  const txt = blockText(rest, c.label, includeLabel)
                  if (txt) { blocks.push(txt); blockLabels.push(includeLabel ? c.label : ""); firstBlockAdded = true }
                }
              }
            } else {
              const txt = blockText(rest, "", false)
              if (txt) { blocks.push(txt); blockLabels.push("") }
            }
            if (!hasExplicitUnmatched) {
              const ordered = []
              const patternsTxt = compiled.map((_, i) => blockText(grouped[i], compiled[i].label, true)).filter(Boolean)
              const restTxt = blockText(rest, "", true)
              if (unmatchedPosition === "top") {
                if (restTxt) ordered.push(restTxt)
                ordered.push(...patternsTxt)
              } else {
                ordered.push(...patternsTxt)
                if (restTxt) ordered.push(restTxt)
              }
              if (ordered.length) {
                blocks.length = 0
                blocks.push(...ordered)
              }
            }
            const rebuilt = joinWithBlankLines(blocks)
            let start = imports[0].range[0]
            const end = imports[imports.length - 1].range[1]
            const allLabels = compiled.map(c => (c.label || "").trim()).filter(Boolean)
            if (allLabels.length) {
              const text = sourceCode.text
              const lookBehind = text.slice(Math.max(0, start - 5000), start)
              const escAlt = allLabels.map(l => l.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")
              const labelPattern = new RegExp(`(?:^|\n)(?://\s*(?:${escAlt})\s*\n)+$`)
              const m = lookBehind.match(labelPattern)
              if (m) {
                start = start - m[0].length
              }
            }
            const current = sourceCode.text.slice(start, end)
            const normalize = (s) => s.replace(/\r\n/g, "\n").replace(/\s+$/gm, "")
            if (normalize(current) !== normalize(rebuilt)) {
              context.report({ node: imports[0], messageId: "arrange", fix(fixer) { return fixer.replaceTextRange([ start, end ], rebuilt) } })
            }
          }
        }
      }
    }
  }
}
