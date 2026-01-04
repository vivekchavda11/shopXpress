const nodemailer = require("nodemailer");

exports.sendContactMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    // Email Transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "vivekchavda6060@gmail.com",        // Your Gmail
        pass: "fjjp kely oldt cuwk",          // App Password
      },
    });

    // Email content
    const mailOptions = {
      from: email,
      to: "vivekchavda6060@gmail.com",            // Receive email at this address
      subject: "New Contact Message - ShopXpress",
      html: `
        <h3>New Contact Message</h3>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Message:</b><br/>${message}</p>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return res.json({ message: "Message sent successfully!" });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to send message" });
  }
};
