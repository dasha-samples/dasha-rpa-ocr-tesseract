import { createWorker } from 'tesseract.js';

const worker = createWorker({
  logger: m => m.status == 'recognizing text' ? console.log(`OCR progress: ${Math.round(m.progress*100)}%`) : ''
});

export function createJob(phone: string) {
  return {
    data: {
      phone
    },
    rpcHandler: {
      async recognizeText(args:any) {
        await worker.load();
        await worker.loadLanguage('eng');
        await worker.initialize('eng');
        const { data: { text } } = await worker.recognize('./invoice.png');
        console.log("#".repeat(10));
        console.log(text);
        console.log("#".repeat(10));
        await worker.terminate();
        let lines = text.split("\n\n");
        let s = lines[7].split(" ");

        let invoiceNumber = s[3].split('').join(' ');;

        return invoiceNumber;
      }
    }
  };
}
