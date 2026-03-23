import { Box, Container, Group, Text, Title } from '@mantine/core'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { palette } from '../theme'
import dlsuLogo from '../assets/dlsulogo.png'

/** Transparent background to show Vanta effect */
const educationBackground = 'transparent'

interface EducationItem {
  school: string
  degree?: string
  major?: string
  minor?: string
  details?: string
  year: string
}

const educationData: EducationItem[] = [
  {
    school: 'De La Salle University Manila',
    degree: 'Bachelor of Science in Computer Science',
    major: 'Software Technology',
    minor: 'Data Science',
    year: '2022 - Present',
  },
  {
    school: 'De La Salle University Manila - Senior High School',
    details: 'STEM Strand - Bronze General Excellence Award',
    year: '2020 - 2022',
  },
]

const lineVariants = {
  hidden: {
    scaleY: 0,
    originY: 0,
  },
  visible: {
    scaleY: 1,
    transition: {
      duration: 1.2,
      ease: 'easeInOut' as const,
      delay: 0.2,
    },
  },
}

/**
 * Education timeline section with left-aligned title and left-side timeline line.
 * Transitions from the orange AboutMe section with a gradient fade.
 */
export function EducationSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const lineScale = useTransform(scrollYProgress, [0.1, 0.6], [0, 1])

  // Calculate scroll ranges for each item (2 items) - moved further down
  const item1Progress = useTransform(scrollYProgress, [0.325, 0.345], [0, 1])
  const item2Progress = useTransform(scrollYProgress, [0.512, 0.532], [0, 1])
  const itemProgresses = [item1Progress, item2Progress]
  return (
    <Box
      ref={sectionRef}
      component="section"
      id="education"
      py={{ base: 120, sm: 160 }}
      style={{
        scrollMarginBottom: '6.5rem',
        position: 'relative',
        minHeight: '100vh',
      }}
    >
      {/* Background with integrated orange fade at top */}
      <Box
        pos="absolute"
        inset={0}
        style={{
          zIndex: 0,
          background: educationBackground,
          pointerEvents: 'none',
        }}
      />

      {/* Section Title - Left aligned like About Me, Projects, Skills */}
      <Box px="2rem" mb={48}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ margin: '-100px' }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <Title
            order={2}
            tt="uppercase"
            fz={{ base: 32, sm: 40, md: 48 }}
            fw={800}
            lh={1.1}
            style={{
              color: palette.textLighter,
              letterSpacing: '-0.02em',
            }}
          >
            Education
          </Title>
        </motion.div>
      </Box>

      <Container size="lg" style={{ position: 'relative', zIndex: 1 }}>

        {/* Timeline Container with left-aligned line */}
        <Box
          style={{
            position: 'relative',
            paddingLeft: '40px',
            minHeight: 500,
          }}
        >
          {/* Vertical Line - Scroll-linked animation */}
          <motion.div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: 3,
              background: `linear-gradient(180deg, ${palette.orangeGradientStart} 0%, ${palette.orangeGradientEnd} 100%)`,
              borderRadius: 2,
              boxShadow: `0 0 20px ${palette.orangeGradientStart}40, 0 0 40px ${palette.orangeGradientEnd}20`,
              scaleY: lineScale,
              originY: 0,
            }}
          />

          {/* Education Items - Stacked vertically on the right of the line */}
          <Box style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
            {educationData.map((item, index) => {
              const itemProgress = itemProgresses[index]
              const itemOpacity = useTransform(itemProgress, [0, 1], [0, 1])
              const itemY = useTransform(itemProgress, [0, 1], [-30, 0])
              return (
              <Box
                key={item.school}
                style={{
                  position: 'relative',
                  width: '100%',
                  maxWidth: '600px',
                  marginTop: index === 0 ? '200px' : 0,
                }}
              >
                <motion.div
                  style={{
                    opacity: itemOpacity,
                    y: itemY,
                  }}
                >
                  {/* Card */}
                  <Box
                    p={24}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: 12,
                      border: `1px solid rgba(255, 255, 255, 0.1)`,
                      boxShadow: '0 4px 30px rgba(0, 0, 0, 0.2)',
                      position: 'relative',
                      textAlign: 'left',
                    }}
                  >
                    {/* Dot on the timeline */}
                    <Box
                      style={{
                        position: 'absolute',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        left: '-46px',
                        width: 14,
                        height: 14,
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, ${palette.orangeGradientStart} 0%, ${palette.orangeGradientEnd} 100%)`,
                        boxShadow: `0 0 10px ${palette.orangeGradientStart}, 0 0 20px ${palette.orangeGradientEnd}`,
                        zIndex: 2,
                      }}
                    />

                    <Group gap="sm" mb={12} style={{ justifyContent: 'flex-start' }}>
                      <Box
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          background: '#ffffff',
                          border: '2px solid #000000',
                          padding: 4,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <img
                          src={dlsuLogo}
                          alt="DLSU Logo"
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                            borderRadius: '50%',
                          }}
                        />
                      </Box>

                      <Text
                        tt="uppercase"
                        fz={{ base: 14, sm: 16 }}
                        fw={700}
                        style={{
                          color: palette.orangeBright,
                          letterSpacing: '0.04em',
                        }}
                      >
                        {item.year}
                      </Text>
                    </Group>

                    <Title
                      order={3}
                      fz={{ base: 18, sm: 22 }}
                      fw={700}
                      mb={8}
                      style={{ color: palette.textLighter }}
                    >
                      {item.school}
                    </Title>

                    {item.degree && (
                      <Text
                        fz={{ base: 14, sm: 16 }}
                        fw={600}
                        mb={12}
                        style={{ color: palette.textLight }}
                      >
                        {item.degree}
                      </Text>
                    )}

                    <Box
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: 8,
                        flexWrap: 'wrap',
                        justifyContent: 'flex-start',
                      }}
                    >
                      {item.major && (
                        <Box
                          px={12}
                          py={6}
                          style={{
                            background: `linear-gradient(135deg, ${palette.orangeGradientStart}20 0%, ${palette.orangeGradientEnd}20 100%)`,
                            border: `1px solid ${palette.orangeGradientStart}60`,
                            borderRadius: 20,
                          }}
                        >
                          <Text
                            fz={12}
                            fw={700}
                            tt="uppercase"
                            style={{ color: palette.orangeBright }}
                          >
                            Major: {item.major}
                          </Text>
                        </Box>
                      )}

                      {item.minor && (
                        <Box
                          px={12}
                          py={6}
                          style={{
                            background: 'rgba(255, 255, 255, 0.08)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            borderRadius: 20,
                          }}
                        >
                          <Text
                            fz={12}
                            fw={600}
                            tt="uppercase"
                            style={{ color: palette.textLight }}
                          >
                            Minor: {item.minor}
                          </Text>
                        </Box>
                      )}
                    </Box>

                    {item.details && (
                      <Text
                        fz={{ base: 14, sm: 16 }}
                        mt={item.degree || item.major || item.minor ? 12 : 0}
                        style={{ color: palette.textLight }}
                      >
                        {item.details}
                      </Text>
                    )}
                  </Box>
                </motion.div>
              </Box>
            )})}
          </Box>
        </Box>
      </Container>
    </Box>
  )
}
