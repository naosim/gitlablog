var context = require(__dirname + '/context.js')
var fs = require('fs')
var glrequest = require(__dirname + '/glrequest.js')(context)

var data = JSON.parse(fs.readFileSync('data.json', {encoding: 'utf-8'}));

glrequest.get('/api/v3/projects', (error, response, body) => {
  body.map(v => {
    return {id:v.id, name:v.name};
  })
  .filter(p => context.isTargetProject(p.id))
  .forEach((p) => {
    // console.log('# project');
    // console.log(p);
    glrequest.get(`/api/v3/projects/${p.id}/merge_requests?state=closed&sort=desc&order_by=updated_at`, (error, response, body) => {
      body.filter(v => v.state == 'merged').filter(v => v.target_branch != 'master').filter(v => v.source_branch.indexOf('feature') != 0 || v.source_branch.indexOf('feature/sp20') == 0/*featureで始まらない*/).forEach(v => {
        var mr = {
          id: v.id,
          iid: v.iid,
          title: v.title,
          state: v.state,
          create_at: v.created_at,
          target_branch: v.target_branch,
          source_branch: v.source_branch,
          author: v.author.name
        }
        // console.log('# merge request');
        // console.log(mr);
        glrequest.get(`/api/v3/projects/${p.id}/merge_requests/${mr.id}/notes`, (error, response, body) => {
          body.forEach(v => {
            var note = {
              body: v.body,
              author: v.author.name,
              created_at: v.created_at
            }
            // console.log('# note');
            // console.log(v);
          });

          body.filter(v => v.body.indexOf('mentioned in commit') != -1).forEach(v => {
            var note = {
              body: v.body,
              author: v.author.name,
              created_at: v.created_at,
              system: v.system
            }

            var result = {
              pj: p,
              mr: mr,
              note: note
            };
            // console.log("# result");
            // console.log(result);

            // console.log(
            //   result.mr.iid,
            //   (new Date(result.note.created_at).getTime() - new Date(result.mr.create_at).getTime()) / (1000 * 60 * 60),
            //   result.mr.author,
            //   result.mr.source_branch,
            //   result.mr.create_at,
            //   result.note.created_at,
            //   result.mr.title
            // );
            data[result.mr.iid] = result;
          })
        });
      })
    });
  })
})

// いつ終わるかわからないからとりあえず10秒待って保存する
setTimeout(() => {
  fs.writeFileSync('data.json', JSON.stringify(data, null, '  '));
}, 10 * 1000)
