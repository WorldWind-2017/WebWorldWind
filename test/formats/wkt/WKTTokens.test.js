/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    'src/geom/Location',
    'src/shapes/Placemark',
    'src/geom/Position',
    'src/shapes/SurfacePolyline',
    'src/formats/wkt/geom/WKTGeometryCollection',
    'src/formats/wkt/geom/WKTLineString',
    'src/formats/wkt/geom/WKTMultiLineString',
    'src/formats/wkt/geom/WKTMultiPoint',
    'src/formats/wkt/geom/WKTMultiPolygon',
    'src/formats/wkt/geom/WKTPoint',
    'src/formats/wkt/geom/WKTPolygon',
    'src/formats/wkt/WKTTokens',
    'src/formats/wkt/geom/WKTTriangle'
], function (Location,
             Placemark,
             Position,
             SurfacePolyline,
             WKTGeometryCollection,
             WKTLineString,
             WKTMultiLineString,
             WKTMultiPoint,
             WKTMultiPolygon,
             WKTPoint,
             WKTPolygon,
             WKTTokens,
             WKTTriangle) {
    "use strict";

    describe("WKTTokens", function () {
        describe("Point", function () {
            it('correctly parses 2D point', function () {
                var point2D = 'POINT (14.5 50)';
                var wktObjects = new WKTTokens(point2D).objects();

                expect(wktObjects.length).toBe(1);
                expect(wktObjects[0] instanceof WKTPoint).toBeTruthy();
                expect(wktObjects[0].coordinates[0].equals(new Location(14.5, 50))).toBeTruthy();
            });

            it('correctly parses 3D point', function () {
                var point3D = 'POINT Z(14.5 50 13)';
                var wktObjects = new WKTTokens(point3D).objects();

                expect(wktObjects.length).toBe(1);
                expect(wktObjects[0] instanceof WKTPoint).toBeTruthy();
                expect(wktObjects[0].coordinates[0].equals(new Position(14.5, 50, 13))).toBeTruthy();
            });

            it('correctly ignores the LRS for 2D point', function () {
                var point2DLrs = 'POINT M (14.5 50 10)';
                var wktObjects = new WKTTokens(point2DLrs).objects();

                expect(wktObjects.length).toBe(1);
                expect(wktObjects[0] instanceof WKTPoint).toBeTruthy();
                expect(wktObjects[0].coordinates[0].equals(new Location(14.5, 50))).toBeTruthy();
            });

            it('correctly ignores the LRS for 3D point', function () {
                var point3DLrs = 'POINT MZ (14.5 50 10 13)';
                var wktObjects = new WKTTokens(point3DLrs).objects();

                expect(wktObjects.length).toBe(1);
                expect(wktObjects[0] instanceof WKTPoint).toBeTruthy();
                expect(wktObjects[0].coordinates[0].equals(new Position(14.5, 50, 10))).toBeTruthy();
            })
        });

        describe('Polygon', function () {
            it('correctly parses 2D polygon', function () {
                var polygon2D = 'POLYGON ((40 -70, 45 -80, 40 -90))';
                var wktObjects = new WKTTokens(polygon2D).objects();

                expect(wktObjects.length).toBe(1);
                expect(wktObjects[0] instanceof WKTPolygon).toBeTruthy();
                expect(wktObjects[0].coordinates.length).toBe(3);
                expect(equalLocations(wktObjects[0].coordinates, [new Location(40, -70), new Location(45, -80), new Location(40, -90)])).toBeTruthy();
            });

            it('correctly parses 3D polygon with inner boundaries', function(){
                var polygon = 'POLYGON Z ((40 -70 10, 45 -80 10, 40 -90 10), (42 -75 10, 44 -78 10, 42 -73 10))';
                var wktObjects = new WKTTokens(polygon).objects();

                expect(wktObjects.length).toBe(1);
                expect(wktObjects[0] instanceof WKTPolygon).toBeTruthy();
                expect(wktObjects[0].shapes()[0]._boundaries.length).toBe(2); // Verify internal boundaries
            });

            it('correctly ignores LRS for 2D polygon', function () {
                var polygon2D = 'POLYGON M((40 -70 10, 45 -80 10, 40 -90 10))';
                var wktObjects = new WKTTokens(polygon2D).objects();

                expect(wktObjects.length).toBe(1);
                expect(wktObjects[0] instanceof WKTPolygon).toBeTruthy();
                expect(wktObjects[0].coordinates.length).toBe(3);
                expect(equalLocations(wktObjects[0].coordinates, [new Location(40, -70), new Location(45, -80), new Location(40, -90)])).toBeTruthy();
            });

            it('correctly parses 3D polygon', function () {
                var polygon2D = 'POLYGON Z ((40 -70 10, 45 -80 10, 40 -90 10))';
                var wktObjects = new WKTTokens(polygon2D).objects();

                expect(wktObjects.length).toBe(1);
                expect(wktObjects[0] instanceof WKTPolygon).toBeTruthy();
                expect(wktObjects[0].coordinates.length).toBe(3);
                expect(equalLocations(wktObjects[0].coordinates, [new Position(40, -70, 10), new Position(45, -80, 10), new Position(40, -90, 10)])).toBeTruthy();
            });

            it('correctly ignores LRS for 3D polygon', function () {
                var polygon2D = 'POLYGON MZ ((40 -70 10, 45 -80 10, 40 -90 10))';
                var wktObjects = new WKTTokens(polygon2D).objects();

                expect(wktObjects.length).toBe(1);
                expect(wktObjects[0] instanceof WKTPolygon).toBeTruthy();
                expect(wktObjects[0].coordinates.length).toBe(3);
                expect(equalLocations(wktObjects[0].coordinates, [new Position(40, -70, 10), new Position(45, -80, 10), new Position(40, -90, 10)])).toBeTruthy();
            });
        });

        describe('LineString', function () {
            it('correctly parses EMPTY linestring', function () {
                var polygon2D = 'LINESTRING EMPTY';
                var wktObjects = new WKTTokens(polygon2D).objects();

                expect(wktObjects.length).toBe(1);
                expect(wktObjects[0] instanceof WKTLineString).toBeTruthy();
                expect(wktObjects[0].coordinates.length).toBe(0);
            });

            it('correctly parses 2D line string', function () {
                var polygon2D = 'LINESTRING ((33 -75, 37 -80, 33 -85))';
                var wktObjects = new WKTTokens(polygon2D).objects();

                expect(wktObjects.length).toBe(1);
                expect(wktObjects[0] instanceof WKTLineString).toBeTruthy();
                expect(wktObjects[0].coordinates.length).toBe(3);
                expect(equalLocations(wktObjects[0].coordinates, [new Location(33, -75), new Location(37, -80), new Location(33, -85)])).toBeTruthy();
            });

            it('correctly ignores LRS for 2D line string', function () {
                var polygon2D = 'LINESTRING M((33 -75 10, 37 -80 10, 33 -85 10))';
                var wktObjects = new WKTTokens(polygon2D).objects();

                expect(wktObjects.length).toBe(1);
                expect(wktObjects[0] instanceof WKTLineString).toBeTruthy();
                expect(wktObjects[0].coordinates.length).toBe(3);
                expect(equalLocations(wktObjects[0].coordinates, [new Location(33, -75), new Location(37, -80), new Location(33, -85)])).toBeTruthy();
            });

            it('correctly parses 3D line string', function () {
                var polygon2D = 'LINESTRINGZ((33 -75 10, 37 -80 10, 33 -85 10))';
                var wktObjects = new WKTTokens(polygon2D).objects();

                expect(wktObjects.length).toBe(1);
                expect(wktObjects[0] instanceof WKTLineString).toBeTruthy();
                expect(wktObjects[0].coordinates.length).toBe(3);
                expect(equalLocations(wktObjects[0].coordinates, [new Position(33, -75, 10), new Position(37, -80, 10), new Position(33, -85, 10)])).toBeTruthy();
            });

            it('correctly ignores LRS for 3D line string', function () {
                var polygon2D = 'LINESTRING MZ((33 -75 10 10, 37 -80 10 10, 33 -85 10 10))';
                var wktObjects = new WKTTokens(polygon2D).objects();

                expect(wktObjects.length).toBe(1);
                expect(wktObjects[0] instanceof WKTLineString).toBeTruthy();
                expect(wktObjects[0].coordinates.length).toBe(3);
                expect(equalLocations(wktObjects[0].coordinates, [new Position(33, -75, 10), new Position(37, -80, 10), new Position(33, -85, 10)])).toBeTruthy();
            });
        });

        describe('Triangle', function () {
            it('correctly parses 2D triangle', function () {
                var polygon2D = 'TRIANGLE ((40 -70, 45 -80, 40 -90))';
                var wktObjects = new WKTTokens(polygon2D).objects();

                expect(wktObjects.length).toBe(1);
                expect(wktObjects[0] instanceof WKTTriangle).toBeTruthy();
                expect(wktObjects[0].coordinates.length).toBe(3);
                expect(equalLocations(wktObjects[0].coordinates, [new Location(40, -70), new Location(45, -80), new Location(40, -90)])).toBeTruthy();
            });

            it('correctly ignores LRS for 2D triangle', function () {
                var polygon2D = 'TRIANGLE M((40 -70 10, 45 -80 10, 40 -90 10))';
                var wktObjects = new WKTTokens(polygon2D).objects();

                expect(wktObjects.length).toBe(1);
                expect(wktObjects[0] instanceof WKTTriangle).toBeTruthy();
                expect(wktObjects[0].coordinates.length).toBe(3);
                expect(equalLocations(wktObjects[0].coordinates, [new Location(40, -70), new Location(45, -80), new Location(40, -90)])).toBeTruthy();
            });

            it('correctly parses 3D triangle', function () {
                var polygon2D = 'TRIANGLE Z((40 -70 10, 45 -80 10, 40 -90 10))';
                var wktObjects = new WKTTokens(polygon2D).objects();

                expect(wktObjects.length).toBe(1);
                expect(wktObjects[0] instanceof WKTTriangle).toBeTruthy();
                expect(wktObjects[0].coordinates.length).toBe(3);
                expect(equalLocations(wktObjects[0].coordinates, [new Position(40, -70, 10), new Position(45, -80, 10), new Position(40, -90, 10)])).toBeTruthy();
            });

            it('correctly ignores LRS for 3D triangle', function () {
                var polygon2D = 'TRIANGLE MZ((40 -70 10 10, 45 -80 10 10, 40 -90 10 10))';
                var wktObjects = new WKTTokens(polygon2D).objects();

                expect(wktObjects.length).toBe(1);
                expect(wktObjects[0] instanceof WKTTriangle).toBeTruthy();
                expect(wktObjects[0].coordinates.length).toBe(3);
                expect(equalLocations(wktObjects[0].coordinates, [new Position(40, -70, 10), new Position(45, -80, 10), new Position(40, -90, 10)])).toBeTruthy();
            });
        });

        describe('MultiPoint', function () {
            it('correctly parses 2D point', function () {
                var point2D = 'MULTIPOINT ((17 49.3),(-17 49))';
                var wktObjects = new WKTTokens(point2D).objects();

                expect(wktObjects.length).toBe(1);
                expect(wktObjects[0] instanceof WKTMultiPoint).toBeTruthy();
                expect(wktObjects[0].shapes().length).toBe(2);
                expect(wktObjects[0].shapes()[0].position.equals(new Location(17, 49.3))).toBeTruthy();
                expect(wktObjects[0].shapes()[1].position.equals(new Location(-17, 49))).toBeTruthy();
            });

            it('correctly parses 3D point', function () {
                var point2D = 'MULTIPOINT Z((17 49.3 10),(-17 49 1))';
                var wktObjects = new WKTTokens(point2D).objects();

                expect(wktObjects.length).toBe(1);
                expect(wktObjects[0] instanceof WKTMultiPoint).toBeTruthy();
                expect(wktObjects[0].shapes().length).toBe(2);
                expect(wktObjects[0].shapes()[0].position.equals(new Position(17, 49.3, 10))).toBeTruthy();
                expect(wktObjects[0].shapes()[1].position.equals(new Position(-17, 49, 1))).toBeTruthy();
            });

            it('correctly ignores the LRS for 2D point', function () {
                var point2DLrs = 'MULTIPOINT M((17 49.3 10),(-17 49 1))';
                var wktObjects = new WKTTokens(point2DLrs).objects();

                expect(wktObjects.length).toBe(1);
                expect(wktObjects[0] instanceof WKTMultiPoint).toBeTruthy();
                expect(wktObjects[0].shapes().length).toBe(2);
                expect(wktObjects[0].shapes()[0].position.equals(new Location(17, 49.3))).toBeTruthy();
                expect(wktObjects[0].shapes()[1].position.equals(new Location(-17, 49))).toBeTruthy();
            });

            it('correctly ignores the LRS for 3D point', function () {
                var point2D = 'MULTIPOINT MZ((17 49.3 10 1),(-17 49 1 100))';
                var wktObjects = new WKTTokens(point2D).objects();

                expect(wktObjects.length).toBe(1);
                expect(wktObjects[0] instanceof WKTMultiPoint).toBeTruthy();
                expect(wktObjects[0].shapes().length).toBe(2);
                expect(wktObjects[0].shapes()[0].position.equals(new Position(17, 49.3, 10))).toBeTruthy();
                expect(wktObjects[0].shapes()[1].position.equals(new Position(-17, 49, 1))).toBeTruthy();
            })
        });

        describe('MultiLineString', function () {
            it('correctly parses 2D Multi Line String', function(){
                var multiLineString = 'MULTILINESTRING ((38 -70, 42 -75, 38 -80),(43 -65, 47 -70, 43 -75))';
                var wktObjects = new WKTTokens(multiLineString).objects();

                expect(wktObjects.length).toBe(1);
                expect(wktObjects[0] instanceof WKTMultiLineString).toBeTruthy();

                expect(wktObjects[0].shapes().length).toBe(2);
                // Get coordinates from Path and verify against the expectations.
                expect(equalLocations(wktObjects[0].shapes()[0]._boundaries, [new Location(38, -70), new Location(42, -75), new Location(38, -80)])).toBeTruthy();
                expect(equalLocations(wktObjects[0].shapes()[1]._boundaries, [new Location(43, -65), new Location(47, -70), new Location(43, -75)])).toBeTruthy();
            });

            it('correctly parses 2D Multi Line String with LRS', function(){
                var multiLineString = 'MULTILINESTRING M((38 -70 10, 42 -75 10, 38 -80 10),(43 -65 10, 47 -70 10, 43 -75 10))';
                var wktObjects = new WKTTokens(multiLineString).objects();

                expect(wktObjects.length).toBe(1);
                expect(wktObjects[0] instanceof WKTMultiLineString).toBeTruthy();

                expect(wktObjects[0].shapes().length).toBe(2);
                // Get coordinates from Path and verify against the expectations.
                expect(equalLocations(wktObjects[0].shapes()[0]._boundaries, [new Location(38, -70), new Location(42, -75), new Location(38, -80)])).toBeTruthy();
                expect(equalLocations(wktObjects[0].shapes()[1]._boundaries, [new Location(43, -65), new Location(47, -70), new Location(43, -75)])).toBeTruthy();
            });

            it('correctly parses 3D Line String', function(){
                var multiLineString = 'MULTILINESTRING Z((38 -70 10, 42 -75 10, 38 -80 10),(43 -65 10, 47 -70 10, 43 -75 10))';
                var wktObjects = new WKTTokens(multiLineString).objects();

                expect(wktObjects.length).toBe(1);
                expect(wktObjects[0] instanceof WKTMultiLineString).toBeTruthy();

                expect(wktObjects[0].shapes().length).toBe(2);
                // Get coordinates from Path and verify against the expectations.
                expect(equalLocations(wktObjects[0].shapes()[0]._positions, [new Position(38, -70, 10), new Position(42, -75, 10), new Position(38, -80, 10)])).toBeTruthy();
                expect(equalLocations(wktObjects[0].shapes()[1]._positions, [new Position(43, -65, 10), new Position(47, -70, 10), new Position(43, -75, 10)])).toBeTruthy();
            });

            it('correctly parses 3D Line String with LRS', function(){
                var multiLineString = 'MULTILINESTRING MZ((38 -70 10 12, 42 -75 10 12, 38 -80 10 12),(43 -65 10 12, 47 -70 10 12, 43 -75 10 12))';
                var wktObjects = new WKTTokens(multiLineString).objects();

                expect(wktObjects.length).toBe(1);
                expect(wktObjects[0] instanceof WKTMultiLineString).toBeTruthy();

                expect(wktObjects[0].shapes().length).toBe(2);
                // Get coordinates from Path and verify against the expectations.
                expect(equalLocations(wktObjects[0].shapes()[0]._positions, [new Position(38, -70, 10), new Position(42, -75, 10), new Position(38, -80, 10)])).toBeTruthy();
                expect(equalLocations(wktObjects[0].shapes()[1]._positions, [new Position(43, -65, 10), new Position(47, -70, 10), new Position(43, -75, 10)])).toBeTruthy();
            });
        });

        describe('MultiPolygon', function () {
            it('correctly parses 2D Multi polygon', function(){
                var multiPolygon = 'MULTIPOLYGON (((50 -60, 55 -70, 50 -80)),((30 -60, 35 -70, 30 -80)))';
                var wktObjects = new WKTTokens(multiPolygon).objects();

                expect(wktObjects.length).toBe(1);
                expect(wktObjects[0] instanceof WKTMultiPolygon).toBeTruthy();

                expect(wktObjects[0].shapes().length).toBe(2);

                expect(equalLocations(wktObjects[0].shapes()[0]._boundaries, [new Location(50, -60), new Location(55, -70), new Location(50, -80), new Location(50, -60)])).toBeTruthy();
                expect(equalLocations(wktObjects[0].shapes()[1]._boundaries, [new Location(30, -60), new Location(35, -70), new Location(30, -80), new Location(30, -60)])).toBeTruthy();
            });

            it('correctly parses 3D Multi polygon with inner boundaries', function(){
                var multiPolygon = 'MULTIPOLYGON Z (((50 -60 10, 55 -70 10, 50 -80 10)),((40 -70 10, 45 -80 10, 40 -90 10), (42 -75 10, 44 -78 10, 42 -73 10)))';
                var wktObjects = new WKTTokens(multiPolygon).objects();

                expect(wktObjects.length).toBe(1);
                expect(wktObjects[0] instanceof WKTMultiPolygon).toBeTruthy();

                expect(wktObjects[0].shapes().length).toBe(2);
                expect(equalLocations(wktObjects[0].shapes()[0]._boundaries[0], [new Position(50, -60, 10), new Position(55, -70, 10), new Position(50, -80, 10)])).toBeTruthy();
                expect(wktObjects[0].shapes()[1]._boundaries.length).toBe(2); // Verify internal boundaries.
            });

            it('correctly parses 2D Multi polygon with LRS', function(){
                var multiPolygon = 'MULTIPOLYGON M (((50 -60 10, 55 -70 10, 50 -80 10)),((30 -60 10, 35 -70 10, 30 -80 10)))';
                var wktObjects = new WKTTokens(multiPolygon).objects();

                expect(wktObjects.length).toBe(1);
                expect(wktObjects[0] instanceof WKTMultiPolygon).toBeTruthy();

                expect(wktObjects[0].shapes().length).toBe(2);

                expect(equalLocations(wktObjects[0].shapes()[0]._boundaries, [new Location(50, -60), new Location(55, -70), new Location(50, -80), new Location(50, -60)])).toBeTruthy();
                expect(equalLocations(wktObjects[0].shapes()[1]._boundaries, [new Location(30, -60), new Location(35, -70), new Location(30, -80), new Location(30, -60)])).toBeTruthy();
            });

            it('correctly parses 3D Multi Polygon', function(){
                var multiPolygon = 'MULTIPOLYGON Z (((50 -60 10, 55 -70 10, 50 -80 10)),((30 -60 10, 35 -70 10, 30 -80 10)))';
                var wktObjects = new WKTTokens(multiPolygon).objects();

                expect(wktObjects.length).toBe(1);
                expect(wktObjects[0] instanceof WKTMultiPolygon).toBeTruthy();

                expect(wktObjects[0].shapes().length).toBe(2);

                expect(equalLocations(wktObjects[0].shapes()[0]._boundaries[0], [new Position(50, -60, 10), new Position(55, -70, 10), new Position(50, -80, 10)])).toBeTruthy();
                expect(equalLocations(wktObjects[0].shapes()[1]._boundaries[0], [new Position(30, -60, 10), new Position(35, -70, 10), new Position(30, -80, 10)])).toBeTruthy();
            });

            it('correctly parses 3D Multi Polygon with LRS', function(){
                var multiPolygon = 'MULTIPOLYGON MZ (((50 -60 10 10, 55 -70 10 10, 50 -80 10 10)),((30 -60 10 10, 35 -70 10 10, 30 -80 10 10)))';
                var wktObjects = new WKTTokens(multiPolygon).objects();

                expect(wktObjects.length).toBe(1);
                expect(wktObjects[0] instanceof WKTMultiPolygon).toBeTruthy();

                expect(wktObjects[0].shapes().length).toBe(2);

                expect(equalLocations(wktObjects[0].shapes()[0]._boundaries[0], [new Position(50, -60, 10), new Position(55, -70, 10), new Position(50, -80, 10)])).toBeTruthy();
                expect(equalLocations(wktObjects[0].shapes()[1]._boundaries[0], [new Position(30, -60, 10), new Position(35, -70, 10), new Position(30, -80, 10)])).toBeTruthy();
            });
        });

        describe('GeometryCollection', function(){
            it('correctly parses geometry collection with multiple objects', function(){
                var geometryCollection = 'GEOMETRYCOLLECTION(POINT(4 6),LINESTRING(4 6,7 10))';
                var wktObjects = new WKTTokens(geometryCollection).objects();

                expect(wktObjects.length).toBe(1);
                expect(wktObjects[0] instanceof WKTGeometryCollection).toBeTruthy();

                expect(wktObjects[0].shapes().length).toBe(2);
                expect(wktObjects[0].shapes()[0] instanceof Placemark).toBeTruthy();
                expect(wktObjects[0].shapes()[1] instanceof SurfacePolyline).toBeTruthy();
            });
        });


        // Helper functions for verifications.
        function equalLocations(locations1, locations2) {
            var equals = true;
            if (locations1.length === locations2.length) {
                locations1.forEach(function (location, index) {
                    if (!locations2[index].equals(location)) {
                        equals = false;
                    }
                });
            } else {
                equals = false;
            }

            return equals;
        }
    });
});

