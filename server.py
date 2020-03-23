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
import mimetypes
import sys

mimetypes.init()

class HTTPHandler(BaseHTTPRequestHandler):
    def do_GET (self):
        mime = None
        contents = None
        dot_pos = self.path.rfind(".")
        extension = "" if dot_pos == -1 else self.path[dot_pos:]

        try:
            with open("." + self.path, 'rb') as file:
                contents = file.read()
                file.close()
        except FileNotFoundError:
            try:
                with open("." + self.path + ".js", 'rb') as file:
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

        self.wfile.write(contents)
        return

port = 8080

if len(sys.argv) > 1:
    prev_flag = None
    for argc in range(1, len(sys.argv)):
        if prev_flag != None:

            if prev_flag == "-p" or prev_flag == "--port":
                port = int(sys.argv[argc])
            else:
                print("Unexpected flag specified")
                quit(1)

        elif sys.argv[argc][0] == "-":
            prev_flag = sys.argv[argc]
        else:
            print("Unexpected CLI arg passed")
            quit(1)

server = HTTPServer(("", port), HTTPHandler)
print("Server has started at port {0}".format(str(port)))
print("If you want to open UI tests, go to http://localhost:{0}/Tests/UI/index.html".format(str(port)))
server.serve_forever()
