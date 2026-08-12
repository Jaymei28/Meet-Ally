import fs from 'fs';
import { PDFParse } from 'pdf-parse';

const samplePath = 'C:\\Users\\Jaymei\\Desktop\\Credit remedi\\storage\\app\\private\\public\\credit_reports\\48\\1780249955_Jamelyn Y Williams Credit Report - IdentityIQ.pdf';

async function main() {
  console.log('Reading file:', samplePath);
  if (!fs.existsSync(samplePath)) {
    console.error('Sample PDF file does not exist at path!');
    process.exit(1);
  }

  const buffer = fs.readFileSync(samplePath);
  console.log('Buffer read successfully, size:', buffer.length, 'bytes');

  console.log('Parsing PDF content...');
  const parser = new PDFParse({ data: buffer });
  const result = await parser.getText();
  await parser.destroy();
  
  console.log('PDF parsed successfully!');
  console.log('Extracted text character length:', result.text.length);
  console.log('Snippet of extracted text:\n', result.text.slice(0, 500));
}

main().catch(err => {
  console.error('Error during test:', err);
});
