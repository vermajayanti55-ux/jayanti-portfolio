export default async function handler(req, res) {
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
    // Import EmailJS dynamically
    const emailjs = (await import('@emailjs/browser')).default;

    // Initialize with public key
    emailjs.init(process.env.EMAILJS_PUBLIC_KEY);

    // Send email
    const result = await emailjs.send(
      process.env.EMAILJS_SERVICE_ID,
      process.env.EMAILJS_TEMPLATE_ID,
      {
        from_name: from_name.trim(),
        reply_to: reply_to.trim(),
        message: message.trim(),
      }
    );

    res.status(200).json({ success: true, message: 'Email sent successfully!' });
  } catch (error) {
    console.error('EmailJS error:', error);
    res.status(500).json({ error: 'Failed to send email. Please try again.' });
  }
}