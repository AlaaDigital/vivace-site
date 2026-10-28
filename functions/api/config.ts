export async function onRequestGet(context: any) {
  try {
    const kv = context.env.CONFIG_KV;
    if (!kv) return new Response(JSON.stringify({}), { headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } });
    const data = await kv.get("vivace_config", { type: "json" });
    return new Response(JSON.stringify(data || {}), { headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } });
  } catch { 
    return new Response(JSON.stringify({}), { headers: { "Content-Type": "application/json" } }); 
  }
}
export async function onRequestPut(context: any) {
  try {
    const kv = context.env.CONFIG_KV;
    const data = await context.request.json();
    if (kv) await kv.put("vivace_config", JSON.stringify(data));
    return new Response(JSON.stringify({ ok: true }), { headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } });
  } catch { 
    return new Response(JSON.stringify({ ok: false }), { status: 500 }); 
  }
}
export async function onRequestOptions() { 
  return new Response(null, { headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, PUT, OPTIONS", "Access-Control-Allow-Headers": "Content-Type" } }); 
}
