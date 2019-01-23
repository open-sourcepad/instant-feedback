import { FormBuilder, Validators } from "@angular/forms";

export class MeetingDiscussion {

  public id;
  public employee_notes;
  public discuss_type;
  public employee_name;
  public is_question_locked;
  public point_order;
  public question;
  private fb;

  constructor(
    fields?: {
    employee_notes?: string,
    discuss_type?: string,
    employee_name?: string,
    is_question_locked? :boolean,
    point_order? :number,
    question? :string,
    id? :number},
  ) {
     if (fields) Object.assign(this, fields);
  }

  initializeForm() {
    this.fb = new FormBuilder();
    return this.fb.group({
      id: [null],
      discuss_type: [null],
      employee_notes: ['', Validators.required],
      is_question_locked: [null],
      employee_name: [null],
      point_order: [null],
      question: [null]
    });
  }

  setForm() {
    let form = this.initializeForm();
    form.patchValue({
      id: this.id,
      discuss_type: this.discuss_type,
      employee_notes:this.employee_notes,
      is_question_locked: this.is_question_locked,
      employee_name: this.employee_name,
      point_order: this.point_order,
      question: this.question
    });
    return form;
  }

}