# PPE training data

The provided `construction-ppe.ndjson` is an Ultralytics dataset manifest:
one dataset metadata line followed by annotated image records. It is not a
YOLO directory and should not be copied into Git or treated as a model.

Its 11 classes are:

`helmet`, `gloves`, `vest`, `boots`, `goggles`, `none`, `Person`,
`no_helmet`, `no_goggle`, `no_gloves`, `no_boots`.

This class map differs from the upstream hazard model, which uses such classes
as safety cones, machinery, vehicles, poles and `NO-Safety Vest`. Keep model
registries and alert mappings separate. Use a PPE model for PPE alerts and the
upstream hazard model for site geometry/proximity rules.

Before training, download/export the actual dataset images through Ultralytics
using the manifest's source. Verify all signed URLs are valid; the manifest is
not a durable substitute for the data archive. Export to a standard YOLO
layout, preserve this class ordering, train a dedicated PPE model, then add it
to `hazard-engine`'s model registry with an immutable version.
