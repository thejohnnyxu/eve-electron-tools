import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UniverseService } from 'src/app/services/universe.service';
import { MatchService } from 'src/app/services/match.service';
import { fromEvent } from 'rxjs';
import { map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { AlertService } from 'src/app/services/alert.service';


@Component({
  selector: 'app-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.scss']
})
export class MarketComponent implements OnInit {
  readonly numSuggestions = 10;
  readonly searchDelay = 200;
  items = [];
  searchValue = '';
  activeIndex = -1;
  dirty = false;

  @ViewChild('searchBar') searchBar: ElementRef;
  constructor(private alert: AlertService, public universe: UniverseService, public match: MatchService) { }

  ngOnInit() {
    // If the user does not type for a certain amount of time, refresh the autocomplete suggestions
    fromEvent(this.searchBar.nativeElement, 'input')
      .pipe(map((event: Event) => (<HTMLInputElement>event.target).value),
        debounceTime(this.searchDelay),
        distinctUntilChanged()
      ).subscribe(data => {
        this.activeIndex = -1;
        this.search();
        this.dirty = false;
      });
  }

  makeDirty() {
    this.dirty = true;
  }

  onKeydown(event: KeyboardEvent) {
    // Manipulate index pointing at the active suggestion
    if (event.key === 'ArrowDown' || event.key === 'Tab') {
      if (this.activeIndex < this.items.length - 1) {
        this.activate(this.activeIndex + 1);
      } else if (this.items.length > 0) {
        this.activate(0);
      }
      event.preventDefault();
      event.stopPropagation();
    } else if (event.key === 'ArrowUp') {
      if (this.activeIndex > 0) {
        this.activate(this.activeIndex - 1);
      } else if (this.items.length > 0) {
        this.activate(this.items.length - 1);
      }
    } else if (event.key === 'Enter' || event.key === 'ArrowRight') {
      // Treat as if Submit button had been pressed
      this.onSubmit();
      event.preventDefault();
      event.stopPropagation();
    }
  }

  search() {
    this.items = this.match.autoComplete(this.match.typeNames, this.searchValue, this.numSuggestions);
  }

  activate(index: number) {
    if (this.items.length === 0) { return; }
    this.activeIndex = index >= 0 ? index : 0;
    this.searchValue = this.items[this.activeIndex];
  }

  onSubmit() {
    if (this.dirty || this.items.length === 0) { return; }
    if (this.items.length === 0) { this.alert.warning('No items found.'); return; }
    this.activate(this.activeIndex);
    const submission = this.universe.getTypeId(this.searchValue);
    if (submission == null) { throw new Error('Bad search value submitted.'); }
    this.alert.info(`${this.searchValue}[${submission.toString()}]`);
  }
}
