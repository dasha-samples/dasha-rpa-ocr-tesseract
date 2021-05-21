const dasha = require("@dasha.ai/sdk");
const tesseract = require("tesseract.js");
const fs = require("fs");

async function main() {
  const app = await dasha.deploy("./app");

  app.connectionProvider = async (conv) =>
    conv.input.phone === "chat"
      ? dasha.chat.connect(await dasha.chat.createConsoleChat())
      : dasha.sip.connect(new dasha.sip.Endpoint("default"));

  app.ttsDispatcher = () => "dasha";

  const worker = tesseract.createWorker({
    logger: (e) => {
      if (e.status === "recognizing text") {
        console.log(`OCR progress: ${Math.trunc(e.progress * 100)}`);
      }
    },
  });

  app.setExternal("recognizeText", async (args) => {
    await worker.load();
    await worker.loadLanguage("eng");
    await worker.initialize("eng");

    const { data } = await worker.recognize("./invoice.png");

    await worker.terminate();

    console.log("#".repeat(10));
    console.log(data.text);
    console.log("#".repeat(10));

    // the fourth field of the eighth line
    const invoiceNumber = data.text.split("\n\n")[7].split(" ")[3];

    // pronounce digit-by-digit
    return invoiceNumber.split("").join(" ");
  });

  await app.start();

  const phone = process.argv[2];
  const conv = app.createConversation({ phone });

  if (conv.input.phone !== "chat") conv.on("transcription", console.log);

  const logFile = await fs.promises.open("./log.txt", "w");
  await logFile.appendFile("#".repeat(100) + "\n");

  conv.on("transcription", async (entry) => {
    await logFile.appendFile(`${entry.speaker}: ${entry.text}\n`);
  });

  conv.on("debugLog", async (event) => {
    if (event?.msg?.msgId === "RecognizedSpeechMessage") {
      const logEntry = event?.msg?.results[0]?.facts;
      await logFile.appendFile(JSON.stringify(logEntry, undefined, 2) + "\n");
    }
  });

  await conv.execute();

  await app.stop();
  app.dispose();

  await logFile.close();
}

main();
