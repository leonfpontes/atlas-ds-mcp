// Records the README GIF and the 1-minute video from demo.html, frame by frame, so every
// run gives the same frames. Captions are part of the frame (English only, no narration) and
// also ship as WebVTT. Needs ffmpeg on the PATH and Chromium (pnpm exec playwright install chromium).
// Usage: pnpm --filter atlas-site record-demo [--frames t1,t2,…]   (--frames saves single PNGs to check)
import { execFileSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { chromium } from '@playwright/test'
import { createServer } from 'vite'

const root = fileURLToPath(new URL('..', import.meta.url))
const media = fileURLToPath(new URL('../../docs/media/', import.meta.url))
mkdirSync(media, { recursive: true })

const VIDEO_FPS = 15
const GIF_FPS = 10
const GIF_SPEED = 2 // the GIF plays the demo scene at twice the speed
const flag = process.argv.indexOf('--frames')
const only = flag > 0 ? process.argv[flag + 1].split(',').map(Number) : null

const server = await createServer({ root, server: { host: '127.0.0.1', port: 0 }, logLevel: 'error' })
await server.listen()
const browser = await chromium.launch()
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1 })
  await page.goto(`${server.resolvedUrls.local[0]}demo.html?theme=light`, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  const { SCENES, VIDEO_MS, captionsFor } = await server.ssrLoadModule('/src/pages/demo-script.ts')
  const { scoreboard } = await server.ssrLoadModule('/src/lib/scoreboard-data.ts')
  const { numberScene } = await server.ssrLoadModule('/src/lib/scoreboard.ts')
  const numbers = numberScene(scoreboard)
  const CAPTIONS = captionsFor(numbers)

  const shoot = async (t, file) => {
    await page.evaluate((ms) => window.__setTime(ms), t)
    await page.screenshot({ path: file })
  }

  if (only) {
    for (const t of only) await shoot(t, path.join(media, `frame-${t}.png`))
    console.log(`record-demo: wrote ${only.length} frames to docs/media/`)
  } else {
    const encode = (args) =>
      execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', ...args], { stdio: 'inherit' })

    // Video: 60 s at 15 fps, H.264.
    const vdir = mkdtempSync(path.join(tmpdir(), 'atlas-video-'))
    const vframes = Math.round((VIDEO_MS / 1000) * VIDEO_FPS)
    for (let i = 0; i < vframes; i++)
      await shoot((i * 1000) / VIDEO_FPS, path.join(vdir, `f${String(i).padStart(5, '0')}.png`))
    encode([
      '-framerate',
      String(VIDEO_FPS),
      '-i',
      path.join(vdir, 'f%05d.png'),
      '-c:v',
      'libx264',
      '-pix_fmt',
      'yuv420p',
      '-crf',
      '22',
      '-movflags',
      '+faststart',
      path.join(media, 'atlas-demo.mp4'),
    ])
    rmSync(vdir, { recursive: true })

    // GIF: the demo scene, 2× speed, 960 px wide.
    const gdir = mkdtempSync(path.join(tmpdir(), 'atlas-gif-'))
    const [d0, d1] = SCENES.demo
    const gframes = Math.round(((d1 - d0) / 1000 / GIF_SPEED) * GIF_FPS)
    for (let i = 0; i < gframes; i++)
      await shoot(
        d0 + (i * 1000 * GIF_SPEED) / GIF_FPS,
        path.join(gdir, `f${String(i).padStart(5, '0')}.png`),
      )
    const palette = path.join(gdir, 'palette.png')
    const frames = path.join(gdir, 'f%05d.png')
    encode([
      '-framerate',
      String(GIF_FPS),
      '-i',
      frames,
      '-vf',
      'scale=960:-1:flags=lanczos,palettegen=max_colors=96:stats_mode=diff',
      palette,
    ])
    encode([
      '-framerate',
      String(GIF_FPS),
      '-i',
      frames,
      '-i',
      palette,
      '-lavfi',
      'scale=960:-1:flags=lanczos[x];[x][1:v]paletteuse=dither=none:diff_mode=rectangle',
      '-loop',
      '0',
      path.join(media, 'atlas-demo.gif'),
    ])
    rmSync(gdir, { recursive: true })

    // Captions as WebVTT, for players that show a track.
    const ts = (ms) => new Date(ms).toISOString().slice(11, 23)
    writeFileSync(
      path.join(media, 'atlas-demo.en.vtt'),
      `WEBVTT\n\n${CAPTIONS.map((c, i) => `${i + 1}\n${ts(c.from)} --> ${ts(c.to)}\n${c.text}\n`).join('\n')}`,
    )
    // What the number scene showed, so a test can tell when the video is older than latest.json.
    writeFileSync(path.join(media, 'atlas-demo.numbers.json'), `${JSON.stringify(numbers, null, 2)}\n`)
    console.log('record-demo: wrote docs/media/atlas-demo.mp4, .gif, .en.vtt and .numbers.json')
  }
} finally {
  await browser.close()
  await server.close()
}
