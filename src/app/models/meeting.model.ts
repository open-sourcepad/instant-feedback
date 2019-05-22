export class Meeting {
  public id;
  public action_items;
  public finished_at;
  public discussions;
  public employee;
  public manager;
  public scheduled_at;
  public status;
  public started_at;
  public prev_meet_action_items;

  constructor(
    fields?: {
      action_items?: any,
      finished_at?: string,
      discussions?: any,
      employee?: Object,
      manager?: Object,
      scheduled_at?: string,
      status?: string,
      started_at?: string,
      id? :number
      prev_meet_action_items?: Object
    },
  ) {
     if (fields) Object.assign(this, fields);
  }
}
