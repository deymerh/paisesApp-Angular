import {
  Component,
  ElementRef,
  EventEmitter,
  Input, Output,
  ViewChild,
  OnInit,
  OnDestroy
} from '@angular/core';
import { Subject, Subscription, debounceTime } from 'rxjs';

@Component({
  selector: 'shared-search-box',
  templateUrl: './search-box.component.html'
})
export class SearchBoxComponent implements OnInit, OnDestroy {

  @Input()
  public placeholder: string = '';

  @Input()
  public term: string = '';

  @Output()
  onValue: EventEmitter<string> = new EventEmitter();

  @ViewChild('txtTagInput')
  public tagInput!: ElementRef<HTMLInputElement>

  private debaouncer = new Subject<string>()
  private debaouncerSuscription?: Subscription;

  ngOnInit(): void {
    this.debaouncerSuscription = this.debaouncer.pipe(
        debounceTime(500)
      ).subscribe((value) => this.onSubmitValue(value))
  }

  onSubmitValue(term: string) {
    this.onValue.emit(term);
  }


  ngOnDestroy(): void {
    this.debaouncerSuscription?.unsubscribe();
  }

}
