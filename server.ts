import 'reflect-metadata';
import 'zone.js/dist/zone-node';
import { platformServer, renderModuleFactory } from '@angular/platform-server';
import { enableProdMode } from '@angular/core';
import { AppServerModuleNgFactory } from './dist/ngfactory/src/app/app.server.module.ngfactory';
import * as express from 'express';
import { readFileSync } from 'fs';
import { join } from 'path';
import * as graphqlHTTP from 'express-graphql';
import { GraphQLObjectType, GraphQLList, GraphQLID, GraphQLString, GraphQLSchema } from 'graphql';

const PORT = 4000;

enableProdMode();

const app = express();

const template = readFileSync(join(__dirname, 'dist', 'index.html')).toString();

app.engine('html', (_, options, callback) => {
  const opts = { document: template, url: options.req.url };

  renderModuleFactory(AppServerModuleNgFactory, opts)
    .then(html => callback(null, html));
});

app.set('view engine', 'html');
app.set('views', 'src');

app.get('*.*', express.static(join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.render('index', { req });
});

const dogs = [
  { name: 'Boira', breed: 'Beagle' },
  { name: 'Nona', breed: 'Boira' }
];

const DogType = new GraphQLObjectType({
  name: 'DogType',
  fields: {
    id: {
      type: GraphQLID
    },
    name: {
      type: GraphQLString
    },
    breed: {
      type: GraphQLString
    }
  }
});

const RootQueryType = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    dogs: {
      type: new GraphQLList(DogType),
      resolve() {
        return dogs;
      }
    }
  }
});

const schema = new GraphQLSchema({
  query: RootQueryType
});

app.use('/graphql', graphqlHTTP({ schema }));

app.listen(PORT, () => {
  console.log(`listening on http://localhost:${PORT}!`);
});
