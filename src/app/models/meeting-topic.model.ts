export class MeetingTopic {

  public id;
  public question;
  public user_id;

  constructor(
    fields?: {
    question?: string,
    user_id? :number,
    id? :number}) {
     if (fields) Object.assign(this, fields);
  }

  setForm(form) {
    form.patchValue({
      id: this.id,
      question: this.question,
      user_id: this.user_id
    });
    return form;
  }
}