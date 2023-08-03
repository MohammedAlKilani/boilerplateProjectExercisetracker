const express = require('express')
const mongoose = require('mongoose')
const app = express()
const cors = require('cors')
require('dotenv').config()
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
let exerciseScema = new mongoose.Schema({
   user_id: String ,
  description: String,
  duration: Number,
  date: Date ,
},{strict:false})
 let exerciseModel = mongoose.model("exercises",exerciseScema)
let userScema = new mongoose.Schema({
   username: String ,
  description: String,
  duration: Number,
  date: Date 
},{strict:false})
 let userModel = mongoose.model("users",userScema)
app.use(cors())
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});
app.post("/api/users",async(req,res)=>{

let newUser = new userModel({username :req.body.username})
 let newUserData =  await newUser.save()
  res.json({username:newUserData.username , _id:newUserData._id})
  
})

app.get("/api/users",async (req,res)=>{
  
 let userArray =  await userModel.find().select({username:1 , _id:1})
  res.json(userArray)
  
})
app.post("/api/users/:_id/exercises",async (req,res)=>{

  
  let date = new Date(req.body.date)
  if(date == "Invalid Date"){
    date = new Date()
  }
  
let userUpdate = await userModel.findByIdAndUpdate(req.params._id,{description:req.body.description,duration:req.body.duration,date:date.toDateString() },{new:true,strict:false})
let newExercis = new exerciseModel({user_id: req.params._id ,description: req.body.description,duration: req.body.duration,date: date.toDateString()})
  await newExercis.save()
res.json({username: userUpdate.username,
  description: userUpdate.description,
  duration: userUpdate.duration,
  date: userUpdate.date.toDateString(),
  _id: userUpdate._id   })
   

  
})

app.get("/api/users/:_id/logs",async(req,res)=>{
  let user
  let log
  let exercis
   let exercisLogArr=[]
    console.log(req.query)
const limit = req.query.limit ? req.query.limit : 0
  if(req.query.from&&req.query.to){
    exercis = await exerciseModel.find({user_id:req.params._id}).limit(limit)
  user = await userModel.find({ _id: req.params._id}).limit(limit)
  exercis.forEach((exe)=>{
     exercisLogArr.push({
      description: exe.description,
    duration: exe.duration,
    date: exe.date.toDateString() ,
    }) 
  })
  }else{
  // {date:{$gte:"1990-03-01",$lte:"2022-05-05"}}
  user = await userModel.find({ _id: req.params._id}).limit(limit)
  exercis = await userModel.find({ _id: req.params._id}).limit(limit)
      exercis.forEach((exe)=>{
    exercisLogArr.push({
      description: exe.description,
    duration: exe.duration,
    date: exe.date.toDateString() ,
    }) 
   
     })
 
  
}
  
   
    console.log(exercisLogArr)
  if(user){
   let{username,_id,description,duration,date}=user[0]
     res.json( {username,count: exercisLogArr.length, _id,log:exercisLogArr
                

               })
      
                

      
  }})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
mongoose.connect(process.env.DBURL)
  .then(() => console.log('Connected!'));