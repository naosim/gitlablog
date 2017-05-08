var fs = require('fs')
var data = JSON.parse(fs.readFileSync('data.json', {encoding: 'utf-8'}));
Object.keys(data)
  .map(key => data[key])
  .sort((a, b) => {
    return new Date(b.note.created_at).getTime() - new Date(a.note.created_at).getTime()
  })
  .forEach(v => {
    console.log(
      v.mr.iid,
      (new Date(v.note.created_at).getTime() - new Date(v.mr.create_at).getTime()) / (1000 * 60 * 60),
      v.mr.author,
      v.mr.source_branch,
      v.mr.create_at,
      v.note.created_at,
      v.mr.title
    );
  });
