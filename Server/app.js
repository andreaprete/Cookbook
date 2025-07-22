const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
var cors = require('cors')
const swaggerDocs = require("./swagger.js")
const dotenv = require("dotenv");
dotenv.config();

const initDatabaseConnection = require('./dbConnection.js');



const app = express();


app.use(cors({
  origin:"http://localhost:5173",
  credentials:true
}))

//default port
let port =3030;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
app.use(cookieParser());


app.use('/images', express.static(__dirname + '/images'));


initDatabaseConnection(process.argv[2]);


require('./routes/session/session')(app);

switch (process.argv[2]){
  case "shop":
    require('./routes/shop/routes')(app);
    break;
  case "fastfood":
    require('./routes/fastfood/routes')(app);
    break;
  case "fitness":
    require('./routes/fitness/routes')(app);
    break;
  case "carrental":
    require('./routes/carrental/routes')(app);
    break;
  case "cookbook":
    require('./routes/cookbook/routes')(app);
    break;
  default:
    app.get('/', (req, res) => {
      res.send('something went wrong');
    });
}
swaggerDocs(app,port)
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});




