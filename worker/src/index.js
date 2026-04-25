export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    console.log("Path visited:", url.pathname);

    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": env.FRONTEND_URL,
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }
    if (url.pathname === "/favicon.ico") {
      return new Response(null, { status: 204 });
    }
    if (request.method === "POST" && url.pathname === "/save") {
      const id = Math.random().toString(36).substring(2, 8);
      // write a key-value pair
      console.log(request.body);
      const calBody = await request.json();
      const calBodyJSON = JSON.stringify(calBody);
      await env.CALENDAR_STORE.put(id, calBodyJSON);
      const response = new Response(JSON.stringify({ id }), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": env.FRONTEND_URL,
        },
      });
      return response;
    }

    if (request.method === "GET" && url.pathname.startsWith("/e/")) {
      const eventID = url.pathname.split("/")[2];
      const icsData = await env.CALENDAR_STORE.get(eventID);
      return new Response(icsData, {
        headers: {
          "Content-Type": "text/calendar",
          "Access-Control-Allow-Origin": env.FRONTEND_URL,
        },
      });
    }
  },
};
