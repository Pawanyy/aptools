// totpUtils.js
import speakeasy from "speakeasy";
import QrCode from "qrcode-reader";
import express from "express";
import Jimp from "jimp";

const router = express.Router();

// Route to generate and return the TOTP code from base64 QR image
router.post("/generate-totp", async (req, res) => {
  try {
    const { base64_qr_image } = req.body;

    if (base64_qr_image.trim() == "") {
      res.status(300).json({ message: "base64_qr_image can't be empty." });
    }

    const base64QRString = base64_qr_image.includes("data:image/png;base64,")
      ? `${base64_qr_image}`
      : `data:image/png;base64,${base64_qr_image}`;

    const binaryData = Buffer.from(base64QRString.split(",")[1], "base64");

    decodeQRFromBinaryData(binaryData)
      .then((qrCodeText) => {
        // Extract the 2FA secret from the QR code (assuming it's present in the QR code)
        const secret = extract2FASecret(qrCodeText);

        // Generate the 2FA code using the extracted secret
        const totpCode = generate2FACode(secret);

        res.json({ secret, totpCode });
      })
      .catch((error) => {
        console.error("Failed to decode QR code:", error);
      });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error generating TOTP code.", details: error });
  }
});

function extract2FASecret(qrCodeText) {
  console.log(qrCodeText);
  // Split the QR code text by newlines to handle multi-line QR codes
  const qrCodeLines = qrCodeText.split("\n");

  // Search for the line containing the URL (assuming it starts with 'otpauth://')
  const urlLine = qrCodeLines.find((line) => line.startsWith("otpauth://"));
  if (!urlLine) {
    console.error("QR code does not contain a valid URL with 2FA secret.");
    return null;
  }

  try {
    // Parse the URL to extract its parameters
    const urlParams = new URL(urlLine);

    // Extract the 'secret' parameter, which contains the 2FA secret
    const secret = urlParams.searchParams.get("secret");
    if (!secret) {
      console.error("2FA secret not found in the URL.");
      return null;
    }

    return secret;
  } catch (error) {
    console.error("Error parsing the QR code URL:", error);
    return null;
  }
}

function generate2FACode(secret) {
  // Generate the 2FA code based on the secret
  const token = speakeasy.totp({
    secret: secret,
    encoding: "base32", // Assuming the secret is in base32 format
  });

  console.log("Generated 2FA code:", token);
  return token;
}

function decodeQRFromBinaryData(binaryData) {
  return new Promise((resolve, reject) => {
    Jimp.read(binaryData, (err, image) => {
      if (err) {
        console.error("Error reading the image:", err);
        reject(err);
      } else {
        const qrcode = new QrCode();
        qrcode.callback = function (err, value) {
          if (err) {
            console.error("Error decoding QR code:", err);
            reject(err);
          } else {
            resolve(value.result);
          }
        };
        qrcode.decode(image.bitmap);
      }
    });
  });
}

export default router;
