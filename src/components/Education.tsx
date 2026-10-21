import { itinerary } from '../content'

/** Education as a single coupon: each program is an entry with its dates and status. */
export function Education() {
  return (
    <section className="coupon education" data-reveal="rise" id="education" aria-labelledby="education-title">
      <header className="coupon-head">
        <span className="coupon-num" aria-hidden="true">2</span>
        <h2 className="coupon-title caps" id="education-title">Education</h2>
        <span className="coupon-tab caps">2020 to present</span>
      </header>
      <ol className="itinerary">
        {itinerary.map((item) => (
          <li key={item.leg} className="itinerary-leg">
            <span className="itinerary-num carbon">{item.leg}</span>
            <div className="itinerary-route">
              <p className="itinerary-from">{item.from}</p>
              <p className="display itinerary-to">{item.to}</p>
              <p className="itinerary-note">{item.note}</p>
            </div>
            <div className="itinerary-meta">
              <p className="carbon">{item.dates}</p>
              <p className="leg-status caps" data-live={item.status.startsWith('In progress') || undefined}>{item.status}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
