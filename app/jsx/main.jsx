/**
 * @jsx React.DOM 
 */

// Card
var Card = React.createClass({
    getInitialState: function () {
        return { dragging: false, rel: {x:0, y:0} };
    },

    // calculate relative position to the mouse and set dragging=true
    onMouseDown: function (e) {
        this.setState({ dragging: true, rel:{
            x: e.pageX - this.props.active.position.x,
            y: e.pageY - this.props.active.position.y,
        } });

        e.stopPropagation();
        e.preventDefault();
    },

    onMouseUp: function (e) {
        this.setState({ dragging: false });
        e.stopPropagation();
        e.preventDefault();
    },

    onMouseMove: function (e) {
        if (!this.state.dragging) return

        this.props.onDrag(
            e.pageX - this.state.rel.x,
            e.pageY - this.state.rel.y
        );

        e.stopPropagation()
        e.preventDefault()
    },

    render: function() {
        var classes = "card";
        var style = {};
        if (this.props.active) {
            classes += " active";
            style['-webkit-transform'] =
                'translateX(' + this.props.active.position.x + 'px) ' +
                'translateY(' + this.props.active.position.y + 'px)';
        }

        return (
            <div className={classes} style={style}
                onMouseDown={this.onMouseDown}
                onMouseMove={this.onMouseMove}
                onMouseUp={this.onMouseUp}>
                <h1>{this.props.value}</h1>
            </div>
        );
    }
});

var Board = React.createClass({
    getInitialState: function () {
        return({
            activeCard: {
                position: {
                    x: 0,
                    y: 0
                }
            }
        });
    },

    onDrag: function (x, y) {
        this.setState({
            activeCard: {
                position: {
                    x: x,
                    y: y
                }
            }
        });
    },

    render: function() {
        return (
            <div className="board">
                <Card value="A" active={this.state.activeCard} onDrag={this.onDrag} />
                <Card value="2"/>
            </div>    
        );
    }
});

React.renderComponent(
    <Board />,
    document.getElementById('example')
);