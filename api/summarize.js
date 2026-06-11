// Vercel serverless function: real AI summaries for the Summarize button.
// Requires the ANTHROPIC_API_KEY environment variable (set in the Vercel
// dashboard under Settings → Environment Variables). The key never reaches
// the browser.
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'POST only' });
  }

  const { article, title } = req.body || {};
  if (!article || article.length < 200) {
    return res.status(400).json({ error: 'Article text required' });
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
        max_tokens: 300,
        messages: [{
          role: 'user',
          content:
            'Summarize this blog article in exactly 3 bullet points for a busy HR leader. ' +
            'Each bullet is one sentence, no preamble, no markdown markers - just the three ' +
            'sentences separated by newlines.\n\nTitle: ' + (title || '') +
            '\n\nArticle:\n' + article.slice(0, 12000)
        }]
      })
    });

    if (!response.ok) {
      const detail = await response.text();
      return res.status(502).json({ error: 'Upstream error', detail });
    }

    const data = await response.json();
    const text = (data.content && data.content[0] && data.content[0].text) || '';
    const bullets = text.split('\n').map(s => s.replace(/^[-•*\d.\s]+/, '').trim()).filter(Boolean).slice(0, 3);
    return res.status(200).json({ bullets });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
}
