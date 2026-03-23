import { useEffect, useRef, useState } from 'react'
import { Anchor, Box, Button, Container, Flex, SimpleGrid, Stack, Text, Textarea, TextInput, Title } from '@mantine/core'
import linkedinIcon from '../assets/linkedin-svgrepo-com.svg'
import githubIcon from '../assets/github-svgrepo-com.svg'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Contact section with animated curved divider on scroll.
 */
export function ContactSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const curveRef = useRef<HTMLDivElement>(null)
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [fromEmail, setFromEmail] = useState('')

  const handleSendEmail = () => {
    const bodyWithFrom = `From: ${fromEmail}\n\n${message}`
    const mailtoLink = `mailto:gomez.dominic.joel@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyWithFrom)}`
    window.location.href = mailtoLink
  }

  useEffect(() => {
    if (!sectionRef.current || !curveRef.current) return

    const curve = curveRef.current

    // Set initial flat state
    gsap.set(curve, {
      borderRadius: '0%',
      height: '0px',
    })

    // Animate to curved as you scroll
    gsap.to(curve, {
      borderRadius: '50% 50% 0 0 / 100% 100% 0 0',
      height: '200px',
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 70%',
        end: 'bottom bottom',
        scrub: 0.5,
      },
    })

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [])

  return (
    <>
      <Box
        ref={sectionRef}
        component="section"
        py={{ base: 56, sm: 72 }}
        pb={{ base: 100, sm: 140 }}
        style={{
          background: 'transparent',
          position: 'relative',
        }}
      >
        <Container size="lg">
          <Stack gap="xl">
            {/* Empty space where contact was */}
            <Box style={{ minHeight: '200px' }} />
          </Stack>
        </Container>

        {/* Animated Curved Divider */}
        <Box
          ref={curveRef}
          style={{
            position: 'absolute',
            bottom: '0',
            left: '-10%',
            right: '-10%',
            background: '#ffffff',
            zIndex: 2,
            transformOrigin: 'center bottom',
          }}
        />
      </Box>

      {/* White section below the curve */}
      <Box
        style={{
          background: '#ffffff',
          minHeight: '50vh',
          position: 'relative',
          zIndex: 1,
          padding: '60px 0',
          marginLeft: '-100vw',
          marginRight: '-100vw',
          paddingLeft: '100vw',
          paddingRight: '100vw',
          marginBottom: '-100px',
          paddingBottom: '100px',
        }}
      >
        <Container size="lg">
          <SimpleGrid
            cols={{ base: 1, sm: 2 }}
            spacing="xl"
            id="contact"
            style={{ scrollMarginBottom: '6.5rem' }}
          >
            {/* Left Column - Contact Info */}
            <Stack gap="md">
              <Text size="sm" fw={700} tt="uppercase" c="dark.8" lts={2}>
                Contact
              </Text>
              <Title order={2} c="dark.9" fz={{ base: 26, sm: 32 }}>
                Let&apos;s talk
              </Title>

              {/* Email */}
              <Anchor
                href="mailto:gomez.dominic.joel@gmail.com"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  textDecoration: 'none',
                  transition: 'transform 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.02)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)'
                }}
              >
                <Box
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '48px',
                    height: '48px',
                  }}
                >
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2">
                    <rect x="2" y="5" width="20" height="14" rx="2" />
                    <polyline points="2,5 12,13 22,5" />
                  </svg>
                </Box>
                <Text fz={14} fw={500} style={{ color: '#333' }}>
                  gomez.dominic.joel@gmail.com
                </Text>
              </Anchor>

              <Flex gap="md">
                <Anchor
                  href="https://www.linkedin.com/in/dominic-joel-gomez-379220265"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: '#0A66C2',
                    transition: 'transform 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.1)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)'
                  }}
                >
                  <img
                    src={linkedinIcon}
                    alt="LinkedIn"
                    style={{ width: '24px', height: '24px', filter: 'brightness(0) invert(1)' }}
                  />
                </Anchor>
                <Anchor
                  href="https://github.com/djmgmz"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: '#333',
                    transition: 'transform 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.1)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)'
                  }}
                >
                  <img
                    src={githubIcon}
                    alt="GitHub"
                    style={{ width: '24px', height: '24px', filter: 'brightness(0) invert(1)' }}
                  />
                </Anchor>
              </Flex>
            </Stack>

            {/* Right Column - Email Form */}
            <Stack gap="md">
              <Text size="sm" fw={700} tt="uppercase" c="dark.8" lts={2}>
                Send a message
              </Text>
              <Title order={2} c="dark.9" fz={{ base: 26, sm: 32 }}>
                Email me
              </Title>
              <TextInput
                label="Your Email"
                placeholder="your.email@example.com"
                value={fromEmail}
                onChange={(e) => setFromEmail(e.target.value)}
                type="email"
                c="dark.7"
              />
              <TextInput
                label="Subject"
                placeholder="What's this about?"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                c="dark.7"
              />
              <Textarea
                label="Message"
                placeholder="Type your message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                minRows={4}
                c="dark.7"
              />
              <Button
                onClick={handleSendEmail}
                color="dark"
                fullWidth
              >
                Send Email
              </Button>
            </Stack>
          </SimpleGrid>
        </Container>
      </Box>
    </>
  )
}
