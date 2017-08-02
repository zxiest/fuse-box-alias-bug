import { observable, extendObservable } from 'mobx';
import _ from 'lodash'

const AppState = extendObservable({}, {
  currentUser: null, // the current user
})
