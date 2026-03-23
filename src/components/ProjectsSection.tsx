import { useEffect, useRef, useState } from 'react'
import { Box, Flex, Text, Title } from '@mantine/core'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { palette } from '../theme'

gsap.registerPlugin(ScrollTrigger)

const projects = [
  {
    id: 1,
    category: 'Web Development',
    title: 'Synagogue for Jesus:\nDashboard and Landing Page',
    description: 'This project enhances the digital presence of Synagogue for Jesus by developing a centralized dashboard for managing and presenting data. It focuses on clean data formatting, printable and exportable outputs, and a public-facing interface that promotes transparency and community engagement. The system also includes a built-in blog and content management feature, allowing administrators to easily share updates while streamlining internal workflows.',
    techStack: ['React', 'TypeScript', 'Node.js', 'Express', 'MongoDB'],
    images: [
      '/assets/stsweng/stsweng1.png',
      '/assets/stsweng/stsweng2.png',
      '/assets/stsweng/stsweng3.png',
    ],
  },
  {
    id: 2,
    category: 'Workforce Management',
    title: 'SlipStream:\nAutomated HR System',
    description: 'SlipStream is a workforce management platform designed to automate employee record management and time slip processing. By centralizing HR workflows, such as attendance, payroll deductions, leave tracking, and pay slip distribution, it reduces manual work, minimizes errors, and streamlines HR operations.',
    techStack: ['React', 'TypeScript', 'Node.js', 'Express', 'MongoDB'],
    images: [
      '/assets/slipstream/slipstream1.png',
      '/assets/slipstream/slipstream2.jpeg',
      '/assets/slipstream/slipstream3.png',
      '/assets/slipstream/slipstream4.jpeg',
      '/assets/slipstream/slipstream5.png',
      '/assets/slipstream/slipstream6.png',
    ],
  },
  {
    id: 3,
    category: 'Web Development',
    title: 'Quiver:\nForum Application',
    description: 'Quiver is a web-based forum application developed for CCAPDEV (Web Application Development) course. The forum web application may be designed as a general-interest forum or one that is catered towards a specific interest group.',
    techStack: ['React', 'TypeScript', 'Node.js', 'Firebase',],
    images: [
      '/assets/quiver/quiver1.png',
      '/assets/quiver/quiver2.png',
      '/assets/quiver/quiver3.png',
      '/assets/quiver/quiver4.png',
      '/assets/quiver/quiver5.png',
      '/assets/quiver/quiver6.png',
      '/assets/quiver/quiver7.png',
      '/assets/quiver/quiver8.png',
    ],
  },
  {
    id: 4,
    category: 'Data Science',
    title: 'Student\nEmployability',
    description: 'This project focuses on analyzing and predicting trends using machine learning techniques. It involves data cleaning, exploratory data analysis, and the development of predictive models to uncover patterns and generate insights. Various algorithms, including Random Forest, were implemented and evaluated using appropriate performance metrics to ensure accuracy and reliability. Additionally, statistical analysis and model interpretability techniques were applied to better understand the factors influencing predictions. Overall, the project demonstrates the ability to transform raw data into meaningful insights through data-driven methodologies.',
    techStack: ['Python', 'Pandas', 'NumPy', 'Matplotlib', 'Seaborn', 'Google Colab / Jupyter'],
    images: [
      '/assets/studentemployability/studentemployability1.png',
      '/assets/studentemployability/studentemployability2.png',
      '/assets/studentemployability/studentemployability3.png',
      '/assets/studentemployability/studentemployability4.png',
      '/assets/studentemployability/studentemployability5.png',
    ],
  },
]

function ArrowRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  )
}

function ProjectCard({ project, index, onViewPhotos }: { project: typeof projects[0]; index: number; onViewPhotos: () => void }) {
  return (
    <Box
      className="project-card"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: palette.cardBg,
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        overflow: 'hidden',
        willChange: 'transform, opacity',
      }}
    >
      <Flex direction={{ base: 'column', md: 'row' }} align="stretch" h="100%">
        {/* Left Side - Details */}
        <Box
          style={{
            flex: 1,
            padding: '3rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <Text
            fz={12}
            fw={500}
            tt="uppercase"
            style={{ color: palette.textLight, letterSpacing: '0.1em', marginBottom: '0.75rem' }}
          >
            {project.category}
          </Text>

          <Title
            order={3}
            fz={{ base: 28, sm: 32, md: 40 }}
            fw={700}
            lh={1.15}
            style={{ color: palette.textLighter, marginBottom: '1.25rem', whiteSpace: 'pre-line' }}
          >
            {project.title}
          </Title>

          <Text
            fz={15}
            maw={400}
            style={{ color: palette.textLight, lineHeight: 1.7, marginBottom: '2rem' }}
          >
            {project.description}
          </Text>

          <Text fz={12} fw={600} tt="uppercase" style={{ color: palette.textLighter, letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
            Tech Stack
          </Text>
          <Flex gap="sm" wrap="wrap" mb="xl">
            {project.techStack.map((tech, i) => (
              <Box
                key={i}
                px="sm"
                py={4}
                style={{
                  background: palette.panel,
                  borderRadius: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <Text fz={12} fw={500} style={{ color: palette.textLighter }}>
                  {tech}
                </Text>
              </Box>
            ))}
          </Flex>

          {project.images && project.images.length > 0 && (
            <Flex 
              align="center" 
              gap="xs" 
              style={{ cursor: 'pointer', transition: 'transform 0.2s ease' }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
              onClick={onViewPhotos}
            >
              <Text fz={12} fw={600} tt="uppercase" style={{ color: palette.textLighter, letterSpacing: '0.1em' }}>
                View Photos
              </Text>
              <ArrowRightIcon />
            </Flex>
          )}
        </Box>

        {/* Right Side - Project Image */}
        <Box
          style={{
            flex: 1.4,
            position: 'relative',
            minHeight: '300px',
          }}
        >
          <Box
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `linear-gradient(135deg, ${palette.panel} 0%, ${palette.bg} 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            {project.images && project.images.length > 0 ? (
              <img
                src={project.images[0]}
                alt={project.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  padding: '1rem',
                  background: `linear-gradient(135deg, ${palette.panel} 0%, ${palette.bg} 100%)`,
                }}
              />
            ) : (
              <Text fz={20} fw={500} style={{ color: palette.textLight }}>
                Project {index + 1}
              </Text>
            )}
          </Box>
        </Box>
      </Flex>
    </Box>
  )
}

/**
 * Projects section with sticky stack animation.
 */
export function ProjectsSection() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentProject, setCurrentProject] = useState<typeof projects[0] | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const openLightbox = (project: typeof projects[0]) => {
    setCurrentProject(project)
    setCurrentImageIndex(0)
    setLightboxOpen(true)
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
    setCurrentProject(null)
    setCurrentImageIndex(0)
  }

  const goToPrev = () => {
    if (currentProject && currentProject.images) {
      setCurrentImageIndex((prev) => (prev === 0 ? currentProject.images!.length - 1 : prev - 1))
    }
  }

  const goToNext = () => {
    if (currentProject && currentProject.images) {
      setCurrentImageIndex((prev) => (prev === currentProject.images!.length - 1 ? 0 : prev + 1))
    }
  }

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    })

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    const cardElements = cardsRef.current.filter(Boolean) as HTMLDivElement[]

    if (cardElements.length === 0) return

    const totalCards = cardElements.length

    // Set initial positions - cards start further below viewport
    cardElements.forEach((card, i) => {
      const isFirst = i === 0
      const isLast = i === totalCards - 1
      const targetScale = isFirst || isLast ? 1 : 0.92
      
      gsap.set(card, {
        y: isFirst ? 0 : '150%',
        scale: targetScale,
        opacity: 1,
        filter: isFirst ? 'blur(0px)' : 'blur(0px)',
      })
    })

    // Create the main timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: wrapperRef.current,
        start: 'top top',
        end: `+=${(totalCards - 1) * 100}%`,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
      },
    })

    // Animate each card sequentially - previous cards blur and fade as next ones appear
    cardElements.forEach((card, i) => {
      const isFirst = i === 0
      const isLast = i === totalCards - 1
      const cardScale = isFirst || isLast ? 1 : 0.92

      if (isFirst) {
        // First card stays at full scale
        tl.to(
          card,
          {
            scale: cardScale,
            duration: 1,
            ease: 'power2.inOut',
          },
          i,
        )
      } else {
        const startTime = i - 1

        tl.to(
          card,
          {
            y: '0%',
            scale: cardScale,
            opacity: 1,
            filter: 'blur(0px)',
            duration: 1,
            ease: 'power2.inOut',
          },
          startTime,
        )

        // Previous card blurs and fades as new one comes in
        if (i > 0) {
          const prevCard = cardElements[i - 1]
          
          tl.to(
            prevCard,
            {
              scale: 0.88,
              opacity: 0.4,
              filter: 'blur(8px)',
              duration: 1,
              ease: 'power2.inOut',
            },
            startTime,
          )
        }
      }
    })

    lenis.on('scroll', ScrollTrigger.update)

    return () => {
      lenis.destroy()
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [])

  return (
    <Box
      component="section"
      id="projects"
      pos="relative"
      style={{
        background: 'transparent',
      }}
    >
      {/* Section Header */}
      <Box py="xl" px="2rem">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ margin: '-100px' }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <Title
            order={2}
            fz={{ base: 32, sm: 40, md: 48 }}
            fw={800}
            lh={1.1}
            tt="uppercase"
            style={{ color: palette.textLighter, letterSpacing: '-0.02em' }}
          >
            Projects
          </Title>
        </motion.div>
      </Box>

      {/* Stack Wrapper */}
      <Box
        ref={wrapperRef}
        style={{
          position: 'relative',
          height: '80vh',
          width: '100%',
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 2rem 2rem',
        }}
      >
        {projects.map((project, index) => (
          <Box
            key={project.id}
            ref={(el) => {cardsRef.current[index] = el}}
            style={{
              position: 'absolute',
              top: 0,
              left: '2rem',
              right: '2rem',
              bottom: 0,
              height: '100%',
            }}
          >
            <ProjectCard project={project} index={index} onViewPhotos={() => openLightbox(project)} />
          </Box>
        ))}
      </Box>

      {/* Image Lightbox */}
      <AnimatePresence>
        {lightboxOpen && currentProject && currentProject.images && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.9)',
              backdropFilter: 'blur(10px)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onClick={closeLightbox}
          >
            {/* Close button */}
            <Box
              onClick={closeLightbox}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.2)'; e.currentTarget.style.opacity = '1'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.opacity = '0.8'; }}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                cursor: 'pointer',
                color: 'white',
                fontSize: '24px',
                zIndex: 1002,
                transition: 'transform 0.2s ease, opacity 0.2s ease',
                opacity: '0.8',
              }}
            >
              ✕
            </Box>

            {/* Left Arrow - hide if on first image */}
            {currentProject.images.length > 1 && currentImageIndex > 0 && (
              <Box
                onClick={(e) => { e.stopPropagation(); goToPrev(); }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.2)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                style={{
                  position: 'absolute',
                  left: '20px',
                  cursor: 'pointer',
                  color: 'white',
                  fontSize: '40px',
                  zIndex: 1001,
                  padding: '20px',
                  borderRadius: '50%',
                  transition: 'transform 0.2s ease',
                }}
              >
                ←
              </Box>
            )}

            {/* Main Image */}
            <motion.img
              key={currentImageIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              src={currentProject.images[currentImageIndex]}
              alt={`${currentProject.title} - Image ${currentImageIndex + 1}`}
              style={{
                maxWidth: '80%',
                maxHeight: '80%',
                objectFit: 'contain',
                borderRadius: '8px',
                zIndex: 1001,
              }}
              onClick={(e) => e.stopPropagation()}
            />

            {/* Right Arrow - hide if on last image */}
            {currentProject.images.length > 1 && currentImageIndex < currentProject.images.length - 1 && (
              <Box
                onClick={(e) => { e.stopPropagation(); goToNext(); }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.2)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                style={{
                  position: 'absolute',
                  right: '20px',
                  cursor: 'pointer',
                  color: 'white',
                  fontSize: '40px',
                  zIndex: 1001,
                  padding: '20px',
                  borderRadius: '50%',
                  transition: 'transform 0.2s ease',
                }}
              >
                →
              </Box>
            )}

            {/* Image Counter */}
            <Box
              style={{
                position: 'absolute',
                bottom: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                color: 'white',
                fontSize: '14px',
                zIndex: 1001,
              }}
            >
              {currentImageIndex + 1} / {currentProject.images.length}
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  )
}
