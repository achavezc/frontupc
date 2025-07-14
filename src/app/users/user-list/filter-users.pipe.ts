import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'filterUsers', standalone: true })
export class FilterUsersPipe implements PipeTransform {
  transform(users: any[], search: string): any[] {
    if (!search) return users;
    const term = search.toLowerCase();
    return users.filter(u =>
      `${u.name} ${u.email} ${u.profile}`.toLowerCase().includes(term)
    );
  }
}
