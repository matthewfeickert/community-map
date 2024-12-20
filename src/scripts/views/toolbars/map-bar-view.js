/******************************************************************************\
|                                                                              |
|                              map-bar-view.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the toolbar used to control maps.                        |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2024, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import ToolbarView from './toolbar-view.js';
import QueryString from '../../utilities/web/query-string.js';

export default ToolbarView.extend({

	//
	// attributes
	//

	id: 'map-bar',
	className: 'vertical toolbar',

	template: _.template(`
		<div class="title">Map</div>

		<div class="buttons">
			<button id="show-map-mode" class="selected" data-toggle="tooltip" title="Map Mode" data-placement="left">
				<i class="fa fa-compass"></i>
			</button>

			<button id="show-aerial-mode" data-toggle="tooltip" title="Aerial Mode" data-placement="left">
				<i class="fa fa-plane"></i>
			</button>

			<button id="show-graph-mode" data-toggle="tooltip" title="Graph Mode" data-placement="left">
				<i class="fa fa-diagram-project"></i>
			</button>

			<div class="divider hidden-xs"></div>

			<button id="show-departments" class="selected hidden-xs" data-toggle="tooltip" title="Show / Hide Departments" data-placement="left">
				<i class="fa fa-building"></i>
			</button>

			<button id="show-department-labels" class="selected hidden-xs" data-toggle="tooltip" title="Show / Hide Department Labels" data-placement="left">
				<i class="fa fa-font"></i>
			</button>

			<button id="show-map-labels" class="hidden-xs" data-toggle="tooltip" title="Show / Hide Map Labels" data-placement="left">
				<i class="fa fa-map-marked-alt"></i>
			</button>
		</div>
	`),

	events: {
		'click #show-map-mode': 'onClickShowMapMode',
		'click #show-aerial-mode': 'onClickShowAerialMode',
		'click #show-graph-mode': 'onClickShowGraphMode',
		'click #show-departments': 'onClickShowDepartments',
		'click #show-department-labels': 'onClickShowDepartmentLabels',
		'click #show-map-labels': 'onClickShowMapLabels'
	},

	//
	// querying methods
	//

	isShowDepartmentsSelected: function() {
		return this.$el.find('#show-departments').hasClass('selected');
	},

	isShowDepartmentLabelsSelected: function() {
		return this.$el.find('#show-department-labels').hasClass('selected');
	},

	isShowMapLabelsSelected: function() {
		return this.$el.find('#show-map-labels').hasClass('selected');
	},

	addQueryParams: function(params) {
		let mode = this.getMapMode();
		if (mode != 'map') {
			params.set('mode', mode);
		}
		return params;
	},

	//
	// getting methods
	//

	getMapMode: function() {
		if (this.$el.find('#show-map-mode').hasClass('selected')) {
			return 'map';
		} else if (this.$el.find('#show-aerial-mode').hasClass('selected')) {
			return 'aerial';
		} else if (this.$el.find('#show-graph-mode').hasClass('selected')) {
			return 'graph';
		}
	},

	getQueryParams: function() {
		let params = new URLSearchParams();
		this.addQueryParams(params);
		return params;
	},

	//
	// setting methods
	//

	setMapMode: function(mapMode) {
		let currentMapMode = this.parent.getMapMode();

		// set button states
		//
		switch (mapMode) {
			case 'map':
				this.$el.find('#show-map-mode').addClass('selected');
				this.$el.find('#show-aerial-mode').removeClass('selected');
				this.$el.find('#show-graph-mode').removeClass('selected');
				this.$el.find('#show-departments').show();
				this.$el.find('#show-map-labels').show();
				break;
			case 'aerial':
				this.$el.find('#show-map-mode').removeClass('selected');
				this.$el.find('#show-aerial-mode').addClass('selected');
				this.$el.find('#show-graph-mode').removeClass('selected');
				this.$el.find('#show-departments').hide();
				this.$el.find('#show-map-labels').show();
				break;
			case 'graph':
				this.$el.find('#show-map-mode').removeClass('selected');
				this.$el.find('#show-aerial-mode').removeClass('selected');
				this.$el.find('#show-graph-mode').addClass('selected');
				this.$el.find('#show-departments').show();
				this.$el.find('#show-map-labels').hide();
				break;
		}

		// update map
		//
		if (currentMapMode != mapMode) {
			if (mapMode == 'graph' && !this.units_loaded) {

				// fetch full department info for graph mode
				//
				this.parent.fetchInstitutionUnits({
					full: true,

					// callbacks
					//
					success: (institutionUnits) => {
						this.units_loaded = true;
						this.parent.showInstitutionUnits(institutionUnits);
						this.setMapMode(mapMode);
					}
				});
			} else {
				this.parent.setMapMode(mapMode);
			}
		}
	},

	setQueryParams: function(params) {
		if (params.mode) {
			this.setMapMode(params.mode);
		}
	},

	updateQueryString: function() {
		let mapMode = this.getMapMode();

		// add query to params
		//
		let params = QueryString.toObject();

		// update map mode
		//
		if (mapMode != 'map') {
			params.mode = mapMode;
		} else {
			delete params.mode;
		}

		// set address bar
		//
		QueryString.set(QueryString.encode(params));
	},

	//
	// mouse event handling methods
	//

	onClickShowMapMode: function() {
		if (this.getMapMode() != 'map') {
			this.setMapMode('map');
			this.updateQueryString();
		}
	},

	onClickShowAerialMode: function() {
		if (this.getMapMode() != 'aerial') {
			this.setMapMode('aerial');
			this.updateQueryString();
		}
	},

	onClickShowGraphMode: function() {
		if (this.getMapMode() != 'graph') {
			this.setMapMode('graph');
			this.updateQueryString();
		}
	},

	onClickShowDepartments: function() {
		if (!this.isShowDepartmentsSelected()) {
			this.$el.find('#show-departments').addClass('selected');
			this.parent.viewport.$el.find('#buildings').removeClass('hidden');
			this.parent.viewport.$el.find('#departments').removeClass('hidden');
		} else {
			this.$el.find('#show-departments').removeClass('selected');
			this.parent.viewport.$el.find('#buildings').addClass('hidden');
			this.parent.viewport.$el.find('#departments').addClass('hidden');
		}
	},

	onClickShowDepartmentLabels: function() {
		if (!this.isShowDepartmentLabelsSelected()) {
			this.$el.find('#show-department-labels').addClass('selected');
			this.parent.labelsView.show();
		} else {
			this.$el.find('#show-department-labels').removeClass('selected');
			this.parent.labelsView.hide();
		}
	},

	onClickShowMapLabels: function() {
		if (!this.isShowMapLabelsSelected()) {
			this.$el.find('#show-map-labels').addClass('selected');
			this.parent.showMapLabels();
		} else {
			this.$el.find('#show-map-labels').removeClass('selected');
			this.parent.hideMapLabels();
		}
	}
});