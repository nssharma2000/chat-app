import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios'

function App() {

  const [messages, setMessages] = useState([])

  const [conversations, setConversations] = useState([])

  const [conv_1, setConv1] = useState(null)
  const [conv_2, setConv2] = useState(null)
  
  const [currentConversation, setCurrentConversation] = useState(null)

  const [inputText, setInputText] = useState("")

  let backendUrl = "http://localhost:3001"


  useEffect(() => {

    async function handleFetchConversations() {
      await fetchConversations()
    }
    handleFetchConversations()
    }, [])

  async function fetchConversations()
  {
    try {
      const response = await axios.get(backendUrl + "/get_messages")
      setMessages(response.data.messages)
      setConversations(response.data.conversations)
    }
    catch (error) {
      console.error("Error fetching messages:", error);
    }
  }


  return (
    <div id="main_container" className="container text-center mx-auto w-[150vw] md:w-auto">
      <div id="wrapper" className="container text-center mx-auto w-[100%]">
        <div id="bg" className="container text-center mx-auto bg-slate-100 w-[100%]">
          <div className="mx-auto text-center grid grid-cols-7 md:grid-cols-5 gap-2 w-[100%]">
            <div className="mx-auto text-center flex flex-col justify-start items-center gap-4 w-[100%] col-start-1 col-end-3 md:w-[90%] md:col-start-1 md:col-end-2">
              <div className="mx-auto text-center text-2xl font-semibold w-[100%]">
                Chats
              </div>
              <div className={`mx-auto text-center flex justify-center items-center rounded-md ${currentConversation === conversations[0] ? "bg-slate-300" : "bg-slate-200"} w-[90%] py-2 px-3 cursor-pointer`} onClick={ () => setCurrentConversation(conversations[0])}>
                <div className="mx-auto flex justify-center items-center text-lg w-[90%]">
                  <div className="mx-auto flex text-center items-center text-lg justify-center w-10 h-10 p-4 rounded-full bg-purple-300">
                    { conversations[0]?.contactName[0].toUpperCase() }
                  </div>
                  <div className="mx-auto flex justify-center items-center">
                    { conversations[0]?.contactName }
                  </div>
                </div>
              </div>
              <div className={`mx-auto text-center flex justify-center items-center rounded-md ${currentConversation === conversations[1] ? "bg-slate-300" : "bg-slate-200"} w-[90%] py-2 px-3`} onClick={ () => setCurrentConversation(conversations[1])}>
                <div className="mx-auto flex justify-center items-center text-lg w-[90%]">
                  <div className="mx-auto flex text-center items-center text-lg justify-center w-10 h-10 p-4 rounded-full bg-purple-300">
                    { conversations[1]?.contactName[0].toUpperCase() }
                  </div>
                  <div className="mx-auto flex justify-center items-center">
                    { conversations[1]?.contactName }
                  </div>
                </div>
              </div>
              


            </div>

            <div className="mx-auto flex flex-col justify-start w-[99%] h-[99vh] col-start-3 col-end-8 md:col-start-2 md:col-end-6 bg-gradient-to-b from-slate-100 to-slate-200">
              {
                currentConversation ?
              <>
                <div className="mx-auto flex justify-around items-center w-[100%] bg-gray-300 h-[10vh]">
                  <div className="mx-auto flex justify-around items-center text-lg w-[90%]">
                    <div className="mx-auto flex text-center items-center text-lg justify-center w-10 h-10 p-4 rounded-full bg-purple-300">
                      { currentConversation?.contactName[0].toUpperCase() }
                    </div>
                    <div className="mx-auto flex flex-col justify-around items-center">
                      <div className="mx-auto flex justify-center items-center md:text-xl">
                      { currentConversation?.contactName }
                      </div>
                      <div className="mx-auto flex justify-center items-center text-sm md:text-md">
                      { "+" + currentConversation?.pNumber.substring(0, currentConversation?.pNumber.length - 10) + " " + currentConversation?.pNumber.substring(currentConversation?.pNumber.length - 10) }
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mx-auto flex flex-col justify-start items-center w-[100%] h-[90vh] overflow-y-scroll gap-4 justify-start">
                  {
                    messages.map((message, index) => {
                      if (message.conv_id === currentConversation._id) {
                        return (
                          <div key={index} className={`mx-auto flex justify-start items-center w-[100%] ${message.sender_wa_id === currentConversation.pNumber ? "bg-blue-200" : "bg-green-200"} p-2 rounded-md my-1`}>
                            <div className="mx-auto flex justify-start items-start text-sm md:text-lg w-[90%]">
                              <div className="mx-auto flex flex-col justify-start items-start">
                                { message.content }
                                <div className="mx-auto flex justify-end items-end text-xs md:text-sm text-gray-500">
                                  { `${message.status === null ? "" : String(message.status[0].toUpperCase() +(message.status.substring(1, ))) } ${new Date(parseInt(message.timestamp) * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` }
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      }
                      return null;
                    })
                  }
                </div>
                <div className="mx-auto flex justify-center items-center w-[100%] h-[10vh]">
                  <input value={ inputText } onChange={ (e) => setInputText(e.target.value) }className="mx-auto text-center flex justify-center items-center rounded-md bg-white w-[95%] py-2 px-3 outline-none focus:border focus:border-slate-300" placeholder="Send message" type="text" />
                  <button className="mx-auto text-center flex justify-center items-center rounded-md bg-blue-500 text-white px-3 h-[90%] ml-2" onClick={ async () => {
                    if (inputText.trim() !== "") {
                      const newMessage = {
                        wa_id: currentConversation.pNumber,
                        contactName: currentConversation.contactName,
                        content: inputText,
                        timestamp: new Date().getTime() / 1000,
                        conv_id: currentConversation._id,
                        status: "sent",
                        sender_wa_id: currentConversation.pNumber
                      };
                      let response = await axios.post(backendUrl + "/send_message", newMessage);
                      console.log("Message sent:", response.data);
                      setInputText("");
                      await fetchConversations();
                    }
                  }}>
                  Send
                  </button>
                </div>
              </>
              :
              <>
              </>
              }              
            </div>

            

          </div>
          
        </div>
      </div>
    </div>
  )
}

export default App
