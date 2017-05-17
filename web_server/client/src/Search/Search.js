import React from 'react';

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
            <nav className="blue-grey lighten-4">
                <div className="nav-wrapper">
                    <form>
                        <div className="input-field">
                            <input id="search" type="search" value={this.props.searchText} onChange={this.handleSearch}/>
                            <label className="label-icon" for="search"><i className="material-icons">search</i></label>
                            <i class="material-icons">close</i>
                        </div>
                    </form>
                </div>
            </nav>
        )
    }
}

export default Search;