import { profile } from '../content'
import { PlaneIcon } from './icons'

/** The first viewport: one profile coupon carrying only the name and credentials. */
export function WalletFront() {
  return (
    <section className="front" id="top" aria-labelledby="profile-name">
      <article className="coupon passenger" data-reveal="unfold">
        <header className="coupon-head">
          <span className="coupon-num" aria-hidden="true">1</span>
          <p className="coupon-title caps">
            <span>Profile</span>
            <span className="coupon-locator">
              GitHub <span className="carbon">{profile.handle}</span>
            </span>
          </p>
          <span className="coupon-tab caps">Portfolio</span>
        </header>

        <div className="passenger-body">
          <div className="passenger-main">
            <div className="passenger-id">
              <img className="passport" src={profile.photo} alt={`Portrait of ${profile.name}`} width={132} height={164} />
              <h1 id="profile-name" className="display passenger-name">
                <span>Dominic</span> <span>Gomez</span>
              </h1>
            </div>
            <p className="passenger-intro">{profile.intro}</p>
            <div className="actions">
              <a className="btn btn--primary" href="#projects">
                <PlaneIcon /> View projects
              </a>
              <a className="btn" href="#contact">Contact</a>
            </div>
          </div>

          <div className="perf perf--vertical" aria-hidden="true" />

          <dl className="fare-boxes passenger-stub">
            <div className="fare-box"><dt>Role</dt><dd>{profile.role}</dd></div>
            <div className="fare-box"><dt>Education</dt><dd>{profile.school}</dd></div>
            <div className="fare-box"><dt>Year level</dt><dd>{profile.year}</dd></div>
            <div className="fare-box"><dt>Location</dt><dd>{profile.base}</dd></div>
          </dl>
        </div>
      </article>
    </section>
  )
}
