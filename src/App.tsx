import { lazy, Suspense, useCallback, useRef, useState } from 'react'
import { ContactDesk } from './components/ContactDesk'
import { InFlight } from './components/InFlight'
import { LegSection } from './components/LegSection'
import { BaggageClaim } from './components/BaggageClaim'
import { Education } from './components/Education'
import { WalletFront } from './components/WalletFront'
import { WalletNav } from './components/WalletNav'
import { useSectionMotion } from './components/useSectionMotion'
import { profile, type LegId } from './content'
import './components/site.css'

// The demos carry their recorded runs, so they load in their own chunks after the first paint.
const RigragDemo = lazy(() => import('./demos/rigrag/RigragDemo'))
const FullcourtDemo = lazy(() => import('./demos/fullcourt/FullcourtDemo'))

type PerLeg<T> = Record<LegId, T>

function DemoLoading() {
  return <p className="demo-loading caps">Loading the interface…</p>
}

export default function App() {
  const [validated, setValidated] = useState<PerLeg<boolean>>({ rigrag: false, fullcourt: false })
  const [stage, setStage] = useState<PerLeg<number | null>>({ rigrag: null, fullcourt: null })
  const contactZone = useRef<HTMLDivElement>(null)
  useSectionMotion(contactZone)

  const onStage = useCallback((leg: LegId, index: number | null) => {
    setStage((current) => ({ ...current, [leg]: index }))
  }, [])

  const onComplete = useCallback((leg: LegId) => {
    setValidated((current) => ({ ...current, [leg]: true }))
  }, [])

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <WalletNav />
      <main className="wallet" id="main" tabIndex={-1}>
        <WalletFront />

        <Education />
        <BaggageClaim />
        <InFlight />

        <section className="projects" id="projects" aria-labelledby="projects-title">
          <header className="projects-head" data-reveal="wipe">
            <h2 className="display projects-title" id="projects-title">Projects</h2>
            <p className="projects-lede">
              Each project runs in its own interface below. Select an example request to see a recorded run move
              through the pipeline.
            </p>
          </header>

          <LegSection id="rigrag" number={5} stage={stage.rigrag} validated={validated.rigrag}>
            <Suspense fallback={<DemoLoading />}>
              <RigragDemo
                onStage={(index) => onStage('rigrag', index)}
                onComplete={() => onComplete('rigrag')}
              />
            </Suspense>
          </LegSection>

          <LegSection id="fullcourt" number={6} stage={stage.fullcourt} validated={validated.fullcourt}>
            <Suspense fallback={<DemoLoading />}>
              <FullcourtDemo
                onStage={(index) => onStage('fullcourt', index)}
                onComplete={() => onComplete('fullcourt')}
              />
            </Suspense>
          </LegSection>
        </section>

        {/* The contact details sit on bare ticket stock that an arch lifts out of the navy as it scrolls in. */}
        <div className="contact-zone" ref={contactZone}>
          <div className="contact-arch" aria-hidden="true" />
          <ContactDesk />
          <footer className="site-footer">
            <p>
              {profile.fullName}, {new Date().getFullYear()}. The demos replay runs recorded from the{' '}
              <a href="https://github.com/djmgmz/RigRAG" target="_blank" rel="noreferrer">RigRAG</a> and{' '}
              <a href="https://github.com/djmgmz/FullCourt" target="_blank" rel="noreferrer">FullCourt</a> repositories.
            </p>
          </footer>
        </div>
      </main>
    </>
  )
}
