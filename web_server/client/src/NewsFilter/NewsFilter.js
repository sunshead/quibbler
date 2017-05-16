import React from 'react';
import './NewsFilter.css';
import {Checkbox, CheckboxGroup} from 'react-checkbox-group';

class NewsFilter extends React.Component {
    constructor(props) {
        super(props);
        this.handleFilterChange = this.handleFilterChange.bind(this);
    }

    handleFilterChange(e) {
        this.props.onFilterCategoriesSelection(e);
    }

    render() {
        let checkbox = this.props.categories.map((category) =>
            <div>
                <label><Checkbox className="filter-checkbox" value={category}/> {category}</label>
            </div>
        );
        return (
            <div className="col s12 m3">
                <div className="card-panel blue-grey darken-4">
                    <p className="card-title grey-text">Category</p>
                    <CheckboxGroup
                        name="categories"
                        value={this.props.filterCategories}
                        onChange={this.handleFilterChange}>
                        {checkbox}
                    </CheckboxGroup>
                </div>
            </div>
        )
    }
}

export default NewsFilter;