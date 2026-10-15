// Redirects to WhatsApp using a number kept in the WHATSAPP_NUMBER environment variable,
// so the number is not in the public repo or in the page's source code.
export default function handler(req, res) {
  const number = (process.env.WHATSAPP_NUMBER || '').replace(/\D/g, '')
  if (!number) {
    res.status(503).send('Ordering is not set up yet.')
    return
  }
  const raw = Array.isArray(req.query.text) ? req.query.text[0] : req.query.text
  const text = String(raw || '').slice(0, 1000)
  res.setHeader('Cache-Control', 'no-store')
  res.redirect(302, `https://wa.me/${number}?text=${encodeURIComponent(text)}`)
}
