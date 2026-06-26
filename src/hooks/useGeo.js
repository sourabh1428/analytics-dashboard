// Module-level cache — one fetch per page load, shared across all consumers
let cached = null
let promise = null

// Starter / Growth / Scale prices in local currency (approx. $0 / $9 / $29 USD)
const PRICE_MAP = {
  USD: [0, 9,      29],
  EUR: [0, 8,      27],
  GBP: [0, 7,      23],
  INR: [0, 749,    2499],
  JPY: [0, 1299,   4299],
  CAD: [0, 12,     39],
  AUD: [0, 14,     44],
  NZD: [0, 15,     48],
  BRL: [0, 47,     149],
  MXN: [0, 149,    499],
  CNY: [0, 65,     209],
  KRW: [0, 12900,  41900],
  SGD: [0, 12,     39],
  MYR: [0, 42,     135],
  PHP: [0, 499,    1599],
  IDR: [0, 149000, 475000],
  THB: [0, 319,    999],
  AED: [0, 33,     107],
  SAR: [0, 34,     109],
  EGP: [0, 449,    1449],
  ZAR: [0, 167,    537],
  NGN: [0, 14500,  46500],
  PKR: [0, 2499,   7999],
  BDT: [0, 999,    3199],
  PLN: [0, 37,     119],
  SEK: [0, 97,     309],
  NOK: [0, 97,     309],
  DKK: [0, 62,     199],
  CHF: [0, 8,      26],
  KES: [0, 1149,   3699],
}

const CURRENCY_MAP = {
  US: { symbol: '$',  code: 'USD' },
  CA: { symbol: 'CA$', code: 'CAD' },
  AU: { symbol: 'A$', code: 'AUD' },
  NZ: { symbol: 'NZ$', code: 'NZD' },
  GB: { symbol: '£',  code: 'GBP' },
  IN: { symbol: '₹',  code: 'INR' },
  JP: { symbol: '¥',  code: 'JPY' },
  CN: { symbol: '¥',  code: 'CNY' },
  KR: { symbol: '₩',  code: 'KRW' },
  BR: { symbol: 'R$', code: 'BRL' },
  MX: { symbol: 'MX$',code: 'MXN' },
  ZA: { symbol: 'R',  code: 'ZAR' },
  NG: { symbol: '₦',  code: 'NGN' },
  PK: { symbol: '₨',  code: 'PKR' },
  BD: { symbol: '৳',  code: 'BDT' },
  // Euro-zone countries
  DE: { symbol: '€', code: 'EUR' },
  FR: { symbol: '€', code: 'EUR' },
  IT: { symbol: '€', code: 'EUR' },
  ES: { symbol: '€', code: 'EUR' },
  NL: { symbol: '€', code: 'EUR' },
  BE: { symbol: '€', code: 'EUR' },
  PT: { symbol: '€', code: 'EUR' },
  AT: { symbol: '€', code: 'EUR' },
  IE: { symbol: '€', code: 'EUR' },
  FI: { symbol: '€', code: 'EUR' },
  GR: { symbol: '€', code: 'EUR' },
  PL: { symbol: 'zł', code: 'PLN' },
  SE: { symbol: 'kr', code: 'SEK' },
  NO: { symbol: 'kr', code: 'NOK' },
  DK: { symbol: 'kr', code: 'DKK' },
  CH: { symbol: 'CHF',code: 'CHF' },
  SG: { symbol: 'S$', code: 'SGD' },
  MY: { symbol: 'RM', code: 'MYR' },
  PH: { symbol: '₱',  code: 'PHP' },
  ID: { symbol: 'Rp', code: 'IDR' },
  TH: { symbol: '฿',  code: 'THB' },
  AE: { symbol: 'AED',code: 'AED' },
  SA: { symbol: 'SR', code: 'SAR' },
  EG: { symbol: 'E£', code: 'EGP' },
  KE: { symbol: 'KSh',code: 'KES' },
}

function countryToFlag(code) {
  if (!code || code.length !== 2) return ''
  return code
    .toUpperCase()
    .split('')
    .map((c) => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65))
    .join('')
}

async function fetchGeo() {
  const res = await fetch('https://ipapi.co/json/', { cache: 'no-store' })
  if (!res.ok) throw new Error('geo failed')
  const data = await res.json()
  const currency = CURRENCY_MAP[data.country_code] ?? { symbol: '$', code: 'USD' }
  const prices = PRICE_MAP[currency.code] ?? PRICE_MAP.USD
  return {
    countryCode: data.country_code ?? 'US',
    countryName: data.country_name ?? 'the world',
    city: data.city ?? '',
    flag: countryToFlag(data.country_code),
    currencySymbol: currency.symbol,
    currencyCode: currency.code,
    prices,
  }
}

import { useEffect, useState } from 'react'

export function useGeo() {
  const [geo, setGeo] = useState(cached)

  useEffect(() => {
    if (cached) { setGeo(cached); return }
    if (!promise) promise = fetchGeo().then((g) => { cached = g; return g }).catch(() => null)
    promise.then((g) => { if (g) setGeo(g) })
  }, [])

  return geo
}
