define(function(){
    return function(x, y, z) {
        x = x || 0;
        y = y || 0;
        z = z || 0;

        // TODO: use correct vendor specific transform style for current renderer
        var transform = {
            WebkitTransform:
                'translateX(' + x + 'px)' +
                'translateY(' + y + 'px)' +
                'translateZ(' + z + 'px)'
        };

        return transform;
    };
});