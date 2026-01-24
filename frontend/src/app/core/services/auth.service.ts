import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = `${environment.apiUrl}/auth`;
    public tokenKey = 'vencimiento_token';
    public userSubject = new BehaviorSubject<any>(null);

    constructor(private http: HttpClient, private router: Router) {
        const token = this.getToken();
        const userStr = localStorage.getItem('user_data');
        if (token && userStr) {
            this.userSubject.next(JSON.parse(userStr));
        }
    }

    register(data: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/registro`, data).pipe(
            tap((res: any) => this.setSession(res))
        );
    }

    login(data: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/login`, data).pipe(
            tap((res: any) => this.setSession(res))
        );
    }

    updateProfile(data: any): Observable<any> {
        return this.http.put(`${this.apiUrl}/perfil`, data, { headers: this.getHeaders() }).pipe(
            tap((res: any) => this.updateUserSession(res.user))
        );
    }

    updateAvatar(file: File): Observable<any> {
        const formData = new FormData();
        formData.append('avatar', file);
        return this.http.post(`${this.apiUrl}/avatar`, formData, { headers: this.getHeaders(true) }).pipe(
            tap((res: any) => {
                const currentUser = this.userSubject.value;
                this.updateUserSession({ ...currentUser, avatar: res.avatar });
            })
        );
    }

    private getHeaders(isMultipart = false) {
        const token = this.getToken();
        const headers: any = {
            'Authorization': `Bearer ${token}`
        };
        // For FormData, browser sets Content-Type boundary automatically
        if (!isMultipart) {
            headers['Content-Type'] = 'application/json';
        }
        return headers;
    }

    private updateUserSession(user: any) {
        localStorage.setItem('user_data', JSON.stringify(user));
        this.userSubject.next(user);
    }

    logout() {
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem('user_data');
        this.userSubject.next(null);
        this.router.navigate(['/login']);
    }

    private setSession(authResult: any) {
        localStorage.setItem(this.tokenKey, authResult.token);
        localStorage.setItem('user_data', JSON.stringify(authResult.user));
        this.userSubject.next(authResult.user);
    }

    getToken(): string | null {
        return localStorage.getItem(this.tokenKey);
    }

    isAuthenticated(): boolean {
        return !!this.getToken();
    }
}
