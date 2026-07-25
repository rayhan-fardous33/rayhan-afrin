self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(
        () =>
          new Response("You are offline. Please reconnect and try again.", {
            headers: { "Content-Type": "text/plain; charset=utf-8" },
          }),
      ),
    );
  }
});
