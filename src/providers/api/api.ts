import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs/Observable';

/**
 * Api is a generic REST Api handler. Set your API url first.
 */
@Injectable()
export class Api {
	public ip = "167.71.35.117:1919"; // Next Dev Server
	// public ip = "zoalpay.znextech.com"; // Production
	// public ip = '192.168.1.33:1919' //Work Local
	// public ip = 'localhost:8080'
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
	getInternetCard(req?: any): Observable<HttpResponse<any>> {
		const options = this.createRequestOption(req);
		return this.http
			.get<any[]>(this.url +"internet-cards", { params: options, observe: 'response' })
			;
	}
	 createRequestOption = (req?: any): HttpParams => {
		let options: HttpParams = new HttpParams();
		if (req) {
			Object.keys(req).forEach(key => {
				if (key !== 'sort') {
					options = options.set(key, req[key]);
				}
			});
			if (req.sort) {
				req.sort.forEach(val => {
					options = options.append('sort', val);
				});
			}
		}
		return options;
	};

}
