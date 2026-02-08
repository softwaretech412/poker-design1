import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

/** Escape HTML so user content is safe in the email body */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export async function POST(request: NextRequest) {
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json(
      { error: 'Email is not configured (RESEND_API_KEY missing).' },
      { status: 500 }
    )
  }

  const toGmail = process.env.CONTACT_TO_EMAIL
  if (!toGmail) {
    return NextResponse.json(
      { error: 'CONTACT_TO_EMAIL (your Gmail) is not set in .env.local' },
      { status: 500 }
    )
  }

  try {
    const body = await request.json()
    const name = String(body.name ?? '').trim()
    const email = String(body.email ?? '').trim()
    const datesInVegas = String(body.datesInVegas ?? '').trim()
    const highStakes = String(body.highStakes ?? '').trim()
    const instagram = String(body.instagram ?? '').trim()
    const message = String(body.message ?? '').trim()

    // From: must be a domain you verify in Resend, or use Resend's sandbox
    const from = process.env.CONTACT_FROM_EMAIL || 'onboarding@resend.dev'
    // To: your Gmail – form submissions will arrive here
    const to = toGmail

    const html = `
      <h2>Boston Jimmy – Contact form</h2>
      <p><strong>Name:</strong> ${escapeHtml(name) || '—'}</p>
      <p><strong>Email:</strong> ${escapeHtml(email) || '—'}</p>
      <p><strong>Dates in Vegas:</strong> ${escapeHtml(datesInVegas) || '—'}</p>
      <p><strong>Have you played any other high stakes games in Vegas?</strong> ${escapeHtml(highStakes) || '—'}</p>
      <p><strong>Instagram:</strong> ${escapeHtml(instagram) || '—'}</p>
      <p><strong>Message:</strong></p>
      <p>${message ? escapeHtml(message).replace(/\n/g, '<br>') : '—'}</p>
    `
    
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: email || undefined,
      subject: `Boston Jimmy contact from ${escapeHtml(name) || escapeHtml(email) || 'Unknown'}`,
      html,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Failed to send' },
      { status: 500 }
    )
  }
}
