import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { environment } from '../../../environments/environment';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.html',
  styleUrls: ['./profile.scss'],
  standalone: false
})
export class Profile implements OnInit {
  user: any;
  form: FormGroup;
  loading = false;
  avatarLoading = false;
  success = '';
  avatarPreview: string | null = null;
  apiUrl = environment.apiUrl;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private themeService: ThemeService,
    private cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      nombre: [''],
      apellido: [''],
      email: ['', [Validators.required, Validators.email]],
      theme: ['light']
    });
  }

  ngOnInit() {
    this.authService.userSubject.subscribe(u => {
      this.user = u;
      if (u) {
        this.form.patchValue({
          nombre: u.nombre,
          apellido: u.apellido,
          email: u.email,
          theme: u.theme || 'light'
        });
        if (u.avatar) {
          // If avatar starts with http, use it, else prepend api url
          this.avatarPreview = u.avatar.startsWith('http') ? u.avatar : `${this.apiUrl}${u.avatar}`;
        }
        this.cdr.detectChanges();
      }
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.avatarLoading = true;
      this.cdr.detectChanges();

      this.authService.updateAvatar(file).subscribe({
        next: (res) => {
          this.avatarLoading = false;
          // Update preview immediately
          this.avatarPreview = res.avatar.startsWith('http') ? res.avatar : `${this.apiUrl}${res.avatar}`;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error subiendo avatar:', err);
          this.avatarLoading = false;
          this.cdr.detectChanges();
        }
      });
    }
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.success = '';

    this.authService.updateProfile(this.form.value).subscribe({
      next: () => {
        this.loading = false;
        this.success = 'Perfil actualizado correctamente';
        this.themeService.setTheme(this.form.value.theme);
        this.cdr.detectChanges();
        setTimeout(() => {
          this.success = '';
          this.cdr.detectChanges();
        }, 3000);
      },
      error: (err) => {
        console.error('Error actualizando perfil:', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
