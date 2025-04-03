import swaggerAutogen from 'swagger-autogen'

const doc = {
  info: {
    title: 'startpage-backend API',
    description: 'Automatic favicon fetching service'
  }
}

const outputFile = './swagger.json'
const routes = ['./dist/index.js']

swaggerAutogen()(outputFile, routes, doc)
