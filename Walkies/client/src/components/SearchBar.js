import React , {Component} from 'react';

export class SearchBar extends Component{
    render(){
        return (<div>
                <header>
                    <input type="search" placeholder="Search..." onChange={(e) => {this.props.onSearch(e.target.value) ; this.forceUpdate()}}/>
                </header>
            </div>
        )
    }
}


