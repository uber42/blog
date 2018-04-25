const remote = require('electron').remote
const API = require(__dirname.split('html')[0] + 'js/api')
const main = remote.require(__dirname.split('html')[0] + 'main')

    var thisUserID
    var http = "http://localhost:3000/"
    function profile() {
        main.Cookies().then((cookies) => {
            main.getJar().then(jar => {
                API.getProfile(cookies, jar).then((body) => {
                body = JSON.parse(body)
                thisUserID = body.id
                var Profile = React.createClass({
                    render: function(){
                        return(
                            <div className="jumbotron jumbotron-fluid">
                                <div className="container">
                                    <ul>
                                        <li> ID: {this.props.data.id} </li>
                                        <li> Имя: {this.props.data.name} </li>
                                        <li> E-mail: {this.props.data.email} </li>
                                        <li> Дата регистрации: {this.props.data.createdAt} </li>
                                        <li width="100px"> ID-сессии: {this.props.id} </li>
                                    </ul>
                                </div>
                            </div>
                        )
                    }
                })
                ReactDOM.render(<Profile data={body} id={cookies[0].split('=')[1].split(';')[0]} />, document.getElementById("userProfile"));
                }).catch((err) => {
                    console.log(err)
                });
            }).catch(err => {
                console.log(err)
            })
        }).catch(err => {
            console.log(err)
        });
      }
      profile()
      function lastPost(){
        API.getLastPost().then((body) => {
            body = JSON.parse(body)
            var LastPost = React.createClass({
                    render: function(){
                        return(
                            <div className="jumbotron jumbotron-fluid">
                                <div className="container">
                                    <h1 className="display-4">{this.props.data.title}</h1>
                                    <p className="lead">{this.props.data.text}</p>
                                    <hr/>
                                    <p>Автор: {this.props.data.user.name}</p>
                                    <p>Дата создания: {this.props.data.createdAt}</p>
                                </div>
                            </div>
                        )
                    }
                })
            ReactDOM.render(<LastPost data={body[0]} />, document.getElementById('lastPost'))
      }).catch((err) => {
          console.log(err)
      });
      }
    function fcreatePost(){
        main.Cookies().then((cookies) => {
            main.getJar().then(jar => {
                var article = {
                    title: document.getElementById('aTitle').value,
                    description: document.getElementById('desc').value,
                    text: document.getElementById('content').value
                }
                API.create(cookies, article, jar).then(result => {
                    alert(result)
                    if(result == "Успешно"){
                        document.getElementById('aTitle').value = ""
                        document.getElementById('desc').value = ""
                        document.getElementById('content').value = ""
                    }
                }).catch(err => {
                    console.log(err)
                })
            }).catch(err => {
                console.log(err)
            })
        }).catch(err => {
            console.log(err)
        })
    }
    function getUserPosts(){
        API.getUserData(thisUserID).then(result => {
            result = JSON.parse(result)
            var Posts = React.createClass({
                    render: function(){
                        return(
                            <div className="jumbotron jumbotron-fluid">
                                <div className="container">
                                    <table className="table">
                                        <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Название</th>
                                            <th>Дата создания</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                            {this.props.data.articles.map(article => {
                                                return (
                                                    <tr>
                                                        <th scope="row">{article.id}</th>
                                                        <td>{article.title}</td>
                                                        <td>{article.createdAt}</td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )
                    }
                })
            ReactDOM.render(<Posts data={result} />, document.getElementById("myArticles"));
        }).catch(err => {
            console.log(err)
        })
    }