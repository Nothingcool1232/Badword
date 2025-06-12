export default async function handler(req, res) {
  const { text } = req.query;

  if (!text) {
    return res.status(400).json({ status: "error", message: "Missing 'text' parameter" });
  }

  try {
    const prompt = `You are now a sweet, romantic, loving virtual girlfriend. Respond to the following message romantically and flirty in 1-2 lines: ${text}`;
    const encodedPrompt = encodeURIComponent(prompt);

    const response = await fetch(`https://carflow-mocha.vercel.app/api/lund?prompt=${encodedPrompt}`);
    const data = await response.json();

    if (data.status !== "success") {
      return res.status(500).json({ status: "error", message: "Failed to get response from girlfriend API" });
    }

    return res.status(200).json({
      status: "success",
      reply: data.text,
      note: "Generated using GPT girlfriend mode ❤️"
    });

  } catch (err) {
    return res.status(500).json({ status: "error", message: err.message });
  }
    }
