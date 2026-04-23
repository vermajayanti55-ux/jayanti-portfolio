module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { from_name, reply_to, message } = req.body;

  // Basic validation
  if (!from_name || !reply_to || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(reply_to.trim())) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  try {
    // Call EmailJS API directly (HTTP endpoint)
    const emailjsResponse = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: process.env.EMAILJS_SERVICE_ID,
        template_id: process.env.EMAILJS_TEMPLATE_ID,
        user_id: process.env.EMAILJS_PUBLIC_KEY,
        template_params: {
          from_name: from_name.trim(),
          reply_to: reply_to.trim(),
          message: message.trim(),
        },
      }),
    });

    if (!emailjsResponse.ok) {
      throw new Error(`EmailJS API error: ${emailjsResponse.status}`);
    }

    res.status(200).json({ success: true, message: 'Email sent successfully! Jayanti will get back to you soon.' });
  } catch (error) {
    console.error('EmailJS error:', error);
    res.status(500).json({ error: 'Failed to send email. Please try again.' });
  }
};