import urllib.request

for p in ['/previa.html', '/es/previa.html', '/demo.html']:
    url = 'https://www.cantoriaexpress.com.br' + p
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as resp:
            print(url, 'FOUND!', resp.status)
    except Exception as e:
        print(url, 'Error:', e)
