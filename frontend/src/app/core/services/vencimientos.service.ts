import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class VencimientosService {
    private apiUrl = `${environment.apiUrl}/vencimientos`;

    constructor(private http: HttpClient, private authService: AuthService) { }

    private getHeaders() {
        const token = this.authService.getToken();
        return new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        });
    }

    getAll(): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() });
    }

    create(data: any): Observable<any> {
        return this.http.post(this.apiUrl, data, { headers: this.getHeaders() });
    }

    update(id: number, data: any): Observable<any> {
        return this.http.put(`${this.apiUrl}/${id}`, data, { headers: this.getHeaders() });
    }

    delete(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
    }
}
