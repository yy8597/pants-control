// @flow
import { Observable } from 'rxjs';
import { delay, flatMap } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { Buffer } from 'buffer';

import { appStart, loadNote, focusNote } from '../../actions/core';

import defaultProfile from './defaultProfile.json';

/** defaultNoteOnStartUp
 * if no note exist
 * load default notes, add them to ipfs, add multihash to notes store cache
 * set current note to one of default note.
 * */
export default (action, store, { ipfs }) => {
  if (!ipfs) {
    console.error('No ipfs passed from dependency.');
    return Observable.empty();
  }
  const fileString = JSON.stringify(defaultProfile)
  ipfs.files.add(Buffer.from(fileString), (err, res) => {
    if (err || !res) {
      return console.error('ipfs add error', err, res)
    }

    res.forEach((file) => {
      if (file && file.hash) {
        console.log('successfully stored', file.hash)
        display(file.hash)
      }
    })
  })
  const profileHash = 'aaa';
  return action.pipe(
    ofType(appStart.TRIGGER),
    delay(1000),
    flatMap(() =>
      Observable.concat(
        Observable.of(loadNote.success({ id: profileHash, note: fileString })),
        Observable.of(focusNote(profileHash)),
      )),
  );
};
