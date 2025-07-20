import QRCode from "qrcode";

const generateURL = ({ amount, name, upi }) => {
  return `upi://pay?pa=${upi}&pn=${encodeURIComponent(name)}&am=${amount}&cu=INR`;
};

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const amount = searchParams.get('amount') || '50';
    const name = searchParams.get('name') || 'Vihan Anand';
    const upi = searchParams.get('upi') || '9506277581@slc';

    // Validation
    if (!upi || !name) {
      return new Response('Missing required parameters: name and upi', { status: 400 });
    }

    if (isNaN(amount) || parseFloat(amount) <= 0) {
      return new Response('Invalid amount', { status: 400 });
    }

    const url = generateURL({ amount, name, upi });
    
    const qrCodeDataURL = await QRCode.toDataURL(url, {
      type: "image/png",
      margin: 1,
      width: 300,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });

    // Extract base64 data from data URL
    const base64Data = qrCodeDataURL.split(',')[1];
    const imageBuffer = Buffer.from(base64Data, 'base64');

    return new Response(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=3600'
      }
    });

  } catch (error) {
    console.error('Error generating UPI QR:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
