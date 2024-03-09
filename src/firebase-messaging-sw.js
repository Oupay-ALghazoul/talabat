// See https://firebase.google.com/docs/cloud-messaging/js/receive#setting_notification_options_in_the_service_worker
// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/7.14.5/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.14.5/firebase-messaging.js');

firebase.initializeApp( {
  apiKey: "AIzaSyBst7Fk-pl6I_kOArN-gLgnR8Wq48h_w00",
  authDomain: "talabatexpress-e01d9.firebaseapp.com",
  projectId: "talabatexpress-e01d9",
  storageBucket: "talabatexpress-e01d9.appspot.com",
  messagingSenderId: "140876104003",
  appId: "1:140876104003:web:645f7daa2756d68fc86ff6",
  measurementId: "G-9X918EJ7EN"
  });
   self.addEventListener('notificationclick', function(event) {
  event.notification.close();
      console.log('[firebase-messaging-sw.js] Received background message ', event);
        console.debug('SW notification click event', event);
  const url = 'https://admin.talabatexpress.com';
  event.waitUntil(
    clients.matchAll({includeUncontrolled: true,type: 'window'}).then( windowClients => {
        // Check if there is already a window/tab open with the target URL
        console.log('SW windowClients', windowClients);
        for (var i = 0; i < windowClients.length; i++) {
            var client = windowClients[i];
            console.log('SW Client', client);

            // If so, just focus it.
            if (client.url.startsWith(url) && 'focus' in client) {
                // client.navigate('/');
                return client.focus();
            }
        }
        // If not, then open the target URL in a new window/tab.
        if (clients.openWindow) {
            return clients.openWindow(url);
        }
    })
);
});
self.addEventListener('activate', event => {
    console.log(event);
  event.waitUntil(clients.claim());
});
self.clients.matchAll({type:'all'}).then(function(clients) {
  // do something with your clients list
          console.log('SW windowClients', clients);
});
 self.addEventListener('fetch',() => console.log("fetch"));
const messaging = firebase.messaging();


self.addEventListener('notificationclose', function(event) {
  const dismissedNotification = event.notification;
      console.log('[firebase-messaging-sw.js] Received background message ', event);

//  const promiseChain = notificationCloseAnalytics();
 // event.waitUntil(promiseChain);
});
// messaging.onNotificationClick(function(event){
//       console.log('[firebase-messaging-sw.js] Received background message ', event);
//       event.notification.close();
//   event.waitUntil(self.clients.openWindow(event.notification.data.url));
// });
// messaging.onNotificationClick((payload)=>{
//     console.log('[firebase-messaging-sw.js] Received background message ', payload);
// });

// self.onnotificationclick = function(event) {
//   console.log('On notification click: ', event);
//   event.notification.close();

//   // This looks to see if the current is already open and
//   // focuses if it is
//   event.waitUntil(clients.matchAll({
//     type: "window"
//   }).then(function(clientList) {
//     for (var i = 0; i < clientList.length; i++) {
//       var client = clientList[i];
//       if (client.url == '/' && 'focus' in client)
//         return client.focus();
//     }
//     if (clients.openWindow)
//       return clients.openWindow('/');
//   }));
// };

messaging.setBackgroundMessageHandler(function(payload) {
      console.log('On notification Handler: ', payload);

    const title = payload.data.title;
    const options = {
        body: payload.data.body,
        icon: payload.data.icon
    };
    // return self.registration.showNotification(title, options);
});
// import { getMessaging, getToken } from "firebase/messaging";

// // Get registration token. Initially this makes a network call, once retrieved
// // subsequent calls to getToken will return from cache.
// const messaging = getMessaging();
// getToken(messaging, { vapidKey: '<YOUR_PUBLIC_VAPID_KEY_HERE>' }).then((currentToken) => {
//   if (currentToken) {
//     // Send the token to your server and update the UI if necessary
//     // ...
//   } else {
//     // Show permission request UI
//     console.log('No registration token available. Request permission to generate one.');
//     // ...
//   }
// }).catch((err) => {
//   console.log('An error occurred while retrieving token. ', err);
//   // ...
// });