/******************************************************************************\
|                                                                              |
|                               building-view.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a selectable, unscaled marker element.         |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2024, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import BaseView from '../../../../views/base-view.js';
import SVGRenderable from '../../../../views/svg/behaviors/svg-renderable.js';
import TooltipShowable from '../../../../views/behaviors/tips/tooltip-showable.js';

export default BaseView.extend(_.extend({}, SVGRenderable, TooltipShowable, {

	//
	// attributes
	//

	tagName: 'svg',

	//
	// popover attributes
	//

	popover_icon: 'fa fa-building',
	popover_title: '<%= name %>',
	popover_trigger: 'click',
	popover_template:
		`<div class="building">
			<% if (medium_image) { %>
			<img class="icon" src="<%= medium_image %>" />
			<% } %>
			<div class="info">
				<% if (departments && departments.length > 0) { %>
				<div class="departments">
					<label>Departments</label>
					<%= departments %>
				</div>
				<% } %>

				<% if (street_address) { %>
				<div class="street-address">
					<label>Street Address</label>
					<%= street_address %>
				</div>
				<% } %>

				<% if (departments.length == 0 && !street_address) { %>
				<div class="no-info">
					No additional information is available.
				</div>
				<% } %>
			</div>
		</div>`,

	events: {
		// 'click': 'onClick'
	},

	//
	// querying methods
	//

	hasGeometry: function() {
		let geojson = this.model.get('geojson');
		if (geojson) {
			switch (geojson.type) {
				case 'Polygon':
					return true;
				default:
					return false;
			}
		}
	},

	//
	// selection methods
	//

	select: function() {
		this.$el.addClass('selected');
		this.onSelect();
	},

	deselect: function() {
		this.$el.removeClass('selected');
		this.onDeselect();
	},

	//
	// svg rendering methods
	//

	vertexToLocation(vertex) {
		if (this.options.offset) {
			vertex[0] -= this.options.offset.x;
			vertex[1] -= this.options.offset.y;
		}
		if (this.options.scale) {
			vertex[0] *= this.options.scale.x;
			vertex[1] *= this.options.scale.y;
		}
		return vertex;
	},

	toDrawing: function(vertices) {
		if (vertices.length >= 2) {
			let vertex = this.vertexToLocation(vertices[0]);
			let d = 'M ' + vertex[0] + ' ' + -vertex[1];
			for (let i = 1; i < vertices.length; i++) {
				vertex = this.vertexToLocation(vertices[i]);
				d += ' L ' + vertex[0] + ' ' + -vertex[1];
			}
			if (this.options.closed) {
				d += ' Z';
			}
			return d;
		} else {
			return '';
		}
	},

	getLocation: function(map) {
		let latLng = this.model.getLatLng();
		if (latLng && this.hasGeometry()) {
			return map.latLongToPoint(latLng.x, latLng.y);
		}
	},

	getPolygon: function(vertices) {

		// get svg from document
		//
		let icon = document.createElementNS('http://www.w3.org/2000/svg', 'path');

		// set attributes
		//
		$(icon).attr({
			'class': 'polygon',
			'd': this.toDrawing(vertices)
		});

		return icon;
	},

	//
	// rendering methods
	//

	render: function() {
		let $el = SVGRenderable.render.call(this);
		if (this.model.has('object_type')) {
			this.$el.addClass(this.model.get('object_type').replace(/_/g, '-'));
		}
		return $el;
	},

	onRender: function() {
		this.addTooltips();
	},

	addTooltips: function() {
		this.tooltips = this.$el.addClass('tooltip-trigger').tooltip(_.extend(this.options, {
			trigger: this.tooltip_trigger,
			placement: this.tooltip_placement,
			container: this.tooltip_container
		}));
	},

	toGeometry: function() {
		let geojson = this.model.get('geojson');
		if (geojson) {
			switch (geojson.type) {
				case 'Polygon':
					return this.getPolygon(geojson.coordinates[0]);
				default:
					return null;
			}
		}	
	},

	toElement: function() {

		// set attributes
		//
		let element = document.createElementNS('http://www.w3.org/2000/svg', 'g');
		$(element).attr({
			'class': 'building',
			'number': this.model.get('building_number'),
			'data-toggle': 'tooltip',
			'title': this.model.get('name')
		});

		let geometry = this.toGeometry();
		if (geometry) {
			element.append(geometry);
		}

		return element;
	},

	//
	// mouse event handling methods
	//

	onClick: function() {
		let topView = this.getTopView();
		let mainView = topView.getChildView('content');
		let mapView = mainView.getChildView('mainbar');

		if (!mapView.is_dragging) {
			mapView.deselectAll();
			this.select();
		}
	},

	onSelect: function() {
		let topView = this.getTopView();
		let mainView = topView.getChildView('content');

		// highlight building and show in sidebar
		//
		mainView.showPlace(this.model);
		this.showTooltips();
	},

	onDeselect: function() {
		this.removeTooltips();
	}
}));