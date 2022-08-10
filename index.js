const express = require('express');
const mongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/records";
const bodyParser = require('body-parser');
const app = express();
const port = 5000;

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended:true }))

mongoClient.connect(url, function(err, data){
    if(err) throw err;

    console.log('Database connected successfully')
})


app.get('/', function(req,res){
    res.send('<h1>Hello World !</h1>')
})


app.post('/insert', function (req, res) {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
    //   gender: req.body.gender,
    //   password: req.body.password,
    //   phone: req.body.phone
    })
  
    User.find({ email: req.body.email })
      .then(data => {
        if (data.length != 0) {
          return res.json({ message: "Email already exists" })
        }
        else {
          user.save((err, data) => {
            // console.log('USER', user.name)         
            if (err) {
              console.log(err)
            }
            //res.json('data inserted successfully')
            res.status(200).json({ message: "Data inserted successfully", data: data });
          })
        }
      })
  })

app.listen(port, ()=>{
    console.log('server is running at port', port)
})
