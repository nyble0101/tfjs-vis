# Changelog

## [0.3.0] 2018-11-06
### Added
`fontSize` can now be passed into render.* methods
`zoomToFit` and `yAxisDomain` are new options that linecharts and scatterplots
take to allow finer control over the display of the yAxis
`xAxisDomain` option added to scatterplots.

### Changed
`show.history` and `show.fitCallbacks` now take an optional `opts` parameter.
These allow passing configuration to the underlying charts as well as overriding
which callbacks get generated by `show.fitCallbacks`.

`show.history` and `show.fitCallbacks` will now automatically group a metric with
its corresponding validation metric and display them on the same chart. For example
if you have `['acc', 'val_acc', 'loss', 'val_loss']` as your metrics, these will
be rendered on two charts, one for the loss metrics and one for the accuracy metrics.