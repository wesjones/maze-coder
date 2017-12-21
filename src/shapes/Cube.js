define('Cube', ['Piece'], function(Piece) {
    function Cube(dms, point, color, tall) {
        var cubeDms = new obelisk.CubeDimension(dms, dms, tall ? dms * 2 : dms);
        var cbColor = new obelisk.CubeColor().getByHorizontalColor(color);
        var cube = new obelisk.Cube(cubeDms, cbColor);
        var cubePt = new obelisk.Point3D((dms - 2) * point.x, (dms - 2) * point.y, (dms - 2) * point.z);
        Piece.call(this, 'cube', dms, point, cube, cubeDms, cubePt, cbColor);
    }
    Cube.prototype = Piece.prototype;
    return Cube;
});