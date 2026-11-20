import sys,re,html
def lines(path):
    h=open(path,encoding='utf-8').read()
    m=h[h.find('<main'):h.find('</main>')]
    m=re.sub(r'<script.*?</script>|<style.*?</style>','',m,flags=re.S)
    m=re.sub(r'<(h[1-4])[^>]*>',r'\n@@\1 ',m)
    m=re.sub(r'<a [^>]*href="([^"]+)"[^>]*>',r' [[\1]] ',m)
    m=re.sub(r'<(dt|dd|li|p|br|div|tr|td|th)[^>]*>',r'\n',m)
    t=html.unescape(re.sub(r'<[^>]+>','',m))
    return [l.strip() for l in t.split('\n') if l.strip()]
if __name__=='__main__':
    for l in lines(sys.argv[1]): print(l)
