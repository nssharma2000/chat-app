const con_1_msg_1 = require('./payloads/con_1_msg_1.json')
const con_1_msg_2 = require('./payloads/con_1_msg_2.json')
const con_1_status_1 = require('./payloads/con_1_status_1.json')
const con_1_status_2 = require('./payloads/con_1_status_2.json')
const con_2_msg_1 = require('./payloads/con_2_msg_1.json')
const con_2_msg_2 = require('./payloads/con_2_msg_2.json')
const con_2_status_1 = require('./payloads/con_2_status_1.json')
const con_2_status_2 = require('./payloads/con_2_status_2.json')
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Conversation = require('./models/conversationModel');
const Message = require('./models/messageModel'); 

const app = express();
app.use(cors());
app.use(express.json());


mongoose.connect("mongodb+srv://nssharma2000:nama1234@whatsapp.ssz515h.mongodb.net/?retryWrites=true&w=majority&appName=whatsapp")
  .then(() => {
    console.log("Connected to MongoDB")
  })
.catch( (error) => {
  console.log(error)
})


function processGivenMessages() {
    Promise.all([
    Message.updateOne({ _id: con_1_msg_1.metaData.entry[0].changes[0].value.messages[0].id }, { $set: { wa_id: con_1_msg_1["metaData"]["entry"][0]["changes"][0]["value"]["contacts"][0]["wa_id"],
      contactName: "Ravi Kumar", content: con_1_msg_1["metaData"]["entry"][0]["changes"][0]["value"]["messages"][0]["text"]["body"], timestamp: con_1_msg_1["metaData"]["entry"][0]["changes"][0]["value"]["messages"][0]["timestamp"],
      conv_id: 1, status: null, sender_wa_id: con_1_msg_1["metaData"]["entry"][0]["changes"][0]["value"]["messages"][0]["from"]}}, { upsert: true }),
    
    Message.updateOne({ _id: con_1_msg_2.metaData.entry[0].changes[0].value.messages[0].id }, { $set: { wa_id: con_1_msg_2["metaData"]["entry"][0]["changes"][0]["value"]["contacts"][0]["wa_id"],
        contactName: "Ravi Kumar", content: con_1_msg_2["metaData"]["entry"][0]["changes"][0]["value"]["messages"][0]["text"]["body"], timestamp: con_1_msg_2["metaData"]["entry"][0]["changes"][0]["value"]["messages"][0]["timestamp"],
        conv_id: 1, status: con_1_status_2["metaData"]["entry"][0]["changes"][0]["value"]["statuses"][0]["status"], sender_wa_id: con_1_msg_2["metaData"]["entry"][0]["changes"][0]["value"]["messages"][0]["from"]}}, { upsert: true }),

    Message.updateOne({ _id: con_2_msg_1.metaData.entry[0].changes[0].value.messages[0].id }, { $set: {wa_id: con_2_msg_1["metaData"]["entry"][0]["changes"][0]["value"]["contacts"][0]["wa_id"],
      contactName: "Neha Joshi", content: con_2_msg_1["metaData"]["entry"][0]["changes"][0]["value"]["messages"][0]["text"]["body"], timestamp: con_2_msg_1["metaData"]["entry"][0]["changes"][0]["value"]["messages"][0]["timestamp"],
      conv_id: 2, status: con_2_status_1["metaData"]["entry"][0]["changes"][0]["value"]["statuses"][0]["status"], sender_wa_id: con_2_msg_1["metaData"]["entry"][0]["changes"][0]["value"]["messages"][0]["from"]}}, { upsert: true }),
    
    Message.updateOne({ _id: con_2_msg_2.metaData.entry[0].changes[0].value.messages[0].id }, { $set: { wa_id: con_2_msg_2["metaData"]["entry"][0]["changes"][0]["value"]["contacts"][0]["wa_id"],
        contactName: "Neha Joshi", content: con_2_msg_2["metaData"]["entry"][0]["changes"][0]["value"]["messages"][0]["text"]["body"], timestamp: con_2_msg_2["metaData"]["entry"][0]["changes"][0]["value"]["messages"][0]["timestamp"],
        conv_id: 2, status: con_2_status_2["metaData"]["entry"][0]["changes"][0]["value"]["statuses"][0]["status"], sender_wa_id: con_2_msg_2["metaData"]["entry"][0]["changes"][0]["value"]["messages"][0]["from"]}}, { upsert: true }),

    Conversation.updateOne({ _id: 1 }, { $set : {
        contactName: "Ravi Kumar",
        pNumber: con_1_msg_1["metaData"]["entry"][0]["changes"][0]["value"]["contacts"][0]["wa_id"] }}, { upsert: true }),
    
    Conversation.updateOne({ _id: 2 }, { $set : {
        contactName: "Neha Joshi",
        pNumber: con_2_msg_1["metaData"]["entry"][0]["changes"][0]["value"]["contacts"][0]["wa_id"] }}, { upsert: true }), 
    ])          
}




app.get("/get_messages", async (req, res) => {

    processGivenMessages()
    
    const convos = await Conversation.find().sort({ _id: 1 })
    const messages = await Message.find().sort({ timestamp: 1 })

    res.json({ messages, conversations: convos });
})

app.post("/send_message", async (req, res) => {
    const { wa_id, contactName, content, timestamp, conv_id, status, sender_wa_id } = req.body;
    const newMessage = await Message.create({
        _id: new Date().getTime().toString(),
        wa_id,
        contactName,
        content,
        timestamp,
        conv_id,
        status,
        sender_wa_id
    })

    res.json(newMessage);
})

app.listen(3001, () => console.log(`Server running.`));