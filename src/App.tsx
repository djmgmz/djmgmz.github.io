import { Box } from '@mantine/core'
import { HeroSection } from './components/HeroSection'
import { AboutMeSection } from './components/AboutMeSection'
import { EducationSection } from './components/EducationSection'
import { SkillsSection } from './components/SkillsSection'
import { ProjectsSection } from './components/ProjectsSection'
import { ContactSection } from './components/ContactSection'
import { BottomPillNav } from './components/BottomPillNav'
import { Background } from './components/Background'
import { CursorFollower } from './components/CursorFollower'

function App() {
  return (
    <>
      <Background />
      <CursorFollower active={true} />
      <Box component="main" pos="relative" style={{ zIndex: 1 }}>
        <HeroSection />
        <AboutMeSection />
        <EducationSection />
        <SkillsSection />
        <ProjectsSection />
        <ContactSection />
      </Box>
      {/* Bottom blur overlay */}
      <Box
        pos="fixed"
        bottom={0}
        left={0}
        right={0}
        h={60}
        style={{
          zIndex: 5,
          pointerEvents: 'none',
          background: 'rgba(0, 0, 0, 0.2)',
          backdropFilter: 'blur(6px)',
          WebkitMaskImage: 'linear-gradient(to top, black 0%, black 50%, transparent 100%)',
          maskImage: 'linear-gradient(to top, black 0%, black 50%, transparent 100%)',
        }}
      />
      <BottomPillNav />
    </>
  )
}

export default App
