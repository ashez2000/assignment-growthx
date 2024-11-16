import http from 'node:http'
import mongoose from 'mongoose'
import app from './app.js'

const port = process.env.PORT || 3000
const mongoDbUri =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/assignment-growthx'

async function main() {
  try {
    const conn = await mongoose.connect(mongoDbUri)
    console.log('Connected to mongoDb:', conn.connection.host)

    const server = http.createServer(app)
    server.listen(port, () => {
      console.log('Listening on port:', port)
    })
  } catch (err) {
    console.log(err)
    process.exit(1)
  }
}

main()
