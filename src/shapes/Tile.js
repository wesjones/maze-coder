define('Tile', ['Piece'], function(Piece) {
    function Tile(dms, point, color) {
        var tColor = new obelisk.SideColor().getByInnerColor(color);
        var tDms = new obelisk.BrickDimension(dms, dms);
        var brick = new obelisk.Brick(tDms, tColor);
        var brickPt = new obelisk.Point3D((dms - 2) * point.x, (dms - 2) * point.y, (dms - 2) * point.z);
        Piece.call(this, 'tile', dms, point, brick, tDms, brickPt, tColor);
    }
    Tile.prototype = Piece.prototype;
    return Tile;
});