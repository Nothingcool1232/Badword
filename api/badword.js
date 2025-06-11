export default async function handler(req, res) {
  const { text } = req.query;

  if (!text) {
    return res.status(400).json({ status: "error", message: "Missing 'text' parameter" });
  }

  try {
    const prompt = `is ${text} a bad word in which category now just answer the key answer in a JSON form also state bad word = true if it's a bad word only in this format {badword: true, category: <category>, Reasoning: <brief reason in 20-50 words>}`;
    const encodedPrompt = encodeURIComponent(prompt);

    const response = await fetch(`https://carflow-mocha.vercel.app/api/brain?prompt=${encodedPrompt}`);
    const outer = await response.json();

    if (outer.status !== "success") {
      return res.status(500).json({ status: "error", message: "Failed to fetch from brain API" });
    }

    let parsed;
    try {
      parsed = JSON.parse(outer.text);
    } catch (err) {
      return res.status(500).json({ status: "error", message: "Failed to parse brain response", raw: outer.text });
    }

    return res.status(200).json({
      status: "success",
      badword: parsed.badword || false,
      category: parsed.category || "Unknown",
      Reasoning: parsed.Reasoning || "No reasoning provided."
    });

  } catch (err) {
    return res.status(500).json({ status: "error", message: err.message });
  }
    }
  
