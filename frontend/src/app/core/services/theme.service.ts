import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private _theme: 'light' | 'dark' = 'light';

    constructor() {
        this.loadTheme();
    }

    setTheme(theme: 'light' | 'dark') {
        this._theme = theme;
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }

    loadTheme() {
        const savedTheme = localStorage.getItem('user_data');
        if (savedTheme) {
            const user = JSON.parse(savedTheme);
            this.setTheme(user.theme || 'light');
        }
    }
}
