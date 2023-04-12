const { Configuration, OpenAIApi } = require("openai");
const express = require('express')
const app = express()
require('dotenv').config()
const configuration = new Configuration({
  apiKey: process.env.API_KEY,
});
console.log(process.env.API_KEY);
const openai = new OpenAIApi(configuration);

const completionFunction = async () => {
  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: "The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly.\n\nHuman: Hello, who are you?\nAI: I am an AI created by OpenAI. How can I help you today?\nHuman: I'd like to cancel my subscription.\nAI:",
    temperature: 0.9,
    max_tokens: 150,
    top_p: 1,
    frequency_penalty: 0.0,
    presence_penalty: 0.6,
    stop: ["Sir", "Oh Toodles"],
  });
  
  console.log(completion.data.choices[0].text);
};

completionFunction();

app.get('/', function (req, res) {
  res.send('Hello World')
})

app.listen(3000)
