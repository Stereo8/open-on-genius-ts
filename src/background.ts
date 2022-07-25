import {Runtime} from 'webextension-polyfill'
import MessageSender = Runtime.MessageSender;
import * as Browser from 'webextension-polyfill'

console.log('hi')

const removeThese = [
  'official video',
  'music video',
  'official audio',
  'official',
  'video',
  'audio',
  'ft.',
  'feat.',
  'featuring',
  'prod.',
  'prod',
  '()',
  '[]',
  '-',
  'x',
]

Browser.runtime.onMessage.addListener(async (message, sender) => {
  let sanitizedName = ''

  if (message?.artistName) {
    sanitizedName = Object.values(message).join(' ')
  } else {
    sanitizedName = message?.songTitle.toLowerCase()
    removeThese.forEach((str) => {
      sanitizedName = sanitizedName.replace(str, '')
    })
  }

  await findOnGenius(sanitizedName, sender)
})

async function findOnGenius(sanitizedName: string, sender: MessageSender) {
  console.log(sanitizedName)
  const geniusToken =
    'Bearer PcPAfOlYQSjAYOvfNVHuj4vlHbGxAVzWF8xM8Ifja_fWeDdfjqSG8VwQlNqNJ5mF'
  const request = new Request(
    `https://api.genius.com/search?q=${sanitizedName}`,
    {
      method: 'GET',
      headers: {
        Authorization: geniusToken,
      },
      mode: 'cors',
    }
  )
  const response = await fetch(request)
  const json = await response.json()

  const songURL: string = json?.response?.hits[0]?.result?.url

  if (songURL) {
    console.log(sender)
    await Browser.tabs.create({url: songURL})
    await Browser.tabs.sendMessage(sender.tab.id, { stopSpin: true })
  } else {
    await Browser.tabs.sendMessage(sender.tab.id, { shake: true })
  }
}
