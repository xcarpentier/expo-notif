const axios = require('axios')
;(async function test() {
  const commit = 'test'
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    'https://xaviercarpentier.com',
  )}`
  const expoUrl = 'https://xaviercarpentier.com'
  await axios({
    method: 'POST',
    url:
      'https://hooks.slack.com/services/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',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: `payload=${encodeURIComponent(
      JSON.stringify({
        text: `*Watchdog-System* APP for _${commit}_ has been *deployed*`,
        channel: 'watchdog-system',
        username: 'bot',
        icon_emoji: ':iphone:',
        attachments: [
          {
            color: '#36a640',
            title: `Link to the new ${commit} app version`,
            title_link: expoUrl,
            image_url:
              'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://xaviercarpentier.com',
            ts: new Date().getTime() / 1000,
          },
        ],
      }),
    )}`,
  }).catch(err => console.error(err.response.data))
})()
