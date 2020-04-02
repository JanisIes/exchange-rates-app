import { Component, ViewChild } from '@angular/core';
import { HttpService } from '../../services/http/http.service';
import {
  ITimePeriodExchangeData,
  IBaseExchangeData,
} from '../../services/http/http.types';
import { Observable } from 'rxjs';
import { MatSelectChange } from '@angular/material/select';
import { MatDatepickerInputEvent } from '@angular/material/datepicker/typings/datepicker-input';
import moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from '../error-dialog/error.dialog.component';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss'],
})
export class PageComponent {
  public selectedStartDate: MatDatepickerInputEvent<any>;
  public selectedEndDate: MatDatepickerInputEvent<any>;
  public selectedCurrency: MatSelectChange;
  public currentDate: Date;
  public data$: Observable<object>;
  public rates: object;
  public baseData: IBaseExchangeData;
  public timePeriodData: ITimePeriodExchangeData;
  public baseCurrency: string;
  public startDate: string;
  public endDate: string;
  @ViewChild('startInput', {
    read: MatInput,
    static: true,
  })
  public startInput: MatInput;
  @ViewChild('endInput', {
    read: MatInput,
    static: true,
  })
  public endInput: MatInput;
  constructor(private http: HttpService, private dialog: MatDialog) {
    http.makeLatestRequest().subscribe((val) => (this.rates = val.rates));
    this.data$ = http.makeLatestRequest();
  }

  public getBaseCurrency(event: MatSelectChange) {
    this.selectedCurrency = {
      value: event.source.value,
      source: event.source,
    };
    return (this.baseCurrency = this.selectedCurrency.value);
  }

  public getStartDate(event: MatDatepickerInputEvent<any>) {
    this.currentDate = new Date();
    moment(this.currentDate).subtract(1, 'days');
    const checkDate = moment(this.currentDate).format('YYYY-MM-DD');
    this.selectedStartDate = {
      value: event.value,
      target: event.target,
      targetElement: event.targetElement,
    };
    this.startDate = moment(this.selectedStartDate.value).format('YYYY-MM-DD');
    if (checkDate > this.startDate) {
      return this.startDate;
    } else {
      this.openErrorDialog('Pleas enter a valid date!');
    }
  }

  public getEndDate(event: MatDatepickerInputEvent<any>) {
    this.currentDate = new Date();
    moment(this.currentDate).subtract(1, 'days');
    const checkDate = moment(this.currentDate).format('YYYY-MM-DD');
    this.selectedEndDate = {
      value: event.value,
      target: event.target,
      targetElement: event.targetElement,
    };
    this.endDate = moment(this.selectedEndDate.value).format('YYYY-MM-DD');
    if (checkDate > this.endDate) {
      return this.endDate;
    } else {
      this.openErrorDialog('Pleas enter a valid date!');
    }
  }

  public openErrorDialog(message: string) {
    const dialogRef = this.dialog.open(ErrorDialogComponent, {
      width: '300px',
      height: '300px',
    });
    dialogRef.componentInstance.message = message;
  }

  public getExchangeData() {
    if (
      !this.baseCurrency &&
      (this.startDate === 'Invalid date' || !this.startDate) &&
      (!this.endDate || this.endDate === 'Invalid date')
    ) {
      this.timePeriodData = null;
      return this.http
        .makeLatestRequest()
        .subscribe((data) => (this.baseData = data));
    }
    if (
      this.endDate &&
      (!this.startDate || this.startDate === 'Invalid date') &&
      this.endDate !== 'Invalid date'
    ) {
      return this.openErrorDialog('Enter a start date!');
    }
    if (this.startDate && this.startDate !== 'Invalid date') {
      if (
        (this.endDate === 'Invalid date' || !this.endDate) &&
        !this.baseCurrency
      ) {
        this.timePeriodData = null;
        return this.http
          .makeHistoricRequest(this.startDate)
          .subscribe((data) => (this.baseData = data));
      }
      if (this.startDate >= this.endDate) {
        return this.openErrorDialog('Enter valid end date!');
      }
      if (this.startDate < this.endDate && this.endDate !== 'Invalid date') {
        this.baseData = null;
        return this.http
          .makePeriodRequest(this.startDate, this.endDate, this.baseCurrency)
          .subscribe((data) => (this.timePeriodData = data));
      }
    }
    if (
      this.startDate &&
      this.startDate !== 'Invalid date' &&
      (!this.endDate || this.endDate === 'Invalid date') &&
      this.baseCurrency
    ) {
      return this.openErrorDialog('Enter an end date!');
    }
    if (
      !this.startDate ||
      (this.startDate === 'Invalid date' && !this.endDate) ||
      (this.endDate === 'Invalid date' && this.baseCurrency)
    ) {
      this.timePeriodData = null;
      return this.http
        .makeBaseRequest(this.baseCurrency)
        .subscribe((data) => (this.baseData = data));
    }
  }

  public clearStarDate() {
    this.startDate = '';
    this.startInput.value = '';
  }

  public clearEndDate() {
    this.endDate = '';
    this.endInput.value = '';
  }
}
