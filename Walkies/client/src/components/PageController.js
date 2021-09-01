import React, { Component } from 'react';

export class PageController extends Component{

    render(){
        return(<div>
                <div className="results">
                    <button disabled={true ? this.props.page <= 1 : false}
                        onClick={() => {
                            this.props.skipToPage(this.props.page - 1);
                        }}
                    >
                        prev page
                    </button>
                    <button disabled={true ? this.props.page >= this.props.totalNumberOfPages : false}
                        onClick={() => {
                            this.props.skipToPage(this.props.page + 1);
                        }}
                    >
                        next page
                    </button>
                </div>
            </div>
        )

    }
}