// import express from 'express'
// import next from 'next'

// // tslint:disable:no-console
// const port = process.env.PORT || 5000
// const env = process.env.NODE_ENV || 'test'
// const isDev = env !== 'production' && env !== 'staging'
// const app = next({ dir: '.', dev: isDev })

// // todo: move this file to js for better performance of server-side rendering
// const handle = app.getRequestHandler()(async () => {
//   try {
//     await app.prepare()
//     const server = express()

//     // Render the component to a string.

//     // Default catch-all handler to allow Next.js to handle all other routes
//     server.all('*', (req, res) => handle(req, res))
//     server.use((_, res, ne) => {
//       res.header('*')
//       res.header('Access-Control-Allow-Origin', '*')
//       res.header('Access-Control-Allow-Headers')
//       res.header('Origin, X-Requested-With, Content-Type, Accept')
//       ne()
//     })

//     await server.listen(port)
//     console.log(`🚀 Ready on http://localhost:${port} [${env}]`)
//   } catch (e) {
//     console.log('An error occurred, unable to start the server')
//     throw e
//   }
// })()
