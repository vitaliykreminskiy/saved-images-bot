const JSONdb = require('simple-json-db');
const db = new JSONdb('././storage/db.json');

if (!db.has('subscribers')) {
  db.set('subscribers', []);
}

const has = (subscriber) => {
  const currentSubscribers = db.get('subscribers');

  return currentSubscribers.indexOf(subscriber) != -1;
}

const get = () => {
  return db.get('subscribers');
}

const add = (subscriber) => {
  let currentSubscribers = db.get('subscribers');

  currentSubscribers.push(subscriber);
  db.set('subscribers', currentSubscribers);
}

const remove = (subscriber) => {
  let currentSubscribers = db.get('subscribers');

  if (!currentSubscribers) {
    return;
  }

  const foundIndex = currentSubscribers.indexOf(subscriber);

  if (foundIndex == -1) {
    return;
  }

  currentSubscribers.splice(foundIndex, 1);

  db.set('subscribers', currentSubscribers);
}

module.exports = {
  has,
  get,
  add,
  remove
}
