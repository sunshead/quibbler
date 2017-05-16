import './NewsCard.css';
import Auth from '../Auth/Auth';
import React from 'react';

class NewsCard extends React.Component{
    redirectToUrl(url) {
        this.sendClickLog();
        window.open(url, '_blank');
    }

    sendClickLog() {
        let url = 'http://localhost:3000/news/userId/' + Auth.getEmail()
            + '/newsId/' + this.props.news.digest;

        let request = new Request(encodeURI(url), {
            method: 'POST',
            headers: {
                'Authorization': 'bearer ' + Auth.getToken(),
            },
            cache: false});

        fetch(request);
    }

    render() {
        return(
                <div className="col s12 m12">
                    <div className="card horizontal blue-grey lighten-5">
                        <div className='card-image news-image'>
                            <img src={this.props.news.urlToImage} alt='news'/>
                        </div>
                        <div className="card-stacked">
                            <div className="card-content black-text" onClick={() => this.redirectToUrl(this.props.news.url)}>
                                <span className="card-title">{this.props.news.title}</span>
                                <p>{this.props.news.description}</p>
                            </div>
                            <div className="card-action">
                                <a href="#" className="blue-grey-text"> Save news </a>
                                {this.props.news.class != null &&
                                <div className='chip'>
                                    <i>{this.props.news.class}</i>
                                </div>}
                                {this.props.news.source != null &&
                                <div className='chip'>
                                    <i>{this.props.news.source}</i>
                                </div>}
                                {this.props.news.reason != null &&
                                <div className='chip'>
                                    <i>{this.props.news.reason}</i>
                                </div>}
                                {this.props.news.time != null &&
                                <div className='chip'>
                                    <i>{this.props.news.time}</i>
                                </div>}
                            </div>
                        </div>
                    </div>
                </div>
        );
    }
}

export default NewsCard;