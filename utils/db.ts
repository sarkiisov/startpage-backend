import { DatabaseSync } from 'node:sqlite'

const db = new DatabaseSync('database.db')

db.exec(`CREATE TABLE IF NOT EXISTS files (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  createdAt TEXT,
  origin TEXT,
  dataURI string
)`)

type DBFile = {
  id: number
  createdAt: string
  origin: string
  dataURI: string
}

export const saveFile = (origin: string, dataURI: string) => {
  const insert = db.prepare(`INSERT INTO files (createdAt, origin, dataURI) VALUES (?, ?, ?)`)

  insert.run(new Date().toISOString(), origin, dataURI)
}

export const saveFiles = (origin: string, dataURIs: string[]) => {
  dataURIs.forEach((file) => saveFile(origin, file))
}

export const getFilesByOrigin = (origin: string) => {
  const query = db.prepare(`SELECT * FROM files WHERE origin = '${origin}'`)

  return query.all() as DBFile[]
}

export const getFileById = (id: number) => {
  const query = db.prepare(`SELECT * FROM files WHERE id = ${id}`)

  return query.get() as DBFile | undefined
}
