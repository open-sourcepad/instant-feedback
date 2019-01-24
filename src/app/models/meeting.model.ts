export class Meeting {
  public id;
  public action_items;
  public finished_at;
  public discussions;
  public employee;
  public manager;
  public scheduled_at;
  public status;

  constructor(
    fields?: {
    action_items?: any,
    finished_at?: string,
    discussions?: any,
    employee?: Object,
    manager?: Object,
    scheduled_at?: string,
    status?: string,
    id? :number},
  ) {
     if (fields) Object.assign(this, fields);
  }
}