import { Component } from '@angular/core';
import { SearchService } from './search.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public searchResults: string[] = [];

  constructor(private searchService: SearchService) {}

  public onSearchQueryInput(event: Event): void {
    const searchQuery = (event.target as HTMLInputElement).value;
    this.searchService
      .search(searchQuery)
      .subscribe((results) => (this.searchResults = results));
  }
}
