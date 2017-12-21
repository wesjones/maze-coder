define('Pyramid', ['Piece'], function(Piece) {
    function Pyramid(dms, point, color, tall) {
        var pyColor = new obelisk.PyramidColor().getByRightColor(color);
        var pyDms = new obelisk.PyramidDimension(dms, tall);
        var py = new obelisk.Pyramid(pyDms, pyColor);
        var p3dPy = new obelisk.Point3D((dms - 2) * point.x, (dms - 2) * point.y, (dms - 2) * point.z);
        Piece.call(this, 'pyramid', dms, point, py, pyDms, p3dPy, pyColor);
    }
    Pyramid.prototype = Piece.prototype;
    return Pyramid;
});