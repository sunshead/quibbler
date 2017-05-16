import './NewsPanel.css';
import _ from 'lodash';
import React from 'react';
import NewsCard from '../NewsCard/NewsCard';
import NewsFilter from '../NewsFilter/NewsFilter';
import Auth from '../Auth/Auth';

const categories = [
    'Colleges & Schools',
    'Environmental',
    'World',
    'Entertainment',
    'Media',
    'Politics & Government',
    'Regional News',
    'Religion',
    'Sports',
    'Technology',
    'Traffic',
    'Weather',
    'Economic & Corp',
    'Advertisements',
    'Crime',
    'Other',
    'Magazine'
]

class NewsPanel extends React.Component {
    constructor() {
        super();
        this.state = {
            news: null,
            pageNum: 1,
            totalPages: 1,
            loadedAll: false,
            filterCategories: categories
        };
        this.handleScroll = this.handleScroll.bind(this);
        this.handleFilterCategoriesSelection = this.handleFilterCategoriesSelection.bind(this);
    }

    componentDidMount() {
        this.loadMoreNews();
        this.loadMoreNews = _.debounce(this.loadMoreNews, 600);
        window.addEventListener('scroll', this.handleScroll);
    }

    handleScroll() {
        let scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
        if ((window.innerHeight + scrollY) >= (document.body.offsetHeight - 50)) {
            console.log('Loading more news');
            this.loadMoreNews();
        }
    }

    loadMoreNews() {
        if (this.state.loadedAll === true) {
            return;
        }

        let url = 'http://localhost:3000/news/userId/' + Auth.getEmail()
            + '/pageNum/' + this.state.pageNum;

        let request = new Request(encodeURI(url), {
            method: 'GET',
            headers: {
                'Authorization': 'bearer ' + Auth.getToken(),
            },
            cache: false});

        fetch(request)
            .then((res) => res.json())
            .then((news) => {
                if (!news ||  news.length === 0) {
                    this.setState({loadedAll: true});
                }

                this.setState({
                    news: this.state.news? this.state.news.concat(news) : news,
                    pageNum: this.state.pageNum + 1
                });
            });
    }

    handleFilterCategoriesSelection(filterCategories) {
        this.setState({
            filterCategories: filterCategories
        });
    }

    renderNews() {
        let categories = this.state.filterCategories;
        let news_list = this.state.news.map(function (news) {
            if (categories.includes(news.class)) {
                return (
                    <a href="#">
                        <NewsCard news={news}/>
                    </a>
                );
            }
        });

        return (
                <div className="row">
                    <NewsFilter
                        categories={categories}
                        filterCategories={this.state.filterCategories}
                        onFilterCategoriesSelection={this.handleFilterCategoriesSelection}
                    />
                    <div className="col s12 m9">
                        {news_list}
                    </div>
                </div>
        );
    }

    render() {
        if (this.state.news) {
            return (
                <div>
                    {this.renderNews()}
                </div>
            )
        } else {
            return (
                <div>
                    <div id="msg-app-loading">
                        Loading
                    </div>
                </div>
            )
        }
    }
}

export default NewsPanel;