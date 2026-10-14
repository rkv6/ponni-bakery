// All of this is invented for the concept. Swap it for the real business's details.
export const SHOP = {
  name: 'Ponni',
  area: 'Fort Kochi',
  address: 'Princess Street, Fort Kochi, Kochi 682001',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Princess+Street+Fort+Kochi',
  whatsapp: '910000000000', // placeholder number: replace with the real one
  phoneLabel: '+91 00000 00000',
}

export type Slot = { time: string; mins: number; items: string }
// Minutes after midnight, so "now" can be matched against the day.
export const OVEN: Slot[] = [
  { time: '6:00', mins: 360, items: 'Pav and white bread' },
  { time: '8:00', mins: 480, items: 'Egg puffs and veg puffs' },
  { time: '10:30', mins: 630, items: 'Banana cake and plum cake' },
  { time: '12:30', mins: 750, items: 'Beef and chicken rolls' },
  { time: '15:00', mins: 900, items: 'Unnakaya and pazhampori' },
  { time: '17:00', mins: 1020, items: 'Cutlets and samosas' },
  { time: '19:00', mins: 1140, items: 'Parotta, hot off the tava' },
]

export type Item = { id: string; name: string; note: string; price: number }
export const MENU: { group: string; items: Item[] }[] = [
  {
    group: 'From the oven',
    items: [
      { id: 'pav', name: 'Pav, 4 pieces', note: 'Soft, pulled apart by hand', price: 30 },
      { id: 'bread', name: 'White bread loaf', note: 'Baked at 6 and again at noon', price: 45 },
      { id: 'eggpuff', name: 'Egg puff', note: 'Masala egg in flaky pastry', price: 22 },
      { id: 'plumcake', name: 'Plum cake slice', note: 'Soaked in rum and spice since October', price: 55 },
      { id: 'bananacake', name: 'Banana cake slice', note: 'Made with ripe nendran', price: 40 },
    ],
  },
  {
    group: 'From the tava and fryer',
    items: [
      { id: 'pazham', name: 'Pazhampori, 2 pieces', note: 'Best eaten within ten minutes', price: 30 },
      { id: 'unnakaya', name: 'Unnakaya', note: 'Sweet plantain with coconut and cardamom', price: 25 },
      { id: 'cutlet', name: 'Beef cutlet', note: 'Crumbed and fried to order', price: 35 },
      { id: 'parotta', name: 'Parotta, 2 pieces', note: 'Layered and flaky after 7 pm', price: 36 },
    ],
  },
  {
    group: 'Tea and coffee',
    items: [
      { id: 'chaya', name: 'Kadum chaya', note: 'Strong, sweet, in a small glass', price: 12 },
      { id: 'sulaimani', name: 'Sulaimani', note: 'Black tea with lemon and clove', price: 15 },
      { id: 'kaapi', name: 'Filter kaapi', note: 'Pulled high so it cools as it pours', price: 18 },
    ],
  },
]

export const HOURS: { day: string; hours: string }[] = [
  { day: 'Monday', hours: '6 am to 9 pm' },
  { day: 'Tuesday', hours: '6 am to 9 pm' },
  { day: 'Wednesday', hours: '6 am to 9 pm' },
  { day: 'Thursday', hours: '6 am to 9 pm' },
  { day: 'Friday', hours: '6 am to 9 pm' },
  { day: 'Saturday', hours: '6 am to 10 pm' },
  { day: 'Sunday', hours: '7 am to 10 pm' },
]
