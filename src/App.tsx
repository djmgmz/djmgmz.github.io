import { lazy, Suspense, useCallback, useState } from 'react'
import { About } from './components/About'
import { Contact } from './components/Contact'
import { Faq } from './components/Faq'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Interests } from './components/Interests'
import { ProjectCard } from './components/ProjectCard'
import { navVariant } from './components/navVariant'
import { SideNav } from './components/SideNav'
import { Skills } from './components/Skills'
import { useReveal } from './components/useReveal'
import { profile, type ProjectId } from './content'
import './components/site.css'

// The demos carry their recorded runs, so they load in their own chunks after the first paint.
const RigragDemo = lazy(() => import('./demos/rigrag/RigragDemo'))
const FullcourtDemo = lazy(() => import('./demos/fullcourt/FullcourtDemo'))
const WfmDemo = lazy(() => import('./demos/wfm/WfmDemo'))

function DemoLoading() {
  return <p className="demo-loading">Loading the interface…</p>
}

/** The page, in the order a recruiter reads it: who, the work, the person, then how to reach him. */
export default function App() {
  const [stage, setStage] = useState<Record<ProjectId, number | null>>({ rigrag: null, fullcourt: null, wfm: null })
  const [variant] = useState(navVariant)
  useReveal()

  const onStage = useCallback((id: ProjectId, index: number | null) => {
    setStage((current) => ({ ...current, [id]: index }))
  }, [])

  // A finished run leaves every step lit, which is all the page needs to show.
  const onComplete = useCallback(() => {}, [])

  return (
    <div className={`frame frame--nav-${variant}`}>
      <a className="skip-link" href="#main">Skip to content</a>
      <SideNav variant={variant} />
      <Header />
      <main id="main" tabIndex={-1}>
        <Hero />
        <About />

        <section className="band" id="projects" aria-labelledby="projects-title">
          <div className="section-head">
            <h2 className="display section-title" id="projects-title" data-reveal>Projects</h2>
            <p data-reveal>Each one runs in your browser using real responses recorded from its backend. Pick an example to see it work.</p>
          </div>
          <div className="cards">
            <ProjectCard id="rigrag" stage={stage.rigrag}>
              <Suspense fallback={<DemoLoading />}>
                <RigragDemo onStage={(index) => onStage('rigrag', index)} onComplete={onComplete} />
              </Suspense>
            </ProjectCard>
            <ProjectCard id="fullcourt" stage={stage.fullcourt}>
              <Suspense fallback={<DemoLoading />}>
                <FullcourtDemo onStage={(index) => onStage('fullcourt', index)} onComplete={onComplete} />
              </Suspense>
            </ProjectCard>
            <ProjectCard id="wfm" stage={stage.wfm}>
              <Suspense fallback={<DemoLoading />}>
                <WfmDemo onStage={(index) => onStage('wfm', index)} onComplete={onComplete} />
              </Suspense>
            </ProjectCard>
          </div>
        </section>

        <Skills />
        <Interests />
        <Faq />
        <Contact />
      </main>
      <footer className="site-footer">
        <span><b>{profile.fullName}</b>, {new Date().getFullYear()}</span>
        <span>The demos replay runs recorded from each project’s own backend.</span>
      </footer>
    </div>
  )
}
