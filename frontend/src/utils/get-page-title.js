import defaultSettings from '@/settings'

const title = defaultSettings.title || 'Sport Complexx'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
