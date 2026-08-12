import fs from 'fs';
import path from 'path';

const pdfPath = 'C:\\Users\\Jaymei\\Desktop\\Credit remedi\\storage\\app\\private\\public\\credit_reports\\48\\1780249955_Jamelyn Y Williams Credit Report - IdentityIQ.pdf';

async function main() {
  console.log('Reading credit report PDF...');
  if (!fs.existsSync(pdfPath)) {
    console.error('Test PDF file not found at:', pdfPath);
    process.exit(1);
  }

  const fileBuffer = fs.readFileSync(pdfPath);
  const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';

  // Build multipart form-data payload manually
  const header = `--${boundary}\r\nContent-Disposition: form-data; name="report"; filename="${path.basename(pdfPath)}"\r\nContent-Type: application/pdf\r\n\r\n`;
  const footer = `\r\n--${boundary}--\r\n`;

  const bodyBuffer = Buffer.concat([
    Buffer.from(header, 'utf-8'),
    fileBuffer,
    Buffer.from(footer, 'utf-8')
  ]);

  console.log('Uploading PDF to http://localhost:3000/api/parse-report...');
  try {
    const response = await fetch('http://localhost:3000/api/parse-report', {
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`
      },
      body: bodyBuffer
    });

    const result = await response.json();
    console.log('Response Status:', response.status);
    console.log('Response Body:', JSON.stringify(result, null, 2));

    if (response.ok && result.success) {
      console.log('SUCCESS: Credit report successfully uploaded, parsed, and logged!');
    } else {
      console.error('FAILED: API returned an error.');
    }
  } catch (err) {
    console.error('Network error during upload:', err);
  }
}

main();
