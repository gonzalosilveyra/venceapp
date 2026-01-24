import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VencimientosService } from '../../core/services/vencimientos.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-vencimiento-form',
  templateUrl: './vencimiento-form.html',
  styleUrls: ['./vencimiento-form.scss'],
  standalone: false
})
export class VencimientoForm implements OnInit {
  form: FormGroup;
  loading = false;
  isEdit = false;
  id: number | null = null;
  error = '';

  constructor(
    private fb: FormBuilder,
    private vencimientosService: VencimientosService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      titulo: ['', Validators.required],
      fecha_vencimiento: ['', Validators.required],
      frecuencia: ['UNICO', Validators.required],
      activo: [true]
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEdit = true;
        this.id = +params['id'];
        this.loadData();
      }
    });
  }

  loadData() {
    this.loading = true;
    this.vencimientosService.getAll().subscribe(list => {
      const item = list.find((i: any) => i.id === this.id);
      if (item) {
        const d = new Date(item.fecha_vencimiento);
        const dateStr = d.toISOString().split('T')[0];
        this.form.patchValue({
          titulo: item.titulo,
          fecha_vencimiento: dateStr,
          frecuencia: item.frecuencia,
          activo: item.activo
        });
      }
      this.loading = false;
    });
  }

  isFieldInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!(control?.invalid && (control?.dirty || control?.touched));
  }

  onSubmit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    this.loading = true;

    if (this.isEdit && this.id) {
      this.vencimientosService.update(this.id, this.form.value).subscribe({
        next: () => this.router.navigate(['/']),
        error: () => { this.loading = false; this.error = 'Error al actualizar'; }
      });
    } else {
      this.vencimientosService.create(this.form.value).subscribe({
        next: () => this.router.navigate(['/']),
        error: () => { this.loading = false; this.error = 'Error al crear'; }
      });
    }
  }

  delete() {
    if (!this.id) return;
    if (confirm('¿Estás seguro de eliminar este vencimiento?')) {
      this.vencimientosService.delete(this.id).subscribe(() => this.router.navigate(['/']));
    }
  }
}
