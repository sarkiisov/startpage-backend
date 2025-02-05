import fetch from 'node-fetch'

export const URLtoDataURI = async (url: string): Promise<string> => {
  const response = await fetch(url)

  if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`)

  const blob = await response.blob()
  const buffer = Buffer.from(await blob.arrayBuffer())

  return 'data:' + blob.type + ';base64,' + buffer.toString('base64')
}

// reference https://stackoverflow.com/questions/12168909/blob-from-dataurl
export const dataURItoBlob = (dataURI: string): Blob => {
  const byteString = atob(dataURI.split(',')[1])

  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

  const ab = new ArrayBuffer(byteString.length)

  const ia = new Uint8Array(ab)

  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i)
  }

  const blob = new Blob([ab], { type: mimeString })

  return blob
}
