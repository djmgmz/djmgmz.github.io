import { Fragment, type ReactNode } from 'react'

// The real app renders replies with react-markdown. The recorded replies only use paragraphs,
// hard line breaks, bullet lists, bold, italics and links, so this covers exactly that.

const INLINE = /(\*\*[^*]+\*\*|\*[^*\s][^*]*\*|\[[^\]]+\]\([^)\s]+\))/g

function inline(text: string): ReactNode[] {
  return text.split(INLINE).map((token, i) => {
    if (token.startsWith('**') && token.endsWith('**')) return <strong key={i}>{token.slice(2, -2)}</strong>
    if (token.startsWith('[')) {
      const match = /^\[([^\]]+)\]\(([^)\s]+)\)$/.exec(token)
      if (match) {
        return (
          <a key={i} href={match[2]} target="_blank" rel="noreferrer">
            {match[1]}
          </a>
        )
      }
    }
    if (token.length > 2 && token.startsWith('*') && token.endsWith('*')) return <em key={i}>{token.slice(1, -1)}</em>
    return <Fragment key={i}>{token}</Fragment>
  })
}

function lines(block: string): ReactNode[] {
  return block.split('\n').map((line, i, all) => (
    <Fragment key={i}>
      {inline(line.trimEnd())}
      {i < all.length - 1 && <br />}
    </Fragment>
  ))
}

const LIST_ITEM = /^\s*[-*] /

/** Splits a block into runs of list rows and runs of text rows, since a bold label often sits directly above its list. */
function groups(block: string): { list: boolean; rows: string[] }[] {
  const out: { list: boolean; rows: string[] }[] = []
  for (const row of block.split('\n')) {
    const list = LIST_ITEM.test(row)
    const last = out[out.length - 1]
    if (last && last.list === list) last.rows.push(row)
    else out.push({ list, rows: [row] })
  }
  return out
}

/** Renders a recorded reply's Markdown subset as React elements. */
export function Markdown({ source }: { source: string }) {
  const blocks = source.trim().split(/\n{2,}/)
  return (
    <>
      {blocks.flatMap((block, i) =>
        groups(block).map((group, j) =>
          group.list ? (
            <ul key={`${i}-${j}`}>
              {group.rows.map((row, k) => <li key={k}>{inline(row.replace(LIST_ITEM, '').trimEnd())}</li>)}
            </ul>
          ) : (
            <p key={`${i}-${j}`}>{lines(group.rows.join('\n'))}</p>
          ),
        ),
      )}
    </>
  )
}
