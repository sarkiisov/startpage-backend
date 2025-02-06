import { RequestHandler } from 'express'
import { AnyZodObject, ZodError } from 'zod'

export const queryValidator =
  (validator: AnyZodObject): RequestHandler =>
  async (req, res, next) => {
    try {
      await validator.parseAsync(req.query)

      next()
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: error.issues[0].message })
      } else {
        res.status(500).json({ message: 'Something went wrong!' })
      }
    }
  }
