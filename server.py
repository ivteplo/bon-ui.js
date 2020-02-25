#!/usr/bin/python3

#
# server.py
# Created on 06/01/2020
#
# Copyright (c) 2020 Teplovs
# This file is under Apache License v2.0
# 
# See https://www.apache.org/licenses/LICENSE-2.0 for license information
# 

# this is script for the server (for UI tests without building the app)

from http.server import HTTPServer, BaseHTTPRequestHandler
# for mime types:
import mimetypes

mimetypes.init()

class HTTPHandler(BaseHTTPRequestHandler):
    def do_GET (self):
        mime = None
        contents = None
        dot_pos = self.path.rfind(".")
        extension = "" if dot_pos == -1 else self.path[dot_pos:]

        try:
            with open("." + self.path, 'r') as file:
                contents = file.read()
                file.close()
        except FileNotFoundError:
            try:
                with open("." + self.path + ".js", 'r') as file:
                    contents = file.read()
                    extension = ".js"
                    file.close()
            except FileNotFoundError:
                pass

        if contents == None:
            self.send_response(code=500)
            return

        if extension == ".js":
            mime = "text/javascript"
        
        self.send_response(code=200)
        self.send_header("Content-Type", mime if not mime == None else "text/plain" if extension == "" else mimetypes.types_map[extension])
        self.end_headers()

        self.wfile.write(bytes(contents, "utf8"))
        return


server = HTTPServer(("", 8080), HTTPHandler)
print("Server has started at port 8080")
print("If you want to open UI tests, go to localhost:8080/Tests/UI/index.html")
server.serve_forever()
