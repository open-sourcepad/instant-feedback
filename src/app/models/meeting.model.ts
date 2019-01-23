export class Meeting {
  public id;
  public action_items;
  public actual_schedule;
  public discussions;
  public employee;
  public manager;
  public set_schedule;
  public status;

  constructor(
    fields?: {
    action_items?: any,
    actual_schedule?: string,
    discussions?: any,
    employee?: Object,
    manager?: Object,
    set_schedule?: string,
    status?: string,
    id? :number},
  ) {
     if (fields) Object.assign(this, fields);
  }
}