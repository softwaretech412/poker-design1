'use client'

import { useState, useEffect, useRef } from 'react'

const TOP_VIDEO = '/assets/videos/top-video.mov'
const SECTION_VIDEO = '/assets/videos/medium-video.mov'
const SLIDER_IMAGES = [
  '/assets/images/0C3A1338.jpeg',
  '/assets/images/imgi_69_R6II0769-1365x2048.jpg',
  '/assets/images/imgi_75_IMG_4640.jpg',
  '/assets/images/imgi_89_IMG_4636.jpg',
  '/assets/images/imgi_93_IMG_4650.jpg',
  '/assets/images/imgi_98_IMG_4646.jpg',
  '/assets/images/imgi_107_IMG_4644.jpg',
  '/assets/images/imgi_41_IMG_4649.jpg',
  '/assets/images/imgi_56_IMG_4639.jpg',
]
const SPLIT_LEFT = '/assets/images/imgi_46_0C3A1325-scaled.jpg'
const SPLIT_RIGHT = '/assets/images/imgi_51_IMG_4642.jpg'
const TWO_COL_UPPER = ['/assets/images/imgi_56_IMG_4639.jpg', '/assets/images/imgi_61_IMG_4637.jpg']
const FULL_WIDTH = '/assets/images/imgi_1_0C3A1303-2-scaled.jpg'
const TWO_COL_LOWER = ['/assets/images/imgi_80_IMG_4648.jpg', '/assets/images/imgi_84_IMG_4647.jpg']
const PORTRAIT_SECTION = '/assets/images/footer.webp'
const LOGO = '/assets/logo.png'

function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const scrollYRef = useRef(0)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen)
    if (menuOpen) {
      scrollYRef.current = window.scrollY
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollYRef.current}px`
      document.body.style.left = '0'
      document.body.style.right = '0'
      document.body.style.width = '100%'
    } else {
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.left = ''
      document.body.style.right = ''
      document.body.style.width = ''
      window.scrollTo(0, scrollYRef.current)
    }
    return () => {
      document.body.classList.remove('menu-open')
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.left = ''
      document.body.style.right = ''
      document.body.style.width = ''
    }
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)
  const navLinks = [
    { href: '#', label: 'HOME' },
    { href: '#about', label: 'ABOUT US' },
    { href: '#gallery', label: 'GALLERY' },
    { href: '#contact', label: 'CONTACT' },
  ]

  return (
    <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
      <a href="#" className="header-brand">Boston Jimmy</a>
      <button
        type="button"
        className="header-menu-btn"
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((o) => !o)}
      >
        <span className="header-menu-icon">{menuOpen ? '✕' : '☰'}</span>
      </button>
      <nav className="header-nav" aria-label="Main">
        {navLinks.map(({ href, label }) => (
          <a key={label} href={href} onClick={closeMenu}>{label}</a>
        ))}
      </nav>
      <div className={`header-overlay ${menuOpen ? 'open' : ''}`} aria-hidden={!menuOpen} onClick={closeMenu}>
        <nav className="header-overlay-nav" aria-label="Mobile" onClick={(e) => e.stopPropagation()}>
          {navLinks.map(({ href, label }) => (
            <a key={label} href={href} onClick={closeMenu}>{label}</a>
          ))}
        </nav>
      </div>
    </header>
  )
}

const VIDEO_START_DELAY_MS = 1500

function TopVideo() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [startPlayback, setStartPlayback] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setStartPlayback(true), VIDEO_START_DELAY_MS)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (!startPlayback || !videoRef.current) return
    videoRef.current.play().catch(() => { })
  }, [startPlayback])

  return (
    <section className="top-video">
      <video ref={videoRef} muted loop playsInline autoPlay={startPlayback}>
        <source src={TOP_VIDEO} type="video/mp4" />
        <source src={TOP_VIDEO} type="video/quicktime" />
      </video>
      <div className="top-video-overlay">
        <img src={LOGO} alt="Boston Jimmy" className="top-video-logo" />
        <a href="#contact" className="top-video-cta top-video-cta--table">JOIN AN GAME</a>
      </div>
    </section>
  )
}

const SLIDER_LOOP_DURATION_MS = 90000

function ImageSlider() {
  const [isPlaying, setIsPlaying] = useState(true)
  const trackRef = useRef<HTMLDivElement>(null)
  const translateXRef = useRef(0)
  const isPlayingRef = useRef(true)
  const isDraggingRef = useRef(false)
  const dragStartXRef = useRef(0)
  const dragStartTranslateRef = useRef(0)
  const rafRef = useRef<number | null>(null)

  const slides = [...SLIDER_IMAGES, ...SLIDER_IMAGES]

  isPlayingRef.current = isPlaying

  useEffect(() => {
    if (!trackRef.current) return

    let lastTime = performance.now()

    function tick(now: number) {
      const track = trackRef.current
      if (!track) return
      if (rafRef.current !== null) rafRef.current = requestAnimationFrame(tick)
      if (isDraggingRef.current) {
        lastTime = now
        return
      }
      if (!isPlayingRef.current) {
        lastTime = now
        return
      }
      const trackWidth = track.scrollWidth
      const halfWidth = trackWidth / 2
      const speed = halfWidth / SLIDER_LOOP_DURATION_MS
      const elapsed = now - lastTime
      lastTime = now
      translateXRef.current -= speed * elapsed
      if (translateXRef.current < -halfWidth) translateXRef.current += halfWidth
      if (translateXRef.current > 0) translateXRef.current -= halfWidth
      track.style.transform = `translateX(${translateXRef.current}px)`
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => { if (rafRef.current !== null) cancelAnimationFrame(rafRef.current) }
  }, [])

  const getClientX = (e: React.TouchEvent | React.MouseEvent) =>
    'touches' in e ? e.touches[0].clientX : e.clientX

  const handleDragStart = (e: React.TouchEvent | React.MouseEvent) => {
    isDraggingRef.current = true
    dragStartXRef.current = getClientX(e)
    dragStartTranslateRef.current = translateXRef.current
  }

  const handleDragMove = (e: TouchEvent | MouseEvent) => {
    if (!isDraggingRef.current) return
    e.preventDefault()
    const track = trackRef.current
    if (!track) return
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const dx = clientX - dragStartXRef.current
    let next = dragStartTranslateRef.current + dx
    const halfWidth = track.scrollWidth / 2
    if (next > 0) next -= halfWidth
    if (next < -halfWidth) next += halfWidth
    translateXRef.current = next
    track.style.transform = `translateX(${translateXRef.current}px)`
  }

  const handleDragEnd = () => {
    isDraggingRef.current = false
  }

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const onMove = (e: TouchEvent | MouseEvent) => handleDragMove(e)
    const onEnd = () => handleDragEnd()
    document.addEventListener('mousemove', onMove, { passive: false })
    document.addEventListener('mouseup', onEnd)
    document.addEventListener('touchmove', onMove, { passive: false })
    document.addEventListener('touchend', onEnd)
    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onEnd)
      document.removeEventListener('touchmove', onMove)
      document.removeEventListener('touchend', onEnd)
    }
  }, [])

  return (
    <section id="gallery" className="image-slider-section">
      <div className="image-slider-wrap">
        <div
          ref={trackRef}
          className="image-slider-track image-slider-track-draggable"
          style={{ transform: 'translateX(0)' }}
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
          onDragStart={(e) => e.preventDefault()}
        >
          {slides.map((src, i) => (
            <div key={i} className="image-slider-slide">
              <img src={src} alt="" loading={i < 4 ? 'eager' : 'lazy'} draggable={false} />
            </div>
          ))}
        </div>
        <div className="image-slider-controls">
          <button
            type="button"
            className="image-slider-play-pause"
            aria-label={isPlaying ? 'Pause' : 'Play'}
            onClick={() => setIsPlaying((p) => !p)}
          >
            {isPlaying ? '❚❚' : '▶'}
          </button>
        </div>
      </div>
    </section>
  )
}

function SplitVideo() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch(() => { })
          } else {
            video.pause()
          }
        })
      },
      { threshold: 0.25 }
    )
    observer.observe(video)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="split-video-section">
      <video
        ref={videoRef}
        className="split-video"
        src={SECTION_VIDEO}
        muted
        loop
        playsInline
        aria-label="Poker game atmosphere"
      />
    </section>
  )
}

function SplitImage() {
  return (
    <section className="split-image">
      <div className="split-half"><img src={SPLIT_LEFT} alt="" loading="lazy" /></div>
      <div className="split-half"><img src={SPLIT_RIGHT} alt="" loading="lazy" /></div>
    </section>
  )
}

function TwoColumn({ images, showCta = true }: { images: string[]; showCta?: boolean }) {
  return (
    <section className="two-column">
      {images.map((src, i) => (
        <div key={i} className="two-col-half">
          <img src={src} alt="" loading="lazy" />
          {showCta && <a href="#shop" className="cta-overlay">Shop Now</a>}
        </div>
      ))}
    </section>
  )
}

function FullWidthImage() {
  return (
    <section className="full-width-block">
      <img src={FULL_WIDTH} alt="" loading="lazy" />
    </section>
  )
}

function InteriorShot() {
  return (
    <section className="interior-shot interior-shot--show-all">
      <img src={PORTRAIT_SECTION} alt="" loading="lazy" />
    </section>
  )
}

type ContactFormState = {
  name: string
  email: string
  datesInVegas: string
  highStakes: string
  instagram: string
  message: string
}

function ContactSection() {
  const [form, setForm] = useState<ContactFormState>({
    name: '',
    email: '',
    datesInVegas: '',
    highStakes: '',
    instagram: '',
    message: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  useEffect(() => {
    if (submitStatus !== 'success' && submitStatus !== 'error') return
    const t = setTimeout(() => setSubmitStatus('idle'), 4000)
    return () => clearTimeout(t)
  }, [submitStatus])

  const validate = () => {
    const next: Record<string, string> = {}
    if (!form.name.trim()) next.name = 'This field is required. Please input your name.'
    if (!form.email.trim()) next.email = 'This field is required.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Please input a valid email.'
    if (!form.datesInVegas.trim()) next.datesInVegas = 'This field is required.'
    if (!form.highStakes) next.highStakes = 'This field is required.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      
      if (!res.ok) throw new Error('Send failed')
      setSubmitStatus('success')
      setForm({ name: '', email: '', datesInVegas: '', highStakes: '', instagram: '', message: '' })
      setTouched({})
    } catch {
      setSubmitStatus('error')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.type === 'radio' ? (e.target as HTMLInputElement).value : e.target.value
    setForm((prev) => ({ ...prev, [e.target.name]: value }))
    if (errors[e.target.name]) setErrors((prev) => ({ ...prev, [e.target.name]: '' }))
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setTouched((prev) => ({ ...prev, [e.target.name]: true }))

  const showError = (name: string) => touched[name] || !!errors[name]

  return (
    <section id="contact" className="section contact-section">
      <h2 className="contact-main-title">Contact</h2>
      <p className="contact-subtitle">Serious inquiries only</p>

      <div className="contact-grid">
        <div className="contact-card contact-card--form">
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="contact-field">
              <label htmlFor="name">Name <span className="required">*</span></label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Your Full Name"
                value={form.name}
                onChange={handleChange}
                onBlur={handleBlur}
                className={showError('name') && errors.name ? 'contact-input--error' : ''}
              />
              {showError('name') && errors.name && <span className="contact-error">{errors.name}</span>}
            </div>
            <div className="contact-field">
              <label htmlFor="email">Email Address <span className="required">*</span></label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={showError('email') && errors.email ? 'contact-input--error' : ''}
              />
              {showError('email') && errors.email && <span className="contact-error">{errors.email}</span>}
            </div>
            <div className="contact-field">
              <label htmlFor="datesInVegas">Dates in Vegas <span className="required">*</span></label>
              <div className="contact-date-wrap">
                <input
                  id="datesInVegas"
                  name="datesInVegas"
                  type="date"
                  value={form.datesInVegas}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={showError('datesInVegas') && errors.datesInVegas ? 'contact-input--error' : ''}
                  aria-describedby="datesInVegas-hint"
                />
                <span className="contact-date-icon" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                </span>
              </div>
              {showError('datesInVegas') && errors.datesInVegas && <span className="contact-error">{errors.datesInVegas}</span>}
            </div>
            <div className="contact-field contact-radio-group">
              <label className="contact-radio-label">
                Have you played any other high stakes games in Vegas? <span className="required">*</span>
              </label>
              <div className="contact-radio-options">
                <label className="contact-radio-option">
                  <input type="radio" name="highStakes" value="yes" checked={form.highStakes === 'yes'} onChange={handleChange} />
                  <span>Yes</span>
                </label>
                <label className="contact-radio-option">
                  <input type="radio" name="highStakes" value="no" checked={form.highStakes === 'no'} onChange={handleChange} />
                  <span>No</span>
                </label>
              </div>
              {errors.highStakes && <span className="contact-error">{errors.highStakes}</span>}
            </div>
            <div className="contact-field">
              <label htmlFor="instagram">Instagram</label>
              <input
                id="instagram"
                name="instagram"
                type="text"
                placeholder="Instagram"
                value={form.instagram}
                onChange={handleChange}
              />
            </div>
            <div className="contact-field">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                placeholder="Tell us about the game, stake, and what you are looking for (optional)."
                value={form.message}
                onChange={handleChange}
              />
            </div>
            <button type="submit" className="contact-submit-btn" disabled={submitStatus === 'sending'}>
              {submitStatus === 'sending' ? 'Sending…' : 'Submit'}
            </button>
          </form>
        </div>
      </div>
      {submitStatus === 'success' && (
        <div className="toast toast--success" role="status" aria-live="polite">
          <span className="toast-icon">✓</span>
          <span>Thanks! We&apos;ll be in touch.</span>
        </div>
      )}
      {submitStatus === 'error' && (
        <div className="toast toast--error" role="alert" aria-live="assertive">
          <span className="toast-icon">!</span>
          <span>Something went wrong. Please try again.</span>
        </div>
      )}
    </section>
  )
}

function Newsletter() {
  const [email, setEmail] = useState('')
  const [agree, setAgree] = useState(false)
  return (
    <div className="footer-newsletter">
      <h4>NEWSLETTER</h4>
      <p>Sign up for our newsletter to stay up to date on the next journey.</p>
      <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-label="Email"
        />
        <label className="newsletter-checkbox">
          <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
          I agree to receiving marketing emails and special deals
        </label>
      </form>
    </div>
  )
}

const PAYMENT_ICONS = ['American Express', 'Apple Pay', 'Diners Club', 'Discover', 'Google Pay', 'Mastercard', 'PayPal', 'Shop Pay', 'Visa']

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-grid">
          <div className="footer-col">
            <h4>ABOUT</h4>
            <a href="#about">About</a>
            <a href="#about">Our Story</a>
            <a href="#making">The Making Of</a>
          </div>
          <div className="footer-col">
            <h4>CUSTOMER SERVICE</h4>
            <a href="#">FAQ</a>
            <a href="#">Returns & Exchange Policy</a>
            <a href="#">Track a Shipment</a>
            <a href="#">Return Request</a>
          </div>
          <div className="footer-col">
            <h4>CONNECT</h4>
            <a href="#">Instagram</a>
            <a href="#">Press Inquiries</a>
            <a href="#contact">Contact</a>
          </div>
          <Newsletter />
        </div>
        <div className="footer-payments">
          {PAYMENT_ICONS.map((name) => (
            <span key={name} className="payment-badge" title={name}>{name}</span>
          ))}
        </div>
        <p className="footer-copy">© 2026 Andrew Morgan, Andrew Morgan LLC All rights reserved.</p>
      </div>
    </footer>
  )
}

function AboutUsSection() {
  return (
    <section id="about" className="promo-block">
      <div className="promo-inner">
        <h2 className="promo-title">About Us</h2>
        <p className="promo-text">
          Boston Jimmy brings together players who appreciate the highest stakes and the finest tables. We run private games where skill, nerve, and camaraderie meet—elevated and never ordinary. Whether you&apos;re in Vegas or planning your next trip, we craft experiences that set a new standard in high-stakes play.
        </p>
        <div className="promo-logo">BOSTON JIMMY</div>
      </div>
    </section>
  )
}

function ClosingBanner() {
  return (
    <section className="closing-banner">
      <p>Where will Boston Jimmy take you, and what memories will you create?</p>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <TopVideo />
        <AboutUsSection />
        <ImageSlider />
        <SplitVideo />
        <TwoColumn images={TWO_COL_UPPER} showCta={false} />
        <FullWidthImage />
        <TwoColumn images={TWO_COL_LOWER} showCta={false} />
        <InteriorShot />
        <section id="story" className="section section-dark">
          <div className="section-inner">
            <h2 className="section-title">Our Story</h2>
            <p className="section-text">
              The Poker brings the thrill of professional poker to dedicated players
              across the World. We provide a premium, secure, and exciting environment for live poker games.
            </p>
          </div>
        </section>
        <ContactSection />
        <ClosingBanner />
      </main>
      <Footer />
    </>
  )
}
