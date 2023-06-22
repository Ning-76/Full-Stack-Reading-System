import app from "./server.js"
import mongodb from "mongodb"
import ReviewsDAO from "./dao/ReviewsDAO.js"

const MongoClient = mongodb.MongoClient
const mongo_username = process.env['MONGO_USERNAME']
const mongo_password = process.env['MONGO_PASSWORD']
const url= 'mongodb+srv://BookReview:JRLNPHeEfMmTneOY@cluster0.kbluqbp.mongodb.net/?retryWrites=true&w=majority'


const port = 8000

MongoClient.connect(
  url,
  {
    maxPoolSize:50,
    wtimeoutMS:2500,
    useNewUrlParser:true
  })
.catch(err =>{console.error(err.stack)
             process.exit(1)
             })
             .then(async client => {
              await ReviewsDAO.injectDB(client)
               app.listen(port,()=>{
                 console.log('listening on port ${port}');
               })
             })