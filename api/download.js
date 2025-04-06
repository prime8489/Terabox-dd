import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Only POST method allowed" });
  }

  const { url } = req.body;

  if (!url || !url.includes("terabox.com")) {
    return res.status(400).json({ success: false, error: "Invalid or missing Terabox link" });
  }

  try {
    const response = await axios.get(`https://terabox-dl.vercel.app/api?link=${encodeURIComponent(url)}`);

    const { name, size, download_url } = response.data;

    if (!download_url) {
      return res.status(500).json({ success: false, error: "Download link not found" });
    }

    return res.status(200).json({
      success: true,
      file_name: name,
      size,
      download_link: download_url
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Server error. Try again later.",
      details: error.message
    });
  }
}
