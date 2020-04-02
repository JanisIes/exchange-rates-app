import { Injectable } from '@angular/core';
import { IBaseExchangeData, ITimePeriodExchangeData } from './http.types';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class HttpService {
  private baseUrl = 'https://api.exchangeratesapi.io/';
  constructor(private http: HttpClient) {}
  public makeLatestRequest() {
    return this.http.get<IBaseExchangeData>(this.baseUrl + 'latest');
  }

  public makePeriodRequest(startDate: string, endDate: string, base?: string) {
    if (base) {
      return this.http.get<ITimePeriodExchangeData>(
        `${this.baseUrl}history?start_at=${startDate}&end_at=${endDate}&base=${base}`
      );
    } else {
      return this.http.get<ITimePeriodExchangeData>(
        `${this.baseUrl}history?start_at=${startDate}&end_at=${endDate}`
      );
    }
  }

  public makeBaseRequest(base: string) {
    return this.http.get<IBaseExchangeData>(
      `${this.baseUrl}latest?base=${base}`
    );
  }

  public makeHistoricRequest(startDate: string) {
    return this.http.get<IBaseExchangeData>(`${this.baseUrl}${startDate}`);
  }
}
