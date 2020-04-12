const JSONdb = require('simple-json-db');
const db = new JSONdb('././storage/db.json');
const now = new Date();

if (!db.has('history')) {
  db.set('history', {});
}

const sync = (newObject) => {
    db.set('history', newObject);
}

const getDate = () => {
  return now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();
}

const append = (number) => {
  const date = getDate();
  const hour = now.getHours();
  let history = db.get('history');

  if (!(date in history)) {
      history[date] = {};
      sync(history);
  }

  history[date][hour] = number.replace(' ', '');
  sync(history);
}

module.exports = {
    append
}
