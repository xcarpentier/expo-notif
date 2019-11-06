const { send, json } = require('micro')
const microCors = require('micro-cors')
const cors = microCors()
const { Expo } = require('expo-server-sdk')

const handler = async function(req, res) {
  try {
    const { tokens, body } = await json(req)
    const expo = new Expo()
    const messages = []
    for (const pushToken of tokens) {
      // Check that all your push tokens appear to be valid Expo push tokens
      if (!Expo.isExpoPushToken(pushToken)) {
        console.warn(`Push token ${pushToken} is not a valid Expo push token`)
        continue
      }

      // Construct a message (see https://docs.expo.io/versions/latest/guides/push-notifications.html)
      messages.push({
        to: pushToken,
        body,
        data: { withSome: 'data' },
      })
    }
    const chunks = expo.chunkPushNotifications(messages)
    const tickets = []
    ;(async () => {
      // Send the chunks to the Expo push notification service. There are
      // different strategies you could use. A simple one is to send one chunk at a
      // time, which nicely spreads the load out over time:
      for (const chunk of chunks) {
        try {
          const ticketChunk = await expo.sendPushNotificationsAsync(chunk)
          console.log(ticketChunk)
          tickets.push(...ticketChunk)
          // NOTE: If a ticket contains an error code in ticket.details.error, you
          // must handle it appropriately. The error codes are listed in the Expo
          // documentation:
          // https://docs.expo.io/versions/latest/guides/push-notifications#response-format
        } catch (error) {
          console.error(error)
        }
      }
    })()
  } catch (error) {
    return error.message
  }
  send(res, 200, 'ok')
}

module.exports = cors(handler)
