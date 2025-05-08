import { JSDOM } from 'jsdom'
import { getDomainName } from './url.js'

type IconFetcher = (url: string) => Promise<string>

const getAppleTouchIconUrl: IconFetcher = async (url) => {
  const text = await fetch(url, { redirect: 'follow' }).then((response) => response.text())

  const { document } = new JSDOM(text).window

  const link = Array.from(document.querySelectorAll('link[rel="apple-touch-icon"]')).at(-1)

  if (!link) {
    throw new Error('Apple touch icon was not found')
  }

  const { origin } = new URL(url)
  const { href } = link as HTMLLinkElement

  return href.startsWith('/') ? `${origin}${href}` : href
}

const getAppStoreIconUrl: IconFetcher = async (url) => {
  const search = getDomainName(url)

  const text = await fetch(`https://www.apple.com/us/search/${search}?src=globalnav`).then(
    (response) => response.text()
  )

  const { document } = new JSDOM(text).window

  const image = document.querySelector('.rf-serp-explore-image') as HTMLImageElement

  if (!image) {
    throw new Error('App Store app icon was not found')
  }

  return image.getAttribute('src')
}

const getPlayMarketIconUrl: IconFetcher = async (url) => {
  const search = getDomainName(url)

  const text = await fetch(`https://play.google.com/store/search?q=${search}&c=apps&hl=en`).then(
    (response) => response.text()
  )

  const { document } = new JSDOM(text).window

  const image = document.querySelector(`img[alt="Icon image"]`) as HTMLImageElement

  if (!image) {
    throw new Error('Play Market icon was not found')
  }

  return image.getAttribute('src')
}

export const getIconFetchers = (url: string): ReturnType<IconFetcher>[] =>
  [getAppleTouchIconUrl, getAppStoreIconUrl, getPlayMarketIconUrl].map((func) => func(url))
