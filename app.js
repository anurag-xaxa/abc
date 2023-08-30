const express = require('express');
const mongoose = require('mongoose')
const url = "mongodb://localhost:27017/records";
const User = require('./models/userSchema')

const app = express();
const port = 6000;

app.use(express.json())
app.use(express.urlencoded({ extended:false }))

mongoose.connect(url)


app.get('/', function(req,res){
    res.send('<h1>Hello World !</h1>')
})


app.post('/insert', async(req, res) => {
    const user = await new User({
      name: req.body.name,
      email: req.body.email,
    })
    user.save()
    .then((err, data) => {
      if(err){
        console.log(err)
      }
      res.status(200).json({message:"new user registered", data:data})
    })
  })

  
  app.get('/findAll', (req, res) => {
    User.find()
    .then((err, data) => {
      if(err){
        console.log(err)
      }
      res.status(200).json({message:"data found", data:data})
    })
  })


  
  app.get('/findById/:id', (req, res) => {
    // const id = req.params.id;
    User.findById(req.params.id)
    .then((err, data) => {
      if(err){
        console.log(err)
      }
      res.status(200).json({message:"data found", data:data})
    })
  })


  app.put('/update/:id', (req, res) => {
    User.findByIdAndUpdate(req.params.id, {
      $set: {
        name: req.body.name,
        email: req.body.email
      }
    },{new:true})
    .then((err, data) => {
      if(err){
        console.log(err)
      }
      res.status(200).json({message:"user data updated", data:data})
    })
  })

 app.delete('/delete/:id', (req, res) => {
    User.findByIdAndDelete(req.params.id)
    .then((err, data) => {
      if(err)
        throw err
      
      res.status(200).json({message:"user data deleted", data:data})
    })
 })
 

 
  app.listen(port, ()=>{
    console.log('server is running at port', port)
})
