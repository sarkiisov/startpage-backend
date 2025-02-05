import { JSDOM } from 'jsdom'
import { getDomainName } from './url.js'

export const getAppleTouchIconUrl = async (url: string): Promise<string> => {
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

export const getAppStoreIconUrl = async (url: string): Promise<string> => {
  const search = getDomainName(url)

  const text = await fetch(`https://www.apple.com/us/search/${search}?src=globalnav`).then(
    (response) => response.text()
  )

  const { document } = new JSDOM(text).window

  const image = document.querySelector('.rf-serp-explore-image') as HTMLImageElement

  if (!image) {
    throw new Error('App store app icon was not found')
  }

  return image.getAttribute('src')
}
