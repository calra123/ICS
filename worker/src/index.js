export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === "/favicon.ico") {
      return new Response(null, { status: 204 });
    }
    if (request.method === "POST" && url.pathname === "/save") {
      const id = Math.random().toString(36).substring(2, 8);
      // write a key-value pair
      console.log(request.body);
      const icsString = await request.text();
      await env.CALENDAR_STORE.put(id, icsString);
      const response = new Response(JSON.stringify({ id }), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
      return response;
    }

    if (request.method === "GET" && url.pathname === "/e/") {
      const eventID = url.pathname.startswith("/e/");
      const icsData = await env.CALENDAR_STORE.get(id);
      return new Response(JSON.stringify({ icsData }), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }
    // read a key-value pair
    const count = (await env.CALENDAR_STORE.get("visits")) || "0";
    const newCount = parseInt(count) + 1;

    await env.CALENDAR_STORE.put("visits", newCount.toString());
    // list all key-value pairs
    const allKeys = await env.CALENDAR_STORE.list();

    // delete a key-value pair
    await env.CALENDAR_STORE.delete("KEY");

    // return a Workers response
    return new Response(
      JSON.stringify({
        value: count,
        allKeys: allKeys,
      }),
    );
  },
};
