import React from 'react'
import { useMultiChatLogic, MultiChatSocket, MultiChatWindow } from 'react-chat-engine-advanced'
import Header from "@/components/customHeader/index"
import StandardMessageForm from "@/components/customMessageForms/StandardMessageForm"
import Ai from '@/components/customMessageForms/Ai'
import AiCode from '@/components/customMessageForms/AiCode'
import AiAssist from '@/components/customMessageForms/AiAssist'

const Chat = ({user,secret}) => {
    const chatProps = useMultiChatLogic(
        import.meta.env.VITE_PROJECT_ID,
        user,
        secret
    )
  return <div style={{ flexBasis: "100%"}}>
    <MultiChatSocket {...chatProps}></MultiChatSocket>
    <MultiChatWindow
        {...chatProps}
        style={{height: "100vh"}}
        renderChatHeader={(chat) => <Header chat={chat}></Header>} 
        renderMessageForm={(props) =>{
            if(chatProps.chat?.title.startsWith("AiChat_")){
                return <Ai props = {props} activeChat = {chatProps.chat} />
            }
            if(chatProps.chat?.title.startsWith("AiCode_")){
                return <AiCode props = {props} activeChat = {chatProps.chat} />
            }
            if(chatProps.chat?.title.startsWith("AiAssist_")){
                return <AiAssist props = {props} activeChat = {chatProps.chat} />
            }
            return (
                <StandardMessageForm props={props} activeChat={chatProps.chat} />
            )
        }}
        />    
  </div>  
}

export default Chat