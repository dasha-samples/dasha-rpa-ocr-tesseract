# How to start the demo app

This example shows how to use RPA tools with Dasha in real-time while talking. In this example it's Tesseract OCR, but it could be UiPath, Automation Anywhere, Electroneek...anything. If you need any help, join us in our [Developer Community](http://community.dasha.ai).

1. Set environment variable `DASHA_APIKEY` (or create a file `.env` that contains `DASHA_APIKEY=<your_apikey>`). To receive your Dasha API key, enroll into our beta program here https://dasha.ai/en-us/developers.
2. Run `npm i`.
```sh
npm i
```
3. Run one of the following:
    * To start outbound call run
    ```sh
    npm start <phone_number>
    ```
     (phone number in international format without `+`, for instance `12223334455`).
    * To start text chat run
    ```sh
    npm start chat
    ```
