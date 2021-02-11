export default {
  mongoUrl: process.env.MONGO_URL as string || 'mongodb://localhost:27017/clean-node-api',
  port: process.env.PORT as string || '3333',
  jwtSecret: process.env.JWT_SECRET as string || 'secret'
}
