import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
const root=resolve('dist');
const port=Number(process.env.PORT||4173);
http.createServer(async(req,res)=>{const path=new URL(req.url,'http://localhost').pathname;if(path.startsWith('/api/')){res.writeHead(path==='/api/checkout'?200:404,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify({available:false}));return;}const file=resolve(root,'.'+(path==='/'?'/index.html':path.includes('.')?path:path+'.html'));if(!file.startsWith(root+'/')){res.writeHead(403);res.end();return;}try{const body=await readFile(file);res.setHeader('Content-Type',({'.html':'text/html','.css':'text/css','.png':'image/png'})[extname(file)]??'text/plain');res.end(body);}catch{res.writeHead(404);res.end('Not found');}}).listen(port,'127.0.0.1',()=>console.log(`Academy preview http://127.0.0.1:${port}`));
