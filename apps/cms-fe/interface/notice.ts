export interface NoticeItem {
  key: React.Key;
  no: number;
  title: string;
  type: string;
  useIntro: boolean;
  status: string;
  createDate: Date;
  modifiedDate: Date;
}