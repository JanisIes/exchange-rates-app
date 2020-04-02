export interface ITimePeriodExchangeData {
  rates: object;
  start_at?: string;
  base: string;
  end_at?: string;
}

export interface IBaseExchangeData {
  rates: object;
  base: string;
  date: string;
}
