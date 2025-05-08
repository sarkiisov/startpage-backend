import express from 'express'
import cors from 'cors'

import swaggerUi from 'swagger-ui-express'
import swaggerDocument from './swagger.json' with { type: 'json' }

import { Icon } from './utils/db.js'
import { dataURItoBlob, URLtoDataURI } from './utils/download.js'
import { getIconFetchers } from './utils/icons.js'
import { queryValidator } from './utils/middlewares.js'
import { envSchema, faviconsQuerySchema } from './utils/validators.js'

export const { PORT } = envSchema.parse(process.env)

const app = express()

app.use(cors())
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/favicons', queryValidator(faviconsQuerySchema), async (req, res) => {
  const { url } = req.query as { url: string }

  const { origin, href } = new URL(url)

  let iconIds = await Icon.findAll({ where: { origin }, attributes: ['id'] })

  if (!iconIds.length) {
    const icons = (await Promise.allSettled(getIconFetchers(href)))
      .filter((result) => result.status === 'fulfilled')
      .map((result) => result.value)

    const dataURIs = (await Promise.allSettled(icons.map(URLtoDataURI)))
      .filter((result) => result.status === 'fulfilled')
      .map((result) => result.value)

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

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
})
