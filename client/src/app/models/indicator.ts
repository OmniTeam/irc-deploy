export class Indicator {
  id: string;
  name: string;
  overallTarget: string;
  disaggregation: {
    datePeriod: string,
    target: string
  }[]
}
