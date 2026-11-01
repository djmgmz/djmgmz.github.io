import { faq } from '../content'

/** Questions a recruiter is likely to have, the first one open. */
export function Faq() {
  return (
    <section className="band" id="faq" aria-labelledby="faq-title">
      <div className="faq">
        <h2 className="display section-title" id="faq-title" data-reveal>Common questions</h2>
        <div data-reveal>
          {faq.map((item, index) => (
            <details key={item.q} open={index === 0}>
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
