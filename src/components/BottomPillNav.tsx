import { Anchor, Box, Button } from '@mantine/core'
import { motion } from 'framer-motion'
import { palette } from '../theme'

function IconHome({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8h5z"
        fill="currentColor"
      />
    </svg>
  )
}

const linkBase = {
  color: palette.textLighter,
  fontSize: 13,
  fontWeight: 500,
  whiteSpace: 'nowrap' as const,
  textDecoration: 'none',
  opacity: 0.9,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: 0,
}

export function BottomPillNav() {
  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <Box
        component="nav"
        aria-label="Main"
        style={{
          position: 'fixed',
          bottom: 'max(0.75rem, env(safe-area-inset-bottom, 0px))',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 200,
          width: 'auto',
          minWidth: 'min(600px, calc(100% - 1rem))',
          maxWidth: 'calc(100% - 1rem)',
          borderRadius: 9999,
          backgroundColor: palette.bgDeep,
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow:
            '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.04)',
          padding: '8px 8px 8px 10px',
        }}
      >
        <Box
          style={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            gap: 6,
          }}
        >
          <Box
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              minWidth: 0,
              gap: 2,
            }}
            className="bottom-pill-nav-scroll"
          >
            <Anchor
              href="#hero"
              aria-label="Home"
              underline="never"
              style={{
                ...linkBase,
                flex: '0 0 auto',
                padding: '4px 6px',
                opacity: 1,
              }}
              styles={{
                root: {
                  '&:hover': { opacity: 0.75 },
                },
              }}
            >
              <IconHome />
            </Anchor>
            <Anchor
              href="#about"
              underline="never"
              style={{ ...linkBase, flex: '1 1 0', padding: '4px 8px' }}
              styles={{ root: { '&:hover': { opacity: 0.75 } } }}
            >
              About
            </Anchor>
            <Anchor
              href="#education"
              underline="never"
              style={{ ...linkBase, flex: '1 1 0', padding: '4px 8px' }}
              styles={{ root: { '&:hover': { opacity: 0.75 } } }}
            >
              Education
            </Anchor>
            <Anchor
              href="#skills"
              underline="never"
              style={{ ...linkBase, flex: '1 1 0', padding: '4px 8px' }}
              styles={{ root: { '&:hover': { opacity: 0.75 } } }}
            >
              Skills
            </Anchor>
            <Anchor
              href="#projects"
              underline="never"
              style={{ ...linkBase, flex: '1 1 0', padding: '4px 8px' }}
              styles={{ root: { '&:hover': { opacity: 0.75 } } }}
            >
              Projects
            </Anchor>
          </Box>

          <Button
            component="a"
            href="#contact"
            radius={9999}
            size="xs"
            fz="sm"
            fw={600}
            px="sm"
            style={{
              flexShrink: 0,
              backgroundColor: palette.primary,
              color: '#ffffff',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
            }}
            styles={{
              root: {
                '&:hover': {
                  backgroundColor: palette.panel,
                },
              },
            }}
          >
            Contact
          </Button>
        </Box>
      </Box>
    </motion.div>
  )
}
