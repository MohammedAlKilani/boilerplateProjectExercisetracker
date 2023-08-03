const express = require('express')
const mongoose = require('mongoose')
const app = express()
const cors = require('cors')
require('dotenv').config()
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
let userScema = new mongoose.Schema({
   username: String ,
  description: String,
  duration: Number,
  date: String,
},{strict:false})
 let userModel = mongoose.model("users",userScema)
app.use(cors())
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});
app.post("/api/users",async(req,res)=>{
  // console.log(req.body)
let newUser = new userModel({username :req.body.username})
 let newUserData =  await newUser.save()
  res.json({username:newUserData.username , _id:newUserData._id})
  
})

app.get("/api/users",async (req,res)=>{
  
 let userArray =  await userModel.find().select({username:1 , _id:1})
  res.json(userArray)
  
})
app.post("/api/users/:_id/exercises",async (req,res)=>{
   // console.log(req.body.exercise)
  
  let date = new Date(req.body.date)
  if(date == "Invalid Date"){
    date = new Date()
  }
  
let userUpdate = await userModel.findByIdAndUpdate(req.params._id,{description:req.body.description,duration:req.body.duration,date:date.toDateString() },{new:true,strict:false})  
  res.json({username: userUpdate.username,
  description: userUpdate.description,
  duration: userUpdate.duration,
  date: userUpdate.date,
  _id: userUpdate._id   })
   
console.log(userUpdate)
  
})



const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
mongoose.connect(process.env.DBURL)
  .then(() => console.log('Connected!'));