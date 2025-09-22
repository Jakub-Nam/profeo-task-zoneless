import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatDate',
  standalone: true
})
export class FormatDatePipe implements PipeTransform {
  transform(date: Date, format: 'full' | 'short' = 'full'): string {
    if (!date) return '';
    
    if (format === 'short') {
      return date.toLocaleDateString('pl-PL', { 
        day: '2-digit', 
        month: '2-digit'
      });
    }
    
    return date.toLocaleDateString('pl-PL', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  }
}
