import { Injectable } from '@angular/core';
import { Httpd, HttpdOptions } from '@ionic-native/httpd';

@Injectable()
export class WebServerService {

    constructor(
        private httpd: Httpd
    ) {

    }

    startServer() {
        const options: HttpdOptions = {
          www_root: 'sharefolder',
          port: 8080,
          localhost_only: false
        };
        this.httpd.startServer(options).subscribe((data) => {
          document.getElementById('url').innerHTML = 'server is started: <a href=' + data + '>' + data + '</a>';
        });
    }
}
