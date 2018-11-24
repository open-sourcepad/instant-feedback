export class User {

  public id;
  public diplay_name;
  public current_token;
  public email;
  public gender;

  constructor(
    fields?: {
    gender?: string,
    display_name?: string,
    email?: string,
    current_token? :string,
    web_api_keys? :any,
    id? :number}) {
     if (fields) Object.assign(this, fields);
  }
 }