import axios from "axios"

export default async function getSessionToken(_ = null) {
  const sessionToken = await axios.post("https://api.mathpix.com/v3/app-tokens", "", {
    headers: {
      app_key: process.env.MATHPIX_APP_KEY,
    },
  })

  return sessionToken.data
}
