const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express();
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.Promise = global.Promise;
mongoose.connect(process.env.DATABASE);

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());

// MODELS
const { User } =  require('./models/user');
const { Brand } =  require('./models/brand');
const { Wood } =  require('./models/wood');
const { Product } =  require('./models/product');

// Middlewares
const { auth } = require('./middleware/auth');
const { admin } = require('./middleware/admin');

// =======================================
//         PRODUCTS - GUITAR
// =======================================

// Products Shop Route with Filters/Search options
app.post('/api/product/shop', (req, res) => {
  let body = req.body

  // Additional args 
  let order = body.order ? body.order : 'desc';
  let sortBy = body.sortBy ? body.sortBy : '_id';
  // original args from the shop filters
  let limit = body.limit ? parseInt(body.limit) : 100;
  let skip = parseInt(body.skip);
  let findArgs = {};

  for(let key in body.filters) {
    if(body.filters[key].length > 0) {
      if(key === 'price') {
        findArgs[key] = {
          $gte: body.filters[key][0],
          $lte: body.filters[key][1]
        }
      } else {
        findArgs[key] = body.filters[key];
      }
    }
  }

  findArgs['publish'] = true;

  Product.
  find(findArgs).
  populate('brand').
  populate('wood').
  sort([[sortBy, order]]).
  skip(skip).
  limit(limit).
  exec((err, articles) => {
    if(err) return res.status(400).send(err);
    res.status(200).json({
      size: articles.length,
      articles
    })
  })


})


// Create Product API
app.post("/api/product/article", auth, admin, (req, res) => {
  const product = new Product(req.body);

  product.save((err, doc) => {
    if(err) return res.json({ success: false, err});
    res.status(200).json({
      success: true,
      article: doc
    });
  });
});

// Get Products by id API
app.get("/api/product/articles_by_id", (req, res) => {
  let type = req.query.type;
  let items = req.query.id;

  if( type === "array") {
    let ids = req.query.id.split(',');
    items = [];
    items = ids.map(item => {
      return mongoose.Types.ObjectId(item);
    })
  }

  Product.
  find({'_id': {$in: items}}).
  populate('brand').
  populate('wood').
  exec((err, doc) => {
    if(err) return res.status(400).send(err)
    res.status(200).send(doc)
  })

});

//SORTBY = ARRIVAL OR SOLD
// Home Latest Products Get Products by sortBy=(createdAt or sold)&order=desc&limit=4
app.get('/api/product/articles', (req, res) => {
  let order = req.query.order ? req.query.order : 'asc';
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  let limit = req.query.limit ? parseInt(req.query.limit) : 100;

  Product.
  find().
  populate('brand').
  populate('wood').
  sort([[sortBy, order]]).
  limit(limit).
  exec((err, articles) => {
    if(err) return res.status(400).send(err);
    res.status(200).send(articles)
  })
})


// =======================================
//                WOODS
// =======================================
// Create Wood API
app.post('/api/product/wood', auth, admin, (req, res) => {
  const wood = new Wood(req.body);

  wood.save((err, doc) => {
    if(err) return res.json({ success: false, err})
    res.status(200).json({
      success: true,
      wood: doc
    })
  })
});

// Get Woods API
app.get("/api/product/woods", (req, res) => {
  Wood.find({}, (err, woods) =>{
    if(err) return res.status(400).send(err);
    res.status(200).send(woods);
  })
});

// =======================================
//                BRANDS
// =======================================
// Create Brand API
app.post('/api/product/brand', auth, admin, (req, res) => {
  const brand = new Brand(req.body);

  brand.save((err, doc) => {
    if(err) return res.json({ success: false, err});
    res.status(200).json({
      success: true,
      brand: doc
    })
  })
})

// Get Brands API
app.get('/api/product/brands', (req, res) => {
  Brand.find({}, (err, brands) => {
    if(err) return res.status(400).send(err);
    res.status(200).send(brands)
  })
})


// =======================================
//                USERS
// =======================================

// Auth route
app.get('/api/users/auth', auth, (req, res) => {
  res.status(200).json({
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    cart: req.user.cart,
    history: req.user.history,
  })
})

// User registration
app.post('/api/users/register', (req, res) => {
  const user = new User(req.body);
  
  user.save((err, doc) => {
    if(err) return res.json({success: false, err});
    res.status(200).json({
      success: true
    })
  })
})

// Login
app.post('/api/users/login', (req, res) => {
  User.findOne({'email': req.body.email}, (err, user) => {
    if(!user) return res.json({loginSuccess: false, message: "Auth failed, email not found"});

    user.comparePassword(req.body.password, (err, isMatch) => {
      if(!isMatch) return res.json({loginSuccess: false, message: "Wrong password"});

      user.generateToken((err, user) => {
        if(err) return res.status(400).send(err);
        res.cookie('w_auth', user.token).status(200).json({
          loginSuccess: true
        })
      })
    })
  })
})

app.get('/api/users/logout', auth, (req, res) => {
  User.findOneAndUpdate(
    { _id: req.user._id },
    { token: "" },
    (err, doc) => {
      if(err) return res.json({ success: false, err});
      return res.status(200).send({
        success: true
      })
    }
  )
})

const port = process.env.PORT || 3002;

app.listen(port, () => {
  console.log(`Server running at ${port}`)
});