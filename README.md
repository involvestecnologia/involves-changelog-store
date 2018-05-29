# involves-changelog-store

### Install
```bash
$ npm install involves-changelog-store -g
```

### API
| Argument               | Type            | Default Value | Description                                                          |
|------------------------|-----------------|---------------|----------------------------------------------------------------------|
| config                 | Object          | `{}`          | Configuration object.                                                |
| options.mongourl       | String          | `localhost`   | MongoDB connection string.                                           |
| options.token          | String          | `null`        | Github access token.                                                 |
| options.owner          | String          | `null`        | Github owner.                                                        |
| options.repo           | String          | `null`        | Github repository name.                                              |
| options.labels         | String          | `null`        | Issue labels separated by comma.                                     |
| options.since          | String          | `null`        | Timestamp in ISO 8601 format: `YYYY-MM-DDTHH:MM:SSZ`.                |
| options.state          | String          | `all`         | Issue state. Can be either `open`, `closed`, or `all`.               |

### CLI
```
$ changelog-store --mongourl=mongodb://localhost:27017/involves-changelog --token=mygithubtoken --owner=myusername --repo=nyreponame --labels=label1,label2,label3 --since=2018-05-29T17:59:48.445Z --state=closed
```
