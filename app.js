const express = require('express');
const mongoose = require('mongoose')
const url = "mongodb://localhost:27017/records";
const User = require('./models/userSchema')
const nodemailer = require("nodemailer");

const app = express();
const port = 6000;

app.use(express.json())
app.use(express.urlencoded({ extended:false }))

mongoose.connect(url)


// # Email
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST, 
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASS,
    },
  });

// # Routes
app.post('/email', async(req, res) => {
  
  const { email, subject, message } = req.body;
  console.log("Message sent", email, subject, message);  
  
  var mailOptions = {
    from: process.env.SMTP_EMAIL,
    to: "email", 
    subject: subject, 
    message: message,     
  }

  transporter.sendMail(mailOptions, function (error, data){
    if(error){
      console.log(error)
    }
    else {
      console.log("Email sent succesfully", data)
    }
  })
})

  


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
