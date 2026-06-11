// Vercel serverless function: grounded reading-assistant answers.
// The browser sends the article text plus the reader's question; Claude
// answers using only that article. Requires ANTHROPIC_API_KEY (Vercel
// dashboard → Settings → Environment Variables).
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'POST only' });
  }

  const { article, title, question } = req.body || {};
  if (!article || !question) {
    return res.status(400).json({ error: 'article and question required' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 400,
        system:
          'You are a reading assistant on a leadership blog. Answer the reader\'s question ' +
          'using ONLY the article provided. Be concise (2-4 sentences), conversational, and ' +
          'concrete. If the article does not cover the question, say so briefly and point to ' +
          'what the article does cover instead. Never invent content that is not in the article.',
        messages: [{
          role: 'user',
          content: 'Article title: ' + (title || '') +
            '\n\nArticle:\n' + article.slice(0, 12000) +
            '\n\nReader question: ' + question.slice(0, 500)
        }]
      })
    });

    if (!response.ok) {
      const detail = await response.text();
      return res.status(502).json({ error: 'Upstream error', detail });
    }

    const data = await response.json();
    const answer = (data.content && data.content[0] && data.content[0].text) || '';
    return res.status(200).json({ answer });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
}
