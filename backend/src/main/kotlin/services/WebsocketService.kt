package services

import io.ktor.websocket.*
import kotlinx.coroutines.*
import kotlinx.serialization.json.Json
import org.litote.kmongo.json
import org.slf4j.LoggerFactory
import schema.*
import java.util.*

class WebsocketService(private val userService: UserService, private val chatService: ChatService) {
    private val socketSessionsCollection = Collections.synchronizedMap<String, DefaultWebSocketSession>(LinkedHashMap())
    private val logger = LoggerFactory.getLogger("Websocket service")

    suspend fun onStartConnection(uid: String, session: DefaultWebSocketSession) {
        val user = userService.getUser(uid)
        if (!socketSessionsCollection.containsKey(uid) && user != null) {
            socketSessionsCollection[uid] = session
            notification("userLogIn", user)
        } else {
            session.close(CloseReason(CloseReason.Codes.VIOLATED_POLICY, "UID already connected or user not found"))
        }
    }

    suspend fun incomingFrame(uid: String, frame: String) {
        try {
            val webSocketFrame = Json.decodeFromString<IncomingWebSocketFrame>(frame)
            when (webSocketFrame.typeOf) {
                "sendMessage" -> handleSendMessage(uid, webSocketFrame.frame)
                "messageReceived" -> notificationUser(
                    webSocketFrame.frame.receivedUid,
                    "messageReceived",
                    webSocketFrame.frame
                )
            }
        } catch (e: Exception) {
            logger.error("Error processing frame: ${e.message}")
        }
    }

    private suspend fun handleSendMessage(uid: String, frame: MessageWebSocketFrame) {
        withContext(Dispatchers.IO) {
            if (frame.content != null && frame.timeStamp != null) {
                val message = Message(uid, frame.content, frame.timeStamp, MessageStatus.Sent)
                chatService.addMessage(frame.chatUid, message)
                notificationUser(frame.receivedUid, "sendMessage", message)
            } else {
                logger.warn("Received incomplete message frame: $frame")
            }
        }
    }

    suspend fun disconnect(uid: String, session: DefaultWebSocketSession) {
        withContext(Dispatchers.IO) {
            session.close()
            socketSessionsCollection.remove(uid)
            logger.info("Disconnected session for UID: $uid")
            delay(5000)
            if (!socketSessionsCollection.containsKey(uid)) {
                logger.info("Deleting data for UID: $uid")
                notification("userLogOut", uid)
                chatService.deleteUserChats(uid)
                userService.deleteUser(uid)
            }
        }
    }

    private suspend fun notification(message: String, frame: Any) {
        withContext(Dispatchers.IO) {
            when (message) {
                "userLogIn", "userLogOut" -> notificationAllUsers(message, frame)
            }
        }
    }

    private suspend fun notificationUser(userReceivedUid: String, message: String, frame: Any) {
        CoroutineScope(Dispatchers.IO).launch {
            try {
                logger.info("Sending notification to user: $userReceivedUid")
                socketSessionsCollection[userReceivedUid]?.send(Frame.Text(WebSocketFrame(message, frame).json))
            } catch (e: Exception) {
                logger.error("Error sending message: ${e.message}")
            }
        }
    }

    private suspend fun notificationAllUsers(message: String, frame: Any) {
        socketSessionsCollection.forEach { (uid, session) ->
            CoroutineScope(Dispatchers.IO).launch {
                try {
                    session.send(Frame.Text(WebSocketFrame(message, frame).json))
                } catch (e: Exception) {
                    logger.error("Error sending message to user $uid: ${e.message}")
                }
            }
        }
    }
}