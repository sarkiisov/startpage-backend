import express from 'express'
import cors from 'cors'
import { dataURItoBlob, URLtoDataURI } from './utils/download.js'
import { getAppleTouchIconUrl, getAppStoreIconUrl } from './utils/icons.js'
import { getFileById, getFilesByOrigin, saveFiles } from './utils/db.js'

const app = express()
const port = 3000

app.use(cors())

app.get('/favicons', async (req, res) => {
  const { url } = req.query as { url: string }

  const { origin, href } = new URL(url)

  let files = getFilesByOrigin(origin)

  if (!files.length) {
    const icons = (await Promise.allSettled([getAppleTouchIconUrl(href), getAppStoreIconUrl(href)]))
      .filter((result) => result.status === 'fulfilled')
      .map((result) => result.value)

    saveFiles(origin, await Promise.all(icons.map(URLtoDataURI)))

    files = getFilesByOrigin(origin)
  }

  res.json(files.map((file) => file.id))
})

app.get('/files/:id', async (req, res) => {
  const { id } = req.params

  const { dataURI } = getFileById(parseInt(id))

  const blob = dataURItoBlob(dataURI)

  res.type(blob.type)
  blob.arrayBuffer().then((buf) => {
    res.send(Buffer.from(buf))
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
