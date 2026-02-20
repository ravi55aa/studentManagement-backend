// // services/FcmService.ts
// import admin from '../Config/fireBaseFCM.config';

// export class FcmService {
//     async sendToTokens(
//         tokens: string[],
//         payload: {
//         title: string;
//         body: string;
//         data?: Record<string, string>;
//         }
//     ) {
//         if (!tokens.length) return;

//         const message = {
//         tokens,
//         notification: {
//             title: payload.title,
//             body: payload.body,
//         },
//         data: payload.data || {},
//         };

//         const response = await admin.messaging().sendMulticast(message);

//         return response;
//     }
// }
