import { useState, type FormEvent } from 'react'
import { contacts, EMAIL } from '../content'

/** Closing coupon: direct contact details plus a form that opens the visitor's mail app. */
export function ContactDesk() {
  const [from, setFrom] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState<string | null>(null)

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (!message.trim()) {
      setError('Enter a message before sending.')
      return
    }
    setError(null)
    const body = from.trim() ? `${message}\n\nFrom: ${from.trim()}` : message
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject || 'Inquiry from your portfolio')}&body=${encodeURIComponent(body)}`
  }

  return (
    <section className="coupon contact" data-reveal="rise" id="contact" aria-labelledby="contact-title">
      <header className="coupon-head">
        <span className="coupon-num" aria-hidden="true">7</span>
        <p className="coupon-title caps">Contact</p>
        <span className="coupon-tab caps">Philippines, UTC+8</span>
      </header>
      <div className="contact-body">
        <div className="contact-lines">
          <h2 className="display contact-title" id="contact-title">Get in touch</h2>
          <p className="contact-lede">
            For roles, collaborations, or questions about these projects, reach me by email or through any of the
            profiles below.
          </p>
          <table className="contact-table">
            <caption className="visually-hidden">Ways to reach Dominic</caption>
            <tbody>
              {contacts.map((contact) => (
                <tr key={contact.method}>
                  <th scope="row" className="caps">{contact.method}</th>
                  <td>
                    <a
                      href={contact.href}
                      {...(contact.href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}
                    >
                      {contact.handle}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="perf perf--vertical" aria-hidden="true" />

        <form className="contact-form" onSubmit={submit} noValidate>
          <h3 className="caps contact-form-title">Send a message</h3>
          <label className="input">
            <span className="caps">Your email</span>
            <input type="email" autoComplete="email" value={from} onChange={(e) => setFrom(e.target.value)} placeholder="name@company.com" />
          </label>
          <label className="input">
            <span className="caps">Subject</span>
            <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Software engineering internship inquiry" />
          </label>
          <label className="input">
            <span className="caps">Message</span>
            <textarea
              rows={5}
              value={message}
              onChange={(e) => {
                setMessage(e.target.value)
                if (error) setError(null)
              }}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? 'contact-error' : 'contact-help'}
            />
          </label>
          {error ? (
            <p id="contact-error" className="input-error" role="alert">{error}</p>
          ) : (
            <p id="contact-help" className="input-help">Your email application opens with this message filled in.</p>
          )}
          <button type="submit" className="btn btn--primary">Send message</button>
        </form>
      </div>
    </section>
  )
}
