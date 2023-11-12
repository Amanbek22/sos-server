/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const { Expo } = require("expo-server-sdk");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const functions = require("firebase-functions");
//import admin module
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);

// let expo = new Expo({ accessToken: process.env.EXPO_ACCESS_TOKEN });
let expo = new Expo();
exports.pushNotification = functions.firestore
  .document("/sos/{pushId}")
  .onCreate((snapshot, context) => {
    console.log("Push notification event triggered");
    msgData = snapshot.data();
    console.log(snapshot.id);

    const tokens = [];

    const collectToken = (item) => {
        if(item.expoPushToken) {
            tokens.push(item.expoPushToken.data);
        }
    };
    msgData?.contacts?.forEach(collectToken);
    msgData?.nearestUser?.forEach(collectToken);
    console.log(tokens);
    const messages = [];
    messages.push({
      to: tokens,
      title: "SOS",
      body: "Нужна ваша помошь!",
      sound: "default",
      data: {
        sendername: "Data senderName",
        message: "Data message",
        id: snapshot?.id,
      },
    });

    let chunks = expo.chunkPushNotifications(messages);
    let tickets = [];
    

    let receiptIds = [];
    for (let ticket of tickets) {
      if (ticket.id) {
        receiptIds.push(ticket.id);
      }
    }

    let receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);
    (async () => {
      for (let chunk of receiptIdChunks) {
        try {
          let receipts = await expo.getPushNotificationReceiptsAsync(chunk);
          console.log(receipts);

          for (let receiptId in receipts) {
            let { status, message, details } = receipts[receiptId];
            if (status === "ok") {
              continue;
            } else if (status === "error") {
              console.error(
                `There was an error sending a notification: ${message}`
              );
              if (details && details.error) {
                console.error(`The error code is ${details.error}`);
              }
            }
          }
        } catch (error) {
          console.error(error);
        }
      }
    })();


    return (async () => {
        for (let chunk of chunks) {
          try {
            let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
            console.log(ticketChunk);
            tickets.push(...ticketChunk);
          } catch (error) {
            console.error(error);
          }
        }
      })();
  });
