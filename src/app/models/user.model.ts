export class User {

  public id;
  public display_name;
  public current_token;
  public email;
  public gender;
  public role;

  constructor(
    fields?: {
    gender?: string,
    display_name?: string,
    email?: string,
    current_token? :string,
    role? :string,
    web_api_keys? :any,
    id? :number}) {
     if (fields) Object.assign(this, fields);
  }

  initials(){
    return this.display_name.split(" ")[0].charAt(0) + this.display_name.split(" ")[1].charAt(0);
  }

  first_display_name(){
    return this.display_name.split(" ")[0];
  }
 }