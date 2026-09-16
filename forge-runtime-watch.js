(function(){
  var started=Date.now();
  function failOpen(){
    var app=document.getElementById("app");
    if(!app || window.__forgeRendered) return;
    app.innerHTML='<div style="min-height:100vh;background:#f4f6f8;display:grid;place-items:center;padding:24px;font-family:Inter,system-ui,sans-serif;color:#101828"><div style="width:min(720px,100%);background:#fff;border:1px solid #e4e7ec;border-radius:22px;padding:34px;box-shadow:0 24px 70px rgba(16,24,40,.12)"><div style="font-size:11px;font-weight:800;letter-spacing:.14em;color:#315efb;text-transform:uppercase">Forge startup</div><h1 style="font-size:36px;letter-spacing:-.04em;margin:10px 0">Forge did not finish starting.</h1><p style="color:#667085;line-height:1.6">The application was kept open instead of leaving you on a permanent loading screen. Your saved workspace data has not been touched.</p><div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:20px"><button onclick="location.reload()" style="border:0;border-radius:10px;padding:11px 15px;background:#315efb;color:#fff;font-weight:800;cursor:pointer">Reload Forge</button><button onclick="location.href=location.href.split('#')[0]+'?recovery='+Date.now()" style="border:1px solid #d0d5dd;border-radius:10px;padding:11px 15px;background:#fff;color:#101828;font-weight:800;cursor:pointer">Retry clean URL</button></div></div></div>';
  }
  window.setTimeout(failOpen,8000);
})();