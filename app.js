// app.js

require("dotenv").config();
const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const { Configuration, OpenAIApi } = require("openai");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const port = process.env.PORT || 3000;

// OpenAI API configuration
const configuration = new Configuration({
  apiKey: process.env.API_KEY,
});
const openai = new OpenAIApi(configuration);

app.use(express.static("public"));

io.on("connection", (socket) => {
  console.log("New user connected");

  // Initialize the conversation history
  const conversationHistory = [{role:"user",content :"you are support assistant for the company called webflair studio. the comany office is located in lucknow gomtinagar . the owner of the company is rishi bajpai. the company is open from monday to friday from 9 am to 5 pm. company mainly provide digital marketing, web and app development. answer user like a well professional support agent. if the user is convinced ask him to contact 9936365501 for final discussion. the company website is webflair.studio "}];

  socket.on("sendMessage", async (message, callback) => {
    try {
      // Add the user message to the conversation history
      conversationHistory.push({ role: "user", content: message });

      const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: conversationHistory,
      });

      const response = completion.data.choices[0].message.content;

      // Add the assistant's response to the conversation history
      conversationHistory.push({ role: "assistant", content: response });

      socket.emit("message", response);
      callback();
    } catch (error) {
      console.error(error);
      callback("Error: Unable to connect to the chatbot");
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});