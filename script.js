const express = require("express"); //lib in nodejs to simplyfy the app cuilding process
const mongoose = require("mongoose"); //to use mongoDB
const bodyParser = require("body-parser"); //to make the client-side data readable
const dotenv = require("dotenv"); //to hide passwords
const path = require("path");
//const router = express.Router();
//const {marked} = require('marked');
//const slugify = require('slugify');
//const createDomPurify = require('dompurify');
//const {JSDOM} = require('jsdom');
//const dompurify = createDomPurify(new JSDOM().window)
var methodOverride = require('method-override');

const app = express(); //instance of express
dotenv.config();

const port = process.env.PORT || 8080;

const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;

mongoose.connect('mongodb+srv://' + username + ':' + password + '@cluster0.fr4ar5d.mongodb.net/Portfolio', {
    useNewUrlParser: true, //for warnings
    useUnifiedTopology: true,
});

const PortfolioSchema = new mongoose.Schema({
    name: String,
    message: String,
    createdAt:{
        type:Date,
        default: Date.now
    }

});

const Portfolio = mongoose.model("Portfolio", PortfolioSchema);

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(express.static(path.join(__dirname, 'public')))
app.use(methodOverride('_method')) //for delete override



app.get('/', async(req, res) => {
    const articles = await Portfolio.find().sort({createdAt:'desc'})
    res.render('index', {articles:articles});
});

app.post("/addRecommendation", async (req, res) => {
    try {
        const { name, message } = req.body;
        const RecommendationData = new Portfolio({
            name,
            message
        });
        await RecommendationData.save();
        res.redirect('/');
    }
    catch (error) {
        console.log(error);
    }
})

app.listen(port, () => {
    console.log('server is running the port successfully on port ' + port);
})