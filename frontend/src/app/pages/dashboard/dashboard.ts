import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { VencimientosService } from '../../core/services/vencimientos.service';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
  standalone: false
})
export class Dashboard implements OnInit {
  vencimientos: any[] = [];
  loading = true;

  constructor(
    private vencimientosService: VencimientosService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loadVencimientos();
  }

  loadVencimientos() {
    this.loading = true;
    console.log('Cargando vencimientos...');
    this.vencimientosService.getAll()
      .pipe(finalize(() => {
        this.loading = false;
        this.cdr.detectChanges();
      }))
      .subscribe({
        next: (data) => {
          console.log('Vencimientos cargados:', data);
          this.vencimientos = data || [];
          this.cdr.detectChanges();
        },
        error: (e) => {
          console.error('Error cargando vencimientos:', e);
          this.vencimientos = [];
        }
      });
  }

  getDaysRemaining(dateStr: string): number {
    // Tomamos solo la parte de la fecha YYYY-MM-DD
    const datePart = dateStr.split('T')[0];
    const [year, month, day] = datePart.split('-').map(Number);

    // Al instanciarlo con componentes (año, mes-1, día), JavaScript usa la zona horaria LOCAL
    const due = new Date(year, month - 1, day);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);

    const diff = due.getTime() - today.getTime();
    // 1000ms * 60s * 60m * 24h = 86,400,000 ms por día
    return Math.round(diff / 86400000);
  }

  getStatusColor(days: number): string {
    if (days < 0) return 'bg-red-100 text-red-700';
    if (days === 0) return 'bg-red-100 text-red-700 font-bold';
    if (days <= 3) return 'bg-orange-100 text-orange-700';
    if (days <= 7) return 'bg-yellow-100 text-yellow-700';
    return 'bg-green-100 text-green-700';
  }

  getStatusText(days: number): string {
    if (days < 0) return `Venció hace ${Math.abs(days)} días`;
    if (days === 0) return 'Vence HOY';
    if (days === 1) return 'Vence MAÑANA';
    return `Faltan ${days} días`;
  }
}
