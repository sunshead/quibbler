import React from 'react';
import './Search.css';

class Search extends React.Component {
    constructor(props) {
        super(props);
        this.handleSearch = this.handleSearch.bind(this);
    }

    handleSearch(e) {
        this.props.onSearchTextInput(e.target.value);
    }

    render() {
        return (
            <div className="blue-grey lighten-4">
                <form>
                    <div className="input-field search-bar">
                        <input className="search-field" id="search" type="search" value={this.props.searchText} onChange={this.handleSearch}/>
                        <label className="label-icon" for="search"><i className="material-icons">search</i></label>
                    </div>
                </form>
            </div>
        )
    }
}

export default Search;