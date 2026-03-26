export type SponsorPlacement = {
  note: string;
  title: string;
  type: string;
};

export type ReachChartDatum = {
  display: string;
  label: string;
  value: number;
};

export const SPONSOR_WORKSPACE_LABEL = 'Sponsor Workspace';
export const SPONSOR_ACTIVE_BRIEFS_LABEL = '3 active briefs';
export const SPONSOR_CAMPAIGN_TITLE = 'New product launch';
export const SPONSOR_MATCH_COUNT_LABEL = '12 matches';
export const SPONSOR_REACH_VALUE = 84.2;

export const SPONSOR_PLACEMENTS: SponsorPlacement[] = [
  {
    note: 'High intent',
    title: 'Creator Circuit Midroll',
    type: 'Podcast',
  },
  {
    note: 'Operators',
    title: 'Operator Brief Feature',
    type: 'Newsletter',
  },
  {
    note: 'Awareness',
    title: 'Growth Memo Display',
    type: 'Display',
  },
];

export const REACH_CHART_DATA: ReachChartDatum[] = [
  { display: '4.2k', label: 'Jan', value: 42 },
  { display: '5.8k', label: 'Feb', value: 58 },
  { display: '5.0k', label: 'Mar', value: 50 },
  { display: '6.7k', label: 'Apr', value: 67 },
  { display: '6.1k', label: 'May', value: 61 },
  { display: '7.8k', label: 'Jun', value: 78 },
];
