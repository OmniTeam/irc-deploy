export class Indicator {
  id: string;
  name: string;
  milestoneId: string;
  overallTarget: string;
  disaggregation: {
    datePeriod: string,
    target: string
  }[]
}
