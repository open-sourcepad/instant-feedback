import { Component } from '@angular/core';
import { SentimentService } from '../../services/api';

@Component({
  selector: 'sentiment-test',
  templateUrl: './sentiment-test.pug',
  styleUrls: ['./sentiment-test.scss']
})

export class SentimentTestComponent {

  loading: boolean = false;
  sentiment: string = '';
  ibmTone = {};
  googleSentiment = {};
  googleEntitySentiment = {};

  constructor(
    private sentimentApi: SentimentService
  ){}

  submit() {
    this.loading = true;

    this.sentimentApi.query({text: this.sentiment}).subscribe(res => {
      this.ibmTone = res['data']['ibm_tone'];
      this.googleSentiment = res['data']['google_sentiment'];
      this.googleEntitySentiment = res['data']['google_entity_sentiment'];
      this.loading = false;
    }, err => {
      this.loading = false;
    });
  }

}
