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
const INSTAGRAM_HANDLE = 'BostonJimmyy'
const INSTAGRAM_URL = `https://instagram.com/${INSTAGRAM_HANDLE}`
const INSTAGRAM_FEED_IMAGES = [
  '/assets/images/0C3A1338.jpeg',
  '/assets/images/imgi_69_R6II0769-1365x2048.jpg',
  '/assets/images/imgi_75_IMG_4640.jpg',
  '/assets/images/imgi_89_IMG_4636.jpg',
  '/assets/images/imgi_93_IMG_4650.jpg',
  '/assets/images/imgi_98_IMG_4646.jpg',
]

function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<string>('#')
  const scrollYRef = useRef(0)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const sections = [
      { id: '#', element: document.body },
      { id: '#about', element: document.getElementById('about') },
      { id: '#gallery', element: document.getElementById('gallery') },
      { id: '#faq', element: document.getElementById('faq') },
      { id: '#contact', element: document.getElementById('contact') },
    ].filter((s): s is { id: string; element: HTMLElement } => !!s.element) as {
      id: string
      element: HTMLElement
    }[]

    if (!sections.length) return

    const handleScroll = () => {
      const scrollPos = window.scrollY + 100
      let currentId = '#'

      for (const { id, element } of sections) {
        const rect = element.getBoundingClientRect()
        const top = rect.top + window.scrollY
        if (scrollPos >= top) {
          currentId = id
        }
      }

      setActiveSection(currentId)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
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
    { href: '#faq', label: 'FAQ' },
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
          <a
            key={label}
            href={href}
            onClick={() => {
              setActiveSection(href)
              closeMenu()
            }}
            className={`header-nav-link ${activeSection === href ? 'is-active' : ''}`}
          >
            {label}
          </a>
        ))}
      </nav>
      <div className={`header-overlay ${menuOpen ? 'open' : ''}`} aria-hidden={!menuOpen} onClick={closeMenu}>
        <nav className="header-overlay-nav" aria-label="Mobile" onClick={(e) => e.stopPropagation()}>
          {navLinks.map(({ href, label }) => (
            <a
              key={label}
              href={href}
              onClick={() => {
                setActiveSection(href)
                closeMenu()
              }}
              className={`header-nav-link ${activeSection === href ? 'is-active' : ''}`}
            >
              {label}
            </a>
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
        <div className="top-video-content">
          <p className="top-video-kicker">INVITE-ONLY</p>
          <h1 className="top-video-heading">
            HIGH STAKES CASH
            <br />
            GAMES IN LAS VEGAS
          </h1>
          <p className="top-video-subcopy">
            A fun, well-run poker game for business players, celebrities, and high-stakes recreational action.
          </p>
          <div className="top-video-cta-row">
            <a href="#contact" className="top-video-cta top-video-cta--secondary">REQUEST AN INVITE</a>
          </div>
        </div>
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
  return (
    <div className="footer-newsletter">
      <h4>SUPPORT</h4>
      <p>Gmail: <a href="mailto:jimmysleiman7@gmail.com">jimmysleiman7@gmail.com</a></p>
      <p>IG: <a href="https://instagram.com/BostonJimmyy" target="_blank" rel="noreferrer">BostonJimmyy</a></p>
    </div>
  )
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-grid">
          <div className="footer-col">
            <h4>ABOUT</h4>
            <a href="#about">About</a>
            <a href="#story">Our Story</a>
          </div>
          <div className="footer-col">
            <h4>CUSTOMER SERVICE</h4>
            <a href="#faq">FAQ</a>
          </div>
          <div className="footer-col">
            <h4>CONNECT</h4>
            <a href="#instagram">Instagram</a>
            <a href="#contact">Contact</a>
          </div>
          <Newsletter />
        </div>
        <p className="footer-copy">© 2026 Elite Poker. All rights reserved.</p>
      </div>
    </footer>
  )
}

function AboutUsSection() {
  return (
    <section id="about" className="promo-block">
      <div className="promo-inner">
        <h2 className="promo-title">WHAT THIS GAME IS</h2>
        <p className="promo-text">
          <strong>This is an invite-only high-stakes cash game hosted in Las Vegas.</strong>
        </p>
        <p className="promo-text">The focus is simple:</p>
        <p className="promo-text">Great action, good people, and a smooth, comfortable experience.</p>
        <p className="promo-text">
          The game is professionally run and intentionally curated so everyone knows what they&apos;re sitting in and can just enjoy playing poker.
        </p>
        <p className="promo-text">No chaos.</p>
        <p className="promo-text">No awkward moments.</p>
        <div className="promo-footer">
          <div className="promo-logo">
            Just a great game in a relaxed setting
          </div>
          <a href="#contact" className="top-video-cta">APPLY NOW</a>
        </div>
      </div>
    </section>
  )
}

const FAQ_DATA = [
  {
    question: 'What are the stakes?',
    answer: 'We play NLH 25/50/100, Minimum buy in is $10000, No maximum buy in',
  },
  {
    question: 'When do you play?',
    answer: 'We play Wednesday to Sunday, 4pm start till the early morning hours, During WSOP and WPT we play every single day non stop, On average last few years the game has ran around 260 days a year',
  },
  {
    question: 'What makes us unique?',
    answer: "We clearly identify who the professionals are and who the recreational players are, so everyone knows exactly what game they're sitting in. Lineups are intentionally curated for balance, action, and enjoyment not chaos. The game runs inside the high-stakes area at the Wynn Las Vegas, offering a luxury environment, professional management, and consistent structure. This isn't a random table or a free-for-all. It's a controlled, high-quality poker experience built for players who value fairness, comfort, and real action.",
  },

] as const

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(-1)

  return (
    <section id="faq" className="faq-section">
      <div className="faq-bg" aria-hidden="true" />
      <div className="faq-inner">
        <h2 className="faq-title">FAQS FOR YOUR GAME QUESTIONS</h2>
        <p className="faq-subtitle">
          Contact us at{' '}
          <a href="mailto:jimmysleiman7@gmail.com" className="faq-email">jimmysleiman7@gmail.com</a>
          {' '}for any questions.
        </p>
        <div className="faq-list">
          {FAQ_DATA.map((item, index) => {
            const isOpen = openIndex === index
            return (
              <div
                key={index}
                className={`faq-item ${isOpen ? 'faq-item--open' : ''}`}
              >
                <button
                  type="button"
                  className="faq-question-wrap"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                  id={`faq-question-${index}`}
                >
                  <span className="faq-question">{item.question}</span>
                  <span className="faq-icon" aria-hidden="true">
                    {isOpen ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /></svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                    )}
                  </span>
                </button>
                <div
                  id={`faq-answer-${index}`}
                  role="region"
                  aria-labelledby={`faq-question-${index}`}
                  aria-hidden={!isOpen}
                  className={`faq-answer-wrap ${isOpen ? 'faq-answer-wrap--open' : ''}`}
                >
                  <p className="faq-answer">{item.answer}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function InstagramFeedSection() {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const dragStartXRef = useRef(0)
  const dragDeltaRef = useRef(0)
  const justDraggedRef = useRef(false)

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  const closeLightbox = () => {
    if (justDraggedRef.current) return
    setLightboxOpen(false)
  }

  const goPrev = () => {
    setLightboxIndex((i) => (i <= 0 ? INSTAGRAM_FEED_IMAGES.length - 1 : i - 1))
  }

  const goNext = () => {
    setLightboxIndex((i) => (i >= INSTAGRAM_FEED_IMAGES.length - 1 ? 0 : i + 1))
  }

  useEffect(() => {
    if (!lightboxOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowLeft') goPrev()
      if (e.key === 'ArrowRight') goNext()
    }
    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [lightboxOpen])

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    dragStartXRef.current = clientX
    dragDeltaRef.current = 0
    justDraggedRef.current = false

    const onMove = (moveEvent: MouseEvent | TouchEvent) => {
      const x = 'touches' in moveEvent ? (moveEvent as TouchEvent).touches[0].clientX : (moveEvent as MouseEvent).clientX
      dragDeltaRef.current = x - dragStartXRef.current
      if ('touches' in moveEvent) moveEvent.preventDefault()
    }

    const touchOpts = { passive: false as const }
    const onEnd = () => {
      document.removeEventListener('mousemove', onMove as EventListener)
      document.removeEventListener('mouseup', onEnd)
      document.removeEventListener('touchmove', onMove as EventListener)
      document.removeEventListener('touchend', onEnd)
      const threshold = 50
      if (dragDeltaRef.current < -threshold) {
        goNext()
        justDraggedRef.current = true
      } else if (dragDeltaRef.current > threshold) {
        goPrev()
        justDraggedRef.current = true
      }
      dragDeltaRef.current = 0
      setTimeout(() => { justDraggedRef.current = false }, 150)
    }

    if ('touches' in e) {
      document.addEventListener('touchmove', onMove as EventListener, touchOpts)
      document.addEventListener('touchend', onEnd)
    } else {
      document.addEventListener('mousemove', onMove as EventListener)
      document.addEventListener('mouseup', onEnd)
    }
  }

  return (
    <section id="instagram" className="instagram-feed-section">
      <div className="instagram-feed-bg" aria-hidden="true" />
      <div className="instagram-feed-inner">
        <h2 className="instagram-feed-title">Follow us on Instagram</h2>
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="instagram-feed-handle"
        >
          @{INSTAGRAM_HANDLE}
        </a>
        <div className="instagram-feed-grid">
          {INSTAGRAM_FEED_IMAGES.map((src, i) => (
            <button
              key={i}
              type="button"
              className="instagram-feed-item"
              onClick={() => openLightbox(i)}
              aria-label={`View image ${i + 1} of ${INSTAGRAM_FEED_IMAGES.length}`}
            >
              <img src={src} alt="" loading="lazy" />
              <span className="instagram-feed-overlay" aria-hidden="true">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </span>
            </button>
          ))}
        </div>
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="instagram-feed-cta"
        >
          Follow @{INSTAGRAM_HANDLE}
        </a>
      </div>

      {lightboxOpen && (
        <div
          className="instagram-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Image gallery"
          onClick={(e) => e.target === e.currentTarget && closeLightbox()}
        >
          <button
            type="button"
            className="instagram-lightbox-close"
            onClick={closeLightbox}
            aria-label="Close"
          >
            <span aria-hidden="true">×</span>
          </button>
          <button
            type="button"
            className="instagram-lightbox-prev"
            onClick={(e) => { e.stopPropagation(); goPrev() }}
            aria-label="Previous image"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
          </button>
          <div
            className="instagram-lightbox-content"
            onMouseDown={handleDragStart}
            onTouchStart={handleDragStart}
          >
            <img
              src={INSTAGRAM_FEED_IMAGES[lightboxIndex]}
              alt=""
              draggable={false}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <button
            type="button"
            className="instagram-lightbox-next"
            onClick={(e) => { e.stopPropagation(); goNext() }}
            aria-label="Next image"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
          </button>
          <p className="instagram-lightbox-counter">
            {lightboxIndex + 1} / {INSTAGRAM_FEED_IMAGES.length}
          </p>
        </div>
      )}
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
              This is an invite-only high-stakes cash game hosted in Las Vegas, built around deep stacks,
              consistent lineups, and a professional environment. The game runs regularly and attracts experienced players, 
              business professionals, and international action looking for real stakes and real poker.
            </p>
          </div>
        </section>
        <FAQSection />
        <ContactSection />
        <InstagramFeedSection />
        <ClosingBanner />
      </main>
      <Footer />
    </>
  )
}
