export async function onRequestGet({ env }: any) {
  const kv = env.CONFIG_KV as any;
  if (!kv) return new Response(JSON.stringify({}), {headers:{"Content-Type":"application/json","Access-Control-Allow-Origin":"*"}});
  const data = await kv.get("vivace_config","json");
  return new Response(JSON.stringify(data||{}), {headers:{"Content-Type":"application/json","Access-Control-Allow-Origin":"*"}});
}
export async function onRequestPut({ request, env }: any) {
  const kv = env.CONFIG_KV as any;
  if (!kv) return new Response(JSON.stringify({error:"KV not bound"}), {status:500});
  const body = await request.json();
  await kv.put("vivace_config", JSON.stringify(body));
  return new Response(JSON.stringify({ok:true}), {headers:{"Content-Type":"application/json","Access-Control-Allow-Origin":"*"}});
}
export async function onRequestOptions() {
  return new Response(null, {headers:{"Access-Control-Allow-Origin":"*","Access-Control-Allow-Methods":"GET,PUT,OPTIONS","Access-Control-Allow-Headers":"Content-Type"}});
}
