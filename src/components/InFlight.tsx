import { playlists } from '../content'
import { LuggageTags } from './LuggageTags'

/** Interests outside work, printed on the lavender carbon copy that rides behind the coupons. */
export function InFlight() {
  // The observed wrapper stays unclipped: a fully clipped element never registers as visible.
  return (
    <div data-reveal="slip">
      <section className="carbon-slip" id="interests" aria-labelledby="interests-title">
        <header className="coupon-head">
          <span className="coupon-num" aria-hidden="true">4</span>
          <h2 className="coupon-title caps" id="interests-title">Interests</h2>
          <span className="coupon-tab caps">Outside work</span>
        </header>
        <div className="slip-body">
          <div className="slip-panel">
            <h3 className="display slip-title">Music</h3>
            <p className="slip-lede">Playlists I listen to while working.</p>
            <ol className="channels">
              {playlists.map((playlist, index) => (
                <li key={playlist.name}>
                  <a className="channel" href={playlist.url} target="_blank" rel="noreferrer">
                    <img src={playlist.image} alt="" width={120} height={120} loading="lazy" />
                    <span className="channel-num caps">Playlist {index + 1}</span>
                    <span className="channel-name">{playlist.name}</span>
                    <span className="visually-hidden"> on Spotify (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ol>
          </div>
          <div className="slip-panel">
            <h3 className="display slip-title">Hobbies</h3>
            <p className="slip-lede">Interests outside of software. Each one can be dragged.</p>
            <LuggageTags />
          </div>
        </div>
      </section>
    </div>
  )
}
