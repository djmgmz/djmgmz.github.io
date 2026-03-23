import {
  Box,
  Button,
  Container,
  Group,
  Stack,
  Text,
  Title,
} from '@mantine/core'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import cv from '../assets/GOMEZ,DominicJoel_CV.pdf'
import { palette } from '../theme'

/** Transparent background to show Vanta effect */
const heroBackground = 'transparent'

const fullText = 'Java and React Developer'

function TypingText() {
  const [displayText, setDisplayText] = useState('')
  const [showCursor, setShowCursor] = useState(true)

  useEffect(() => {
    let currentIndex = 0
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setDisplayText(fullText.slice(0, currentIndex))
        currentIndex++
      } else {
        clearInterval(typingInterval)
      }
    }, 100)

    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev)
    }, 530)

    return () => {
      clearInterval(typingInterval)
      clearInterval(cursorInterval)
    }
  }, [])

  return (
    <span>
      {displayText}
      <motion.span
        animate={{ opacity: showCursor ? 1 : 0 }}
        transition={{ duration: 0 }}
        style={{
          borderRight: `3px solid ${palette.textLighter}`,
          marginLeft: '8px',
        }}
      >
        {' '}
      </motion.span>
    </span>
  )
}

export function HeroSection() {
  return (
    <Box
      component="header"
      id="hero"
      pos="relative"
      style={{
        isolation: 'isolate',
        scrollMarginBottom: '6.5rem',
        zIndex: 1,
        minHeight: '105vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <Box
        aria-hidden
        pos="absolute"
        inset={0}
        style={{
          zIndex: 0,
          background: heroBackground,
          pointerEvents: 'none',
        }}
      />

      <Container
        pos="relative"
        size="lg"
        style={{ zIndex: 2 }}
      >
        <Stack align="center" gap="lg" ta="center">
          <Text
            size="lg"
            c="dark.2"
          >
            Hello, I&apos;m Dominic Gomez. A passionate Computer Scientist.
          </Text>

          <Title
            order={1}
            fz={{ base: 40, sm: 56, md: 72 }}
            lh={1.1}
            fw={800}
            c="dark.0"
          >
            <span style={{ color: palette.textLighter }}>
              <TypingText />
            </span>
          </Title>

          <Group gap="md" mt="xl">
            <Button
              component="a"
              href={cv}
              download
              size="md"
              radius="sm"
              fw={600}
              variant="filled"
              c="dark.9"
              bg="#ffffff"
              styles={{
                root: {
                  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.25)',
                  '&:hover': {
                    backgroundColor: '#f0f0f0',
                  },
                },
              }}
            >
              Download CV
            </Button>
            <Button
              component="a"
              href="#contact"
              size="md"
              radius="sm"
              fw={600}
              variant="filled"
              c="#ffffff"
              bg="rgba(255, 255, 255, 0.1)"
              styles={{
                root:{
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  backdropFilter: 'blur(10px)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  },
                },
              }}
            >
              Contact Me
            </Button>
          </Group>
        </Stack>
      </Container>
    </Box>
  )
}
