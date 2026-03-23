import { Box, Flex, Text, Title } from '@mantine/core'
import { motion } from 'framer-motion'
import { palette } from '../theme'

const skills = [
  { name: 'React', color: '#61DAFB', logo: '/src/assets/skills/react.png' },
  { name: 'TypeScript', color: '#3178C6', logo: '/src/assets/skills/typescript.png' },
  { name: 'JavaScript', color: '#F7DF1E', logo: '/src/assets/skills/javascript.png' },
  { name: 'Node.js', color: '#339933', logo: '/src/assets/skills/nodejs.png' },
  { name: 'Express.js', color: '#000000', logo: '/src/assets/skills/expressjs.webp' },
  { name: 'MongoDB', color: '#47A248', logo: '/src/assets/skills/mongodb.png' },
  { name: 'Firebase', color: '#FFCA28', logo: '/src/assets/skills/firebase.png' },
  { name: 'AWS', color: '#FF9900', logo: '/src/assets/skills/aws.jpg' },
  { name: 'SQL', color: '#336791', logo: '/src/assets/skills/sql.png' },
  { name: 'Java', color: '#007396', logo: '/src/assets/skills/java.png' },
  { name: 'Python', color: '#3776AB', logo: '/src/assets/skills/python.png' },
  { name: 'C', color: '#A8B9CC', logo: '/src/assets/skills/clanguage.png' },
  { name: 'HTML5', color: '#E34F26', logo: '/src/assets/skills/html5.png' },
  { name: 'CSS3', color: '#1572B6', logo: '/src/assets/skills/css.png' },
  { name: 'Git', color: '#F05032', logo: '/src/assets/skills/github.png' },
  { name: 'Next.js', color: '#ffffff', logo: '/src/assets/skills/nextjs.png' },
  { name: 'Figma', color: '#F24E1E', logo: '/src/assets/skills/figma.png' },
  { name: 'Jupyter', color: '#F37626', logo: '/src/assets/skills/jupyter.png' },
]

function SkillCard({ skill, index }: { skill: typeof skills[0]; index: number }) {
  return (
    <Box
      style={{
        position: 'relative',
        width: '280px',
        height: '180px',
        borderRadius: '20px',
        overflow: 'hidden',
        flexShrink: 0,
        background: `linear-gradient(135deg, ${palette.panel} 0%, ${palette.bgDeep} 100%)`,
        border: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Background Gradient */}
      <Box
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(135deg, ${skill.color}40 0%, ${skill.color}15 100%)`,
        }}
      />
      
      {/* Top Image Area - Takes up most of the card */}
      <Flex
        align="center"
        justify="center"
        style={{
          flex: 1,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Box
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '16px',
            background: '#ffffff',
            boxShadow: `0 8px 32px ${skill.color}50`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '12px',
            overflow: 'hidden',
          }}
        >
          <img
            src={skill.logo}
            alt={skill.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
            }}
          />
        </Box>
      </Flex>

      {/* Bottom Name Area - Centered */}
      <Box
        style={{
          position: 'relative',
          zIndex: 1,
          padding: '0 16px 16px',
          textAlign: 'center',
        }}
      >
        <Text fz={18} fw={700} style={{ color: palette.textLighter }}>
          {skill.name}
        </Text>
      </Box>

      {/* Index Number Watermark */}
      <Text
        fz={100}
        fw={800}
        style={{
          position: 'absolute',
          right: '5px',
          top: '5px',
          color: 'rgba(255, 255, 255, 0.03)',
          lineHeight: 1,
          zIndex: 0,
        }}
      >
        {String(index + 1).padStart(2, '0')}
      </Text>
    </Box>
  )
}

function InfiniteRow({ items, direction = 'left', duration = 40 }: { items: typeof skills; direction?: 'left' | 'right'; duration?: number }) {
  const duplicatedItems = [...items, ...items, ...items]

  return (
    <Box
      style={{
        overflow: 'hidden',
        width: '100%',
        maskImage: 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)',
      }}
    >
      <Flex
        gap="lg"
        style={{
          animation: `scroll-${direction} ${duration}s linear infinite`,
          width: 'fit-content',
        }}
        className="skill-scroll"
      >
        {duplicatedItems.map((skill, index) => (
          <SkillCard key={`${skill.name}-${index}`} skill={skill} index={index % items.length} />
        ))}
      </Flex>
    </Box>
  )
}

/**
 * Skills section with infinite horizontal scrolling image cards.
 */
export function SkillsSection() {
  const topRow = skills.slice(0, 9)
  const bottomRow = skills.slice(9)

  return (
    <Box
      component="section"
      id="skills"
      pos="relative"
      py="6rem"
      style={{
        background: 'transparent',
        scrollMarginBottom: '6.5rem',
      }}
    >
      <style>{`
        @keyframes scroll-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        @keyframes scroll-right {
          0% { transform: translateX(-33.333%); }
          100% { transform: translateX(0); }
        }
      `}</style>

      <Box px="2rem" mb="xl">
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
            Skills
          </Title>
        </motion.div>
      </Box>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ margin: '-100px' }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1], delay: 0.2 }}
      >
        <Flex direction="column" gap="lg" py="xl">
          <InfiniteRow items={topRow} direction="left" duration={50} />
          <InfiniteRow items={bottomRow} direction="right" duration={55} />
        </Flex>
      </motion.div>
    </Box>
  )
}
