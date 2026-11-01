import { playlists } from '../content'
import { Bubbles } from './Bubbles'

/** The playlists beside the hobby bubbles. */
export function Interests() {
  return (
    <section className="band" id="interests" aria-labelledby="interests-title">
      <div className="section-head">
        <h2 className="display section-title" id="interests-title" data-reveal>Outside of coding</h2>
        <p data-reveal>Some playlists I listen to while working, and a few things I’m into.</p>
      </div>
      <div className="interests">
        <div className="panel playlists" data-reveal>
          <h3>Playlists</h3>
          <ul>
            {playlists.map((playlist) => (
              <li key={playlist.name}>
                <a href={playlist.url} target="_blank" rel="noreferrer">
                  <img src={playlist.image} alt="" width={240} height={240} loading="lazy" />
                  <span className="playlist-name">{playlist.name}</span>
                  <span className="playlist-where">Spotify<span className="visually-hidden"> playlist (opens in a new tab)</span></span>
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="panel hobbies" data-reveal>
          <h3>Interests</h3>
          <p>You can drag these around.</p>
          <Bubbles />
        </div>
      </div>
    </section>
  )
}
