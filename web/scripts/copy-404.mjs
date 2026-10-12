import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const dist = path.join(dir, '..', 'dist');
const indexPath = path.join(dist, 'index.html');

if (!fs.existsSync(indexPath)) {
  console.error('dist/index.html not found — run vite build first');
  process.exit(1);
}

const indexHtml = fs.readFileSync(indexPath, 'utf8');

/** GitHub Pages project site: /repo/ → keep 1 path segment (rafgraph/spa-github-pages) */
const redirectScript = `<script type="text/javascript">
(function(){
  var segmentCount = 1;
  var l = window.location;
  l.replace(
    l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') +
    l.pathname.split('/').slice(0, 1 + segmentCount).join('/') + '/?/' +
    l.pathname.slice(1).split('/').slice(segmentCount).join('/').replace(/&/g, '~and~') +
    (l.search ? '&' + l.search.slice(1).replace(/&/g, '~and~') : '') +
    l.hash
  );
})();
</script>`;

const routerRestoreScript = `<script type="text/javascript">
(function(l){
  if (l.search[1] === '/') {
    var decoded = l.search.slice(1).split('&').map(function(s){
      return s.replace(/~and~/g, '&');
    }).join('?');
    window.history.replaceState(null, null,
      l.pathname.slice(0, -1) + decoded + l.hash
    );
  }
}(window.location));
</script>`;

const withRestore = indexHtml.includes('router-restore')
  ? indexHtml
  : indexHtml.replace('<head>', '<head>\n    ' + routerRestoreScript);

fs.writeFileSync(indexPath, withRestore, 'utf8');

const html404 = redirectScript + '\n' + withRestore;
fs.writeFileSync(path.join(dist, '404.html'), html404, 'utf8');

console.log('Wrote 404.html + router restore for GitHub Pages SPA');
