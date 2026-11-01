import { useState, type FormEvent } from 'react'
import { contacts, EMAIL } from '../content'

/** Direct contact links beside a form that opens the visitor's mail app with the message filled in. */
export function Contact() {
  const [from, setFrom] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState<string | null>(null)

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (!message.trim()) {
      setError('Enter a message before opening the draft.')
      return
    }
    setError(null)
    const body = from.trim() ? `${message}\n\nFrom: ${from.trim()}` : message
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject || 'Inquiry from your portfolio')}&body=${encodeURIComponent(body)}`
  }

  return (
    <section className="band" id="contact" aria-labelledby="contact-title">
      <div className="contact">
        <div data-reveal>
          <h2 className="display section-title" id="contact-title">Get in touch</h2>
          <p className="contact-lede">Email is the best way to reach me, whether it’s about a role, a project or anything on this page.</p>
          <ul className="contact-links">
            {contacts.map((contact) => (
              <li key={contact.method}>
                <a href={contact.href} {...(contact.href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}>
                  {contact.method}
                  <span>{contact.handle}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <form className="contact-form" onSubmit={submit} noValidate data-reveal>
          <h3 className="display">Send a message</h3>
          <label>
            Your email
            <input type="email" autoComplete="email" value={from} onChange={(e) => setFrom(e.target.value)} placeholder="name@company.com" />
          </label>
          <label>
            Subject
            <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Software engineering internship" />
          </label>
          <label>
            Message
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
            <p id="contact-error" className="form-error" role="alert">{error}</p>
          ) : (
            <p id="contact-help" className="form-help">Your email app opens with this message filled in.</p>
          )}
          <button type="submit" className="btn btn--accent">Open email draft</button>
        </form>
      </div>
    </section>
  )
}
