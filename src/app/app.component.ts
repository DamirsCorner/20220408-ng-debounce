import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  debounceTime,
  distinctUntilChanged,
  Subject,
  Subscription,
  switchMap,
} from 'rxjs';
import { SearchService } from './search.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  private readonly searchSubject = new Subject<string | undefined>();
  private searchSubscription?: Subscription;

  public searchResults: string[] = [];

  constructor(private searchService: SearchService) {}

  public ngOnInit(): void {
    this.searchSubscription = this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((searchQuery) => this.searchService.search(searchQuery))
      )
      .subscribe((results) => (this.searchResults = results));
  }

  public ngOnDestroy(): void {
    this.searchSubscription?.unsubscribe();
  }

  public onSearchQueryInput(event: Event): void {
    const searchQuery = (event.target as HTMLInputElement).value;
    this.searchSubject.next(searchQuery?.trim());
  }
}
