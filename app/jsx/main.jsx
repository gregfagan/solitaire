/**
 * @jsx React.DOM 
 */

// Card
var Card = React.createClass({
    render: function() {
        return (
            <div className="card">
                <h1>{this.props.value}</h1>
            </div>
        );
    }
});

var Board = React.createClass({
    render: function() {
        return (
            <div className="board">
                <Card value="A"/>
                <Card value="2"/>
            </div>    
        );
    }
});

React.renderComponent(
    <Board />,
    document.getElementById('example')
);