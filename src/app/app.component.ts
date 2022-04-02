import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  of,
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
        switchMap((searchQuery) =>
          combineLatest([
            of(searchQuery),
            this.searchService.search(searchQuery),
          ])
        )
      )
      .subscribe(([query, results]) => {
        console.log(`${new Date()} Results: ${query}`);
        this.searchResults = results;
      });
  }

  public ngOnDestroy(): void {
    this.searchSubscription?.unsubscribe();
  }

  public onSearchQueryInput(event: Event): void {
    const searchQuery = (event.target as HTMLInputElement).value;
    this.searchSubject.next(searchQuery?.trim());
  }
}
