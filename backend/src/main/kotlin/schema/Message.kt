package schema

import kotlinx.serialization.Contextual
import kotlinx.serialization.Serializable


@Serializable
data class Message(
    val senderUid: String,
    val content: String,
    @Contextual
    val timeStamp: String,
    val status: MessageStatus,
)

enum class MessageStatus(val code: Int) {
    Sent(0),
    Received(1),
    Read(2);
}