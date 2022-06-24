export class Indicator {
  id: string;
  name: string;
  milestoneId: string;
  startDate: string;
  endDate:string;
  overallTarget: string;
  disaggregation: {
    datePeriod: string,
    target: string
  }[]
}
