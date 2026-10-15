import { useEffect, useMemo, useState } from 'react'
import { HOURS, MENU, OVEN, SHOP, type Item } from './data'

const ALL_ITEMS: Item[] = MENU.flatMap((g) => g.items)
const rupees = (n: number) => `₹${n}`

function useNow() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30_000)
    return () => clearInterval(t)
  }, [])
  return now
}

function OvenBoard() {
  const now = useNow()
  const mins = now.getHours() * 60 + now.getMinutes()
  const currentIdx = OVEN.reduce((acc, s, i) => (s.mins <= mins ? i : acc), -1)
  const nextIdx = currentIdx + 1 < OVEN.length ? currentIdx + 1 : -1
  const open = currentIdx >= 0

  return (
    <section className="oven" aria-labelledby="oven-title">
      <h2 id="oven-title" className="oven-title">
        {open ? 'Out of the oven now' : 'Opens at 6 am'}
      </h2>
      <p className="oven-now" aria-live="polite">
        {open ? OVEN[currentIdx].items : 'First batch of pav and bread is already proving.'}
      </p>
      <ol className="oven-list">
        {OVEN.map((s, i) => {
          const state = i === currentIdx ? 'now' : i === nextIdx ? 'next' : i < currentIdx ? 'past' : 'later'
          return (
            <li key={s.time} className={`oven-row ${state}`}>
              <span className="oven-time">{s.time}</span>
              <span className="oven-items">{s.items}</span>
              <span className="oven-tag">{state === 'now' ? 'Fresh' : state === 'next' ? 'Next' : ''}</span>
            </li>
          )
        })}
      </ol>
    </section>
  )
}

function Menu() {
  return (
    <section id="menu" className="section menu">
      <h2 className="h2">What we bake and fry</h2>
      <div className="menu-cols">
        {MENU.map((g) => (
          <div key={g.group} className="menu-group">
            <h3 className="h3">{g.group}</h3>
            <ul>
              {g.items.map((it) => (
                <li key={it.id} className="menu-item">
                  <div className="menu-line">
                    <span className="menu-name">{it.name}</span>
                    <span className="menu-dots" aria-hidden="true" />
                    <span className="menu-price">{rupees(it.price)}</span>
                  </div>
                  <p className="menu-note">{it.note}</p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}

const PICKUP_TIMES = (() => {
  const out: string[] = []
  for (let m = 7 * 60; m <= 20 * 60 + 30; m += 30) {
    const h = Math.floor(m / 60)
    const mm = m % 60
    const h12 = h > 12 ? h - 12 : h
    out.push(`${h12}:${mm === 0 ? '00' : mm} ${h >= 12 ? 'pm' : 'am'}`)
  }
  return out
})()

function Order() {
  const [qty, setQty] = useState<Record<string, number>>({})
  const [name, setName] = useState('')
  const [time, setTime] = useState(PICKUP_TIMES[2])

  const lines = useMemo(() => ALL_ITEMS.filter((i) => qty[i.id] > 0).map((i) => ({ ...i, n: qty[i.id] })), [qty])
  const total = lines.reduce((s, l) => s + l.n * l.price, 0)
  const count = lines.reduce((s, l) => s + l.n, 0)
  const ready = count > 0 && name.trim().length > 0

  const change = (id: string, d: number) =>
    setQty((q) => ({ ...q, [id]: Math.max(0, Math.min(20, (q[id] ?? 0) + d)) }))

  const message = [
    `Hi Ponni, I'd like to pre-order for pickup at ${time}.`,
    ...lines.map((l) => `${l.n} x ${l.name} (${rupees(l.n * l.price)})`),
    `Total: ${rupees(total)}`,
    `Name: ${name.trim()}`,
  ].join('\n')
  // The WhatsApp number lives in a server setting (see api/order.js), not in this page.
  const href = `/api/order?text=${encodeURIComponent(message)}`

  return (
    <section id="order" className="section order">
      <div className="order-intro">
        <h2 className="h2">Pre-order and pick up</h2>
        <p className="lede">
          Choose what you want, pick a time, and send it to us on WhatsApp. We bag it, you walk in and walk out. Pay at the counter.
        </p>
      </div>

      <div className="order-grid">
        <div className="order-items">
          {ALL_ITEMS.map((it) => (
            <div key={it.id} className="order-item">
              <div>
                <div className="order-name">{it.name}</div>
                <div className="order-price">{rupees(it.price)}</div>
              </div>
              <div className="stepper" role="group" aria-label={`Quantity of ${it.name}`}>
                <button type="button" onClick={() => change(it.id, -1)} disabled={!qty[it.id]} aria-label={`Remove one ${it.name}`}>
                  −
                </button>
                <output aria-live="polite">{qty[it.id] ?? 0}</output>
                <button type="button" onClick={() => change(it.id, 1)} aria-label={`Add one ${it.name}`}>
                  +
                </button>
              </div>
            </div>
          ))}
        </div>

        <form className="ticket" onSubmit={(e) => e.preventDefault()}>
          <h3 className="h3">Your order</h3>
          {lines.length === 0 ? (
            <p className="ticket-empty">Nothing yet. Add a few items from the list.</p>
          ) : (
            <ul className="ticket-lines">
              {lines.map((l) => (
                <li key={l.id}>
                  <span>
                    {l.n} × {l.name}
                  </span>
                  <span>{rupees(l.n * l.price)}</span>
                </li>
              ))}
            </ul>
          )}
          <div className="ticket-total">
            <span>Total</span>
            <strong>{rupees(total)}</strong>
          </div>
          <label className="field">
            <span>Your name</span>
            <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" placeholder="Anjali" />
          </label>
          <label className="field">
            <span>Pickup time today</span>
            <select value={time} onChange={(e) => setTime(e.target.value)}>
              {PICKUP_TIMES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </label>
          <a
            className={`btn btn-ink${ready ? '' : ' is-disabled'}`}
            href={ready ? href : undefined}
            target="_blank"
            rel="noopener noreferrer"
            aria-disabled={!ready}
            onClick={(e) => !ready && e.preventDefault()}
          >
            Send order on WhatsApp
          </a>
          {!ready && <p className="ticket-hint">Add an item and your name to send the order.</p>}
        </form>
      </div>
    </section>
  )
}

function Visit() {
  const today = (new Date().getDay() + 6) % 7 // Monday = 0
  return (
    <section id="visit" className="section visit">
      <div>
        <h2 className="h2">Find us on Princess Street</h2>
        <p className="lede">{SHOP.address}. Look for the yellow signboard and the queue for pazhampori at four.</p>
        <p className="visit-actions">
          <a className="btn btn-ink" href={SHOP.mapsUrl} target="_blank" rel="noopener noreferrer">
            Open in Maps
          </a>
        </p>
      </div>
      <table className="hours">
        <caption className="sr-only">Opening hours</caption>
        <tbody>
          {HOURS.map((h, i) => (
            <tr key={h.day} className={i === today ? 'today' : undefined}>
              <th scope="row">{h.day}</th>
              <td>{h.hours}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}

export default function App() {
  return (
    <>
      <a className="skip" href="#menu">
        Skip to the menu
      </a>
      <header className="hero">
        <nav className="nav" aria-label="Main">
          <a href="#menu">Menu</a>
          <a href="#order">Pre-order</a>
          <a href="#visit">Visit</a>
        </nav>
        <div className="hero-grid">
          <div className="hero-copy">
            <h1 className="wordmark">Ponni</h1>
            <p className="hero-line">Bakery and tea house on Princess Street, {SHOP.area}. Something is always coming out of the oven.</p>
            <p className="hero-actions">
              <a className="btn btn-ink" href="#order">
                Pre-order for pickup
              </a>
              <a className="btn btn-line" href="#menu">
                See the menu
              </a>
            </p>
          </div>
          <OvenBoard />
        </div>
      </header>
      <main>
        <Menu />
        <Order />
        <Visit />
      </main>
      <footer className="footer">
        <p>Ponni is a made-up shop. This is a concept website designed and built by rk-studio.</p>
        <p>
          <a href="https://portfolio-rkv6.vercel.app" target="_blank" rel="noopener noreferrer">
            See more work by Rithin K Varghese
          </a>
        </p>
      </footer>
    </>
  )
}
