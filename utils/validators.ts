import { z } from 'zod'

export const faviconsQuerySchema = z.object({
  url: z.string({ required_error: 'URL is required' }).url('URL is not valid')
})

export const envSchema = z.object({
  PORT: z.coerce.number()
})
