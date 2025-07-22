const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Projekt Server',
      description: "Server für die Abschlussprojekte",
      contact: {
        name: "Manuel Fehrenbach",
        email: "manuel.fehrenbach@hfu.eu",
      },
      version: '1.0.0',
    },
    servers: [
      {
        url: "http://localhost:3030/",
        description: "Server"
      }
    ]
  },
  // looks for configuration in specified directories
  apis: ['./routes/*/*.js'],
}
const swaggerSpec = swaggerJsdoc(options)
function swaggerDocs(app, port) {
  // Swagger Page
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
  // Documentation in JSON format
  app.get('/docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    res.send(swaggerSpec)
  })
}
module.exports = swaggerDocs