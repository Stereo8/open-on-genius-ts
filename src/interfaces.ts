export interface BackgroundToPageMessage {
  stopSpin: boolean
  shake: boolean
}

export interface PageToBackgroundMessage {
  songTitle: string
  artistName?: string
}
