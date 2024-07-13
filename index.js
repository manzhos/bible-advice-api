const express    = require('express')
const cors       = require('cors')
const bodyParser = require('body-parser')
const app        = express()
require('dotenv').config()

const PORT  = process.env.PORT || 3300
const DEBUG = process.env.DEBUG|| false 

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/test', (req, res) => res.send('Hello World'));

app.post('/api/advice', async (req, res) => {
  const { textQ } = req.body;

  const { GoogleGenerativeAI } = require("@google/generative-ai"),
        genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

  const preQuestion = 'Bible give me advice for my problem: ',
        magicWord   = ', please';

  async function findAnswer(q) {
    const question = preQuestion + q + magicWord;;
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});
    if (DEBUG) console.log('question:', question);

    try{
      const result = await model.generateContent([
        question,
        // {inlineData: {data: Buffer.from(fs.readFileSync('path/to/image.png')).toString("base64"), mimeType: 'image/png'}}
      ]);
      if (DEBUG) console.log(result.response.text());
      if(result.response.text()) res.status(200).json({message: result.response.text()});
      else res.status(200).json({message: "You problem is very difficult. You need to go to church."});
    } catch (error) {
      console.log('Error:', error);
      res.status(400).json({message: "Your god wants your money."})
    }
  }  

  if (DEBUG) console.log('request:', req.body);
  if(textQ && textQ !== '') await findAnswer(textQ);
  else res.status(200).json({message: "You don't type a problem."});
});

// start server
async function startServer() {
  app.listen(PORT, () => console.log(`App has been started on port ${PORT}...`));
}
startServer();
