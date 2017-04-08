import { Component, OnInit } from '@angular/core';

import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

const DogsList = gql`
  query DogsList {
    dogs {
      id
      name
      breed
    }
  }
`;

interface QueryResponse {
  dogs;
  loading;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app works!';
  dogs: any[];
  loading: boolean;

  constructor(private apollo: Apollo) {}

  ngOnInit() {
    this.apollo.watchQuery<QueryResponse>({
      query: DogsList
    }).subscribe(({data}) => {
      this.loading = data.loading;
      this.dogs = data.dogs;
    });
  }
}
