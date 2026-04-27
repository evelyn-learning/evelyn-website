# Geometry construction stress tests

Copy-paste each line into the tutor. Each section progresses from simple to complex. Within a section, prompts share state (so a follow-up can extend the prior figure); start a new tutor session before each new section.

## 1. Triangles

1. Show triangle ABC with A(2,3), B(-4,1), C(0,-5). Mark all three sides.
2. Build a triangle with sides 5, 7, 8. Label its vertices.
3. Build a 3-4-5 right triangle with the right angle at the origin and label the hypotenuse "5".
4. Build a triangle with two angles of 50° and 60° and the included side 6.
5. Show an equilateral triangle of side 4 centered roughly around the origin.
6. Show triangle ABC with A(0,0), B(8,0), C(3,5). Draw all three medians and mark the centroid.
7. Same triangle. Now draw all three altitudes and mark the orthocenter.
8. Same triangle. Draw the perpendicular bisectors of each side and mark the circumcenter.
9. Same triangle. Draw the angle bisectors from each vertex and mark the incenter.
10. Same triangle. Show the midsegment connecting the midpoints of AB and AC, and explain why it's parallel to BC.
11. Show triangle ABC with A(2,3), B(-4,1), C(0,-5). Draw the incircle and the three points where it touches the sides.
12. Same triangle. Draw the circumcircle.
13. Same triangle. Draw the excircle opposite A and the three sides/extensions it's tangent to.

## 2. Circles, chords, tangents

1. Circle with center O(2, 0) and radius 5. Mark a point P at angle 60° on the circle.
2. Same circle. Draw a chord one quarter of the diameter, horizontal, in the upper half.
3. Same circle. Draw a diameter passing through P from the previous step.
4. Same circle. Draw the tangent at P.
5. Circle with center O(0, 0) and radius 3, plus an external point E(7, 1). Draw both tangents from E and mark the points of tangency.
6. Two circles: center (-1,-1) radius 5, and center (2,-1) radius 5. Show their intersection points.
7. Three points A(0, 0), B(6, 0), C(3, 5). Draw the unique circle passing through all three.
8. Circle with center O(0, 0) radius 4. Draw an arc from (4, 0) to (0, 4) going counterclockwise, and the corresponding sector.

## 3. Quadrilaterals & polygons

1. Show a square with opposite corners at (0, 0) and (4, 4). Label all four vertices.
2. Show a square centered at (2, 2) with side 3, rotated 30°.
3. Show a rectangle with corners (-2, -1) and (5, 3).
4. Given A(0, 0), B(5, 0), C(7, 3), find the fourth vertex D so ABCD is a parallelogram.
5. Show a regular pentagon inscribed in a circle of radius 3 centered at the origin.
6. Show a regular hexagon centered at (2, 1) with circumradius 3, rotated 15°.

## 4. Lines, transversals, transformations

1. Draw two parallel horizontal lines y=2 and y=-1, and a transversal connecting (-3, 4) to (4, -3). Mark the two intersection points.
2. Reflect the point P(3, 4) across the x-axis. Then reflect that across the y-axis. Mark all three points.
3. Reflect the point P(2, 5) across the line through (0, 0) and (1, 1).
4. Rotate the point P(4, 0) by 30°, 60°, and 90° around the origin. Mark all four positions and connect them to the origin.
5. Translate the triangle with vertices (0, 0), (3, 0), (0, 4) by the vector (5, 2). Show both triangles.
6. Dilate the point P(2, 3) about the center C(0, 0) by factors 1.5, 2, and 3. Connect them to C.
7. Plot point P(4, 5). Drop a perpendicular from P to the x-axis. Mark the foot.
8. Through the point Q(2, 1), draw a line parallel to the line connecting (-3, -2) and (4, 5).
9. Divide the segment from A(0, 0) to B(10, 6) in the ratio 2:3. Mark the dividing point.

## 5. Conics

1. Show an ellipse with foci at (-3, 0) and (3, 0) and sum of focal distances 10. Mark the foci, both vertices, and both directrices.
2. Show an ellipse centered at (1, 2) with semi-major axis 4 and semi-minor axis 3, rotated 30°.
3. Show a parabola with vertex at (0, 0) opening upward with focal length 2. Mark the focus and directrix.
4. Show a parabola with focus (0, 2) and directrix the x-axis. Mark the vertex.
5. Show a hyperbola with foci at (±5, 0) and the difference of focal distances equal to 6. Mark its vertices, foci, directrices, and asymptotes.
6. Show a hyperbola centered at (0, 0) with a=4, b=3, rotated 45°. Mark its asymptotes.

## 6. Composed reasoning (cross-turn — same session)

These exercise both the constructions AND the cross-turn coordinate-preservation rule.

1. (Turn 1) Show triangle ABC with A(0, 0), B(6, 0), C(2, 5).
2. (Turn 2) Now draw the incircle of triangle ABC.
3. (Turn 3) Now draw the circumcircle of the same triangle ABC.
4. (Turn 4) Mark the centroid, incenter, circumcenter, and orthocenter on the same diagram. Connect three of them — they should be collinear (Euler line).
5. (Turn 5) Reflect the entire triangle ABC across the line AB. Show both triangles.

---

1. (Turn 1) Show a circle of radius 5 centered at O(0, 0).
2. (Turn 2) Mark a point P at angle 30° on the circle and draw the radius OP.
3. (Turn 3) Draw the tangent to the circle at P. Mark a right-angle indicator at P.
4. (Turn 4) Now mark an external point E(8, 0) and draw both tangents from E. Mark the two points of tangency T₁ and T₂.
5. (Turn 5) Draw the chord T₁T₂ and the segment OE. Where do they intersect? Mark the intersection.

---

1. (Turn 1) Show an ellipse with foci F₁(-4, 0) and F₂(4, 0) and sum 10.
2. (Turn 2) Mark a point P at angle 60° on the ellipse. Connect P to both foci.
3. (Turn 3) Verify visually that the sum of PF₁ and PF₂ equals 10 by labeling each segment with its length.

## 7. Edge cases & known regressions

These have caused bugs in the past. Re-run if anything feels off.

1. Show a circle with center O at (-2, -3) and radius 5, with a chord 1/4 of the diameter. (Was: brain placed chord through center.)
2. Show a circle with center O at (2, 3) and radius 5, with a chord shorter than its diameter. Then "join OC and OD and find the area of triangle OCD". (Was: brain re-imagined C and D coords on follow-up turn.)
3. Reflect the point A(2, 3) across the x-axis. (Was: schema rejected `"x-axis"` keyword and inline `{through:[...]}`.)
4. Draw a line parallel to the diameter D₁D₂ through point A. (Was: field-name mismatch on `parallel_through`.)
5. Draw circles with centers at (-1, -1) and (2, -1) and radii 5 each, then show their intersection points. (Was: declarations out of order — circles before their centers.)
6. Plot points A(2, 3), B(-4, 1), C(0, -5) and connect them with line segments. Then "Draw the incircle in this triangle and plot the points of intersection." (Was: brain composed incircle from primitives and failed.)

## 8. Heavy compound prompts

1. Triangle with vertices at (0, 0), (8, 0), (4, 6). Draw all three medians, all three altitudes, and the inscribed circle. Mark the centroid, orthocenter, and incenter. Make sure they don't visually clash.
2. Show a circle of radius 4 centered at the origin, two perpendicular diameters, a chord that bisects one of the radii, and the perpendicular bisector of that chord. Verify the perpendicular bisector passes through the center.
3. A regular hexagon of side 2 inscribed in a circle, plus all its diagonals from one vertex.
4. Three concentric circles of radii 1, 2, 3 centered at the origin, plus a single line that is tangent to the inner circle, secant to the middle circle, and external to the outer circle. (Sanity check on tangent/intersect chaining.)
5. Triangle ABC with A(0, 0), B(10, 0), C(3, 7). Draw the cevian from C to the point that divides AB in ratio 2:3. Drop a perpendicular from that point to AC.
6. An ellipse with foci (-3, 0) and (3, 0), sum 8, plus a parabola with focus at (0, 4) and directrix y=-4, on the same diagram. Mark the four points where the two curves intersect.
