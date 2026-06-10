import http.server
import os

os.chdir(os.path.dirname(os.path.abspath(__file__)))
server = http.server.HTTPServer(("", 8090), http.server.SimpleHTTPRequestHandler)
print("Serving on http://localhost:8090")
server.serve_forever()
