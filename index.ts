import express from 'express'
import cors from 'cors'
import { dataURItoBlob, URLtoDataURI } from './utils/download.js'
import { getAppleTouchIconUrl, getAppStoreIconUrl } from './utils/icons.js'
import { Icon } from './utils/db.js'

const app = express()
const port = 3000

app.use(cors())

app.get('/favicons', async (req, res) => {
  const { url } = req.query as { url: string }

  const { origin, href } = new URL(url)

  let iconIds = await Icon.findAll({ where: { origin }, attributes: ['id'] })

  if (!iconIds.length) {
    const icons = (await Promise.allSettled([getAppleTouchIconUrl(href), getAppStoreIconUrl(href)]))
      .filter((result) => result.status === 'fulfilled')
      .map((result) => result.value)

    const dataURIs = await Promise.all(icons.map(URLtoDataURI))

    await Icon.bulkCreate(dataURIs.map((dataURI) => ({ origin, dataURI })))

    iconIds = await Icon.findAll({ where: { origin }, attributes: ['id'] })
  }

  const flattenIconIds = iconIds.map(({ id }) => id)

  res.json(flattenIconIds)
})

app.get('/files/:id', async (req, res) => {
  const { id } = req.params

  const { dataURI } = await Icon.findOne({
    where: { id },
    attributes: ['dataURI']
  })

  const blob = dataURItoBlob(dataURI)

  res.type(blob.type)
  blob.arrayBuffer().then((buf) => {
    res.send(Buffer.from(buf))
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
