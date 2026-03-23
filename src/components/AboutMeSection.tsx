import { Box, Flex, Group, Stack, Text, Title } from '@mantine/core'
import { motion } from 'framer-motion'
import { palette } from '../theme'
import HobbyBubbles from './HobbyBubbles'

/** Transparent background to show Vanta effect */
const aboutMeBackground = 'transparent'

const playlists = [
  {
    id: '1927SoVPi9COBAl9rOIXFr',
    name: 'island',
    spotifyUrl: 'https://open.spotify.com/playlist/1927SoVPi9COBAl9rOIXFr',
    image: '/src/assets/playlist1.png',
  },
  {
    id: '0FrTnk8JKVKjpfnObDW2sc',
    name: 'time stood still',
    spotifyUrl: 'https://open.spotify.com/playlist/0FrTnk8JKVKjpfnObDW2sc',
    image: '/src/assets/playlist2.png',
  },
  {
    id: '5MW6CjgQdAkxHcDMXc5abS',
    name: 'powerup',
    spotifyUrl: 'https://open.spotify.com/playlist/5MW6CjgQdAkxHcDMXc5abS',
    image: '/src/assets/playlist3.png',
  },
]

function SpotifyIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#1DB954">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
    </svg>
  )
}

function LocationIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

function EmailIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  )
}

/**
 * About Me section with photo left, info right layout.
 */
export function AboutMeSection() {
  return (
    <Box
      component="section"
      id="about"
      pos="relative"
      style={{
        background: aboutMeBackground,
        scrollMarginBottom: '6.5rem',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '4rem 0',
      }}
    >
      {/* Section Title - Outside Container to align with Skills/Projects */}
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
            About Me
          </Title>
        </motion.div>
      </Box>

      <Box
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 2rem',
        }}
      >

        <Flex
          direction={{ base: 'column', md: 'row' }}
          gap="xl"
          align="stretch"
        >
          {/* Left Side - Photo */}
          <motion.div
            style={{ flex: '0 0 320px', alignSelf: 'stretch' }}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ margin: '-100px' }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1], delay: 0.1 }}
          >
            <Box
              style={{
                width: '100%',
                height: '100%',
                minHeight: '385px',
                background: `linear-gradient(135deg, ${palette.panel} 0%, ${palette.bg} 100%)`,
                backdropFilter: 'blur(10px)',
                borderRadius: '20px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              <img
                src="/src/assets/profilephoto.jpg"
                alt="Dominic Joel M. Gomez"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            </Box>
          </motion.div>

          {/* Right Side - Info and Cards */}
          <Stack gap="lg" style={{ flex: 1 }}>
            {/* Top Info */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ margin: '-100px' }}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay: 0.2 }}
            >
              <Box>
                <Text
                  fz={{ base: 24, sm: 28, md: 32 }}
                  fw={700}
                  style={{ color: palette.textLighter, marginBottom: '0.5rem' }}
                >
                  Dominic Joel M. Gomez
                </Text>
                <Group gap="xs" mb="xs">
                  <LocationIcon size={18} />
                  <Text fz={16} style={{ color: palette.textLight }}>
                    Paranaque City, Philippines
                  </Text>
                </Group>
                <Group gap="xs">
                  <EmailIcon size={18} />
                  <Text fz={16} style={{ color: palette.textLight }}>
                    gomez.dominic.joel@gmail.com
                  </Text>
                </Group>
              </Box>
            </motion.div>

            {/* Two Cards - Work Playlist & Hobbies */}
            <Flex gap="lg" direction={{ base: 'column', sm: 'row' }} mt="xl">
              {/* Work Playlist Card */}
              <motion.div
                style={{ flex: 1 }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ margin: '-100px' }}
                transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay: 0.3 }}
              >
                <Box
                  style={{
                    flex: 1,
                    minHeight: '398px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    padding: '32px',
                  }}
                >
                  <Group justify="space-between" mb="md">
                    <Box>
                      <Text
                        fz={{ base: 23, sm: 23 }}
                        fw={700}
                        style={{ color: palette.textLighter }}
                      >
                        Work Playlists
                      </Text>
                      <Text
                        fz={16}
                        style={{ color: palette.textLight }}
                      >
                        What I code to
                      </Text>
                    </Box>
                    <SpotifyIcon size={32} />
                  </Group>

                  <Group gap="sm" align="stretch" mt="xl">
                    {playlists.map((playlist) => (
                      <Box
                        key={playlist.id}
                        style={{
                          flex: 1,
                          minWidth: '0',
                        }}
                      >
                        <a
                          href={playlist.spotifyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'block',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            transition: 'transform 0.3s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.05)'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)'
                          }}
                        >
                          <img
                            src={playlist.image}
                            alt={playlist.name}
                            style={{
                              width: '100%',
                              aspectRatio: '1',
                              objectFit: 'cover',
                              display: 'block',
                            }}
                          />
                        </a>
                      </Box>
                    ))}
                  </Group>
                </Box>
              </motion.div>

              {/* Hobbies Card */}
              <motion.div
                style={{ flex: 1 }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ margin: '-100px' }}
                transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay: 0.4 }}
              >
                <Box
                  style={{
                    flex: 1,
                    minHeight: '385px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    padding: '32px',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <Text
                    fz={{ base: 23, sm: 23 }}
                    fw={700}
                    style={{ color: palette.textLighter, marginBottom: '0.5rem' }}
                  >
                    Hobbies
                  </Text>
                  <Text
                    fz={16}
                    style={{ color: palette.textLight, marginBottom: '1rem' }}
                  >
                    What I enjoy outside of work
                  </Text>
                  <Box style={{ flex: 1 }}>
                    <HobbyBubbles />
                  </Box>
                </Box>
              </motion.div>
            </Flex>
          </Stack>
        </Flex>
      </Box>
    </Box>
  )
}
