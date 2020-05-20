import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'

/**
 * Api is a generic REST Api handler. Set your API url first.
 */
@Injectable()
export class Api {
	public ip = "localhost:1919"; // Next Dev Server
	// public ip = "zoalpay.znextech.com"; // Production
	// public ip = '192.168.1.33:1919' //Work Local
	// public ip = 'localhost:1919'
	public url: string = 'http://' + this.ip + '/api'
	public wsurl: string = 'https://' + this.ip + '/websocket'

	constructor(public http: HttpClient) {}

	get(endpoint: string, params?: any, reqOpts?: any) {
		if (!reqOpts) {
			reqOpts = {
				params: new HttpParams(),
			}
		}

		// Support easy query params for GET requests
		// if (params) {
		//   reqOpts.params = new HttpParams();
		//   for (let k in params) {
		//     reqOpts.params.set(k, params[k]);
		//   }
		// }

		if (params) {
			endpoint = endpoint + params
		}
		return this.http.get(this.url + '/' + endpoint, reqOpts)
	}

	post(endpoint: string, body: any, reqOpts?: any) {
		return this.http.post(this.url + '/' + endpoint, body, reqOpts)
	}

	put(endpoint: string, body: any, reqOpts?: any) {
		return this.http.put(this.url + '/' + endpoint, body, reqOpts)
	}

	delete(endpoint: string, reqOpts?: any) {
		return this.http.delete(this.url + '/' + endpoint, reqOpts)
	}

	patch(endpoint: string, body: any, reqOpts?: any) {
		return this.http.put(this.url + '/' + endpoint, body, reqOpts)
	}
}
