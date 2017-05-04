var context = require(__dirname + '/context.js')
var glrequest = require(__dirname + '/glrequest.js')(context)
glrequest.get('/api/v3/projects', (error, response, body) => {
  body.forEach((v) => {
    var p = {id:v.id, name:v.name};
    console.log('# project');
    console.log(p);
    glrequest.get(`/api/v3/projects/${p.id}/merge_requests`, (error, response, body) => {
      body.filter(v => v.state == 'merged').forEach(v => {
        var mr = {
          iid: v.iid,
          title: v.title,
          state: v.state,
          create_at: v.created_at,
          target_branch: v.target_branch,
          source_branch: v.source_branch,
          author: v.author.name
        }
        console.log('# merge request');
        console.log(mr);
        glrequest.get(`/api/v3/projects/${p.id}/merge_requests/${mr.iid}/notes`, (error, response, body) => {
          body.forEach(v => {
            var note = {
              body: v.body,
              author: v.author.name,
              created_at: v.created_at,
              system: v.system
            }
            console.log('# note');
            console.log(note);
          });

          body.filter(v => v.system && v.body == 'merged').forEach(v => {
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
            console.log(result);

          })

        });
      })
    });
  })
})
