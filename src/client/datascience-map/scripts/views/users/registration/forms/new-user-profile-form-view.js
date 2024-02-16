/******************************************************************************\
|                                                                              |
|                           new-user-profile-form-view.js                      |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an editable form view of a new user's profile            |
|        information.                                                          |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2022, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import FormView from '../../../../views/forms/form-view.js';
import EditableUserProfileFormView from '../../../../views/users/accounts/forms/editable-user-profile-form-view.js';
import '../../../../views/forms/validation/alphanumeric-rules.js';
import '../../../../views/forms/validation/authentication-rules.js';
import '../../../../utilities/security/password-policy.js';
import '../../../../../vendor/bootstrap/js/tab.js';

export default FormView.extend({

	//
	// attributes
	//

	template: _.template(`
		<div id="user-profile"></div>

		<fieldset>
			<legend>Account</legend>

			<% if (sso) { %>
			<div class="form-group" id="username">
				<label class="required control-label">NetID</label>
				<div class="controls">
					<div class="input-group">
						<input type="text" class="required form-control" name="username" value="<%= username %>">
						<div class="input-group-addon">
							<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="NetID" data-content="Your NetID is the name that you use to sign in to Univeristy of Wisconsin web sites."></i>
						</div>
					</div>
				</div>
			</div>
			<% } else { %>
			<div class="form-group" id="username">
				<label class="required control-label">Username</label>
				<div class="controls">
					<div class="input-group">
						<input type="text" class="required form-control" name="username" value="<%= username %>">
						<div class="input-group-addon">
							<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Username" data-content="Your username is the name that you use to sign in to the web site."></i>
						</div>
					</div>
				</div>
			</div>
			<% } %>

			<% if (!config.sso) { %>
			<div class="form-group" id="password">
				<label class="required control-label">Password</label>
				<div class="controls">
					<div class="input-group">
						<input type="password" class="form-control" autocomplete="off" name="password" maxlength="200">
						<div class="input-group-addon">
							<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Password" data-content="Passwords must be at least 8 characters long including one uppercase letter, one lowercase letter and one number or symbol."></i>
						</div>
					</div>
					<div class="password-meter" style="display:none">
						<label class="password-meter-message"></label>
						<div class="password-meter-bg">
							<div class="password-meter-bar"></div>
						</div>
					</div>
				</div>
			</div>

			<div class="form-group" id="confirm-password">
				<label class="required control-label">Confirm password</label>
				<div class="controls">
					<div class="input-group">
						<input type="password" class="required form-control" autocomplete="off" name="confirm-password" maxlength="200">
						<div class="input-group-addon">
							<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Confirm password" data-content="Please retype your password exactly as you first entered it."></i>
						</div>
					</div>
				</div>
			</div>
			<% } %>
		</fieldset>

		<% if (!config.sso) { %>
		<fieldset>
			<legend>Verification</legend>

			<div class="form-group" id="email" >
				<label class="required control-label">Email address</label>
				<div class="controls">
					<div class="input-group">
						<input type="text" class="required email form-control" name="uw-email" value="<%= email %>">
						<div class="input-group-addon">
							<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Email address" data-content="A valid email address is required and will be used for your account registration and for password recovery."></i>
						</div>
					</div>
				</div>
			</div>

			<div class="form-group" id="confirm-email">
				<label class="required control-label">Confirm email address</label>
				<div class="controls">
					<div class="input-group">
						<input type="text" class="required confirm-email form-control" name="confirm-email" value="<%= email %>">
						<div class="input-group-addon">
							<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Confirm email address" data-content="Please retype your previously entered email address for verification."></i>
						</div>
					</div>
				</div>
			</div>
		</div>
		<% } %>

		<% if (!defaults.community) { %>
		<fieldset>
			<legend>Research</legend>
			<div class="form-group" id="communities">
				<label class="control-label">Communities</label>
				<div class="controls">
					<% for (i = 0; i < defaults.communities.length; i++) { %>
					<% let community = defaults.communities[i]; %>
					<% let communityName = community.replace(/-/g, ' ').toTitleCase(); %>
					<div class="checkbox">
						<label>
							<input type="checkbox" value="<%= community %>"<% if (!communities || communities.includes(community)) { %> checked="checked" <% } %> />
							<%= communityName %>
						</label>
					</div>
					<% } %>
				</div>
			</div>
		</fieldset>
		<% } %>

		<fieldset id="notifications">
			<legend>Notifications</legend>
			<div class="form-group">
				<label class="control-label"></label>
				<div class="controls">
					<ul class="nav nav-tabs" role="tablist">
						<% for (let i = 0; i < communities.length; i++) { %>
						<% let community = communities[i]; %>
						<% let communityName = community.replace(/-/g, ' ').toTitleCase(); %>
						<li role="presentation"<% if (i == 0) { %> class="active"<% } %>>
							<a role="tab" data-toggle="tab" href="<%= '#' + community %>-options">
								<label><%= communityName %></label>
							</a>
						</li>
						<% } %>
					</ul>
				</div>

				<div class="tab-content">
					<% for (let i = 0; i < communities.length; i++) { %>
					<% let community = communities[i]; %>
					<div role="tabpanel" id="<%= community %>-options" class="tab-pane<% if (i == 0) { %> active<% } %>">
						<% let options = window.community_defaults[community].options; %>
						<% let keys = Object.keys(options); %>
						<% for (let i = 0; i < keys.length; i++) { %>
						<% let key = keys[i]; %>
						<% let option = options[key]; %>
						<div class="form-group option" id="<%= key %>">
							<label class="control-label"><%= option.label %></label>
							<div class="controls">
								<div class="checkbox">
									<label>
										<input type="checkbox" />
										<%= option.description %>
									</label>
								</div>
							</div>
						</div>
						<% } %>

					</div>
					<% } %>
				</div>
			</div>
		</fieldset>
	`),

	regions: {
		user_profile: '#user-profile'
	},

	events: {
		'click #communities input[type="checkbox"]': 'onClickCommunities',
	},

	rules: {

		// account rules
		//
		'name': {
			required: true
		},
		'username': {
			required: true,
			username: true						
		},
		'password': {
			required: (config.sso == undefined),
			passwordStrongEnough: "Your password must be stronger."
		},
		'confirm-password': {
			required: (config.sso == undefined),
			equalTo: '#password input'
		},

		// verification rules
		//
		'uw-email': {
			required: true,
			uwEmail: "Your may only use your UW email address (username.wisc.edu)."
		},
		'confirm-email': {
			required: true,
			equalTo: "#email input"
		}
	},

	messages: {

		'name': {
			required: "Enter your name"
		},

		// account
		//
		'confirm-password': {
			required: "Re-enter your password.",
			equalTo: "Enter the same password as above."
		},

		// verification
		//
		'confirm-email': {
			required: "Re-enter your email address.",
			equalTo: "Retype the email address above."
		}
	},

	//
	// getting methods
	//

	getCommunities: function() {
		var selected = [];
		this.$el.find('#communities input[type="checkbox"]:checked').each(function() {
			selected.push($(this).val());
		});
		return selected;
	},

	getOptionKinds: function() {
		let kinds = [];
		let elements = this.$el.find('.option');
		for (let i = 0; i < elements.length; i++) {
			kinds.push($(elements[i]).attr('id'));
		}
		return kinds;
	},

	getOptions: function() {
		let kinds = this.getOptionKinds();
		let options = [];
		for (let i = 0; i < kinds.length; i++) {
			let kind = kinds[i];
			if (this.$el.find('#' + kind + ' input').is(':checked')) {
				options.push(kind);
			}
		}
		return options;
	},

	getValue: function(key) {
		switch (key) {

			// account
			//
			case 'username':
				return this.$el.find('#username input').val();
			case 'password':
				return this.$el.find('#password input').val();

			// verification
			//
			case 'email':
				return this.$el.find('#email input').val();

			// options
			//
			case 'communities':
				return defaults.community? [defaults.community] : this.getCommunities();
			case 'options':
				return this.getOptions();
		}
	},

	getValues: function() {
		let values = this.getChildView('user_profile').getValues();
		return _.extend(values || {}, {

			// account
			//
			username: this.getValue('username'),
			password: this.getValue('password'),

			// verification
			//
			email: this.getValue('email'),

			// research community
			//
			communities: this.getValue('communities'),

			// options
			//
			options: this.getOptions()
		});
	},

	//
	// rendering method
	//

	templateContext: function() {
		let communities = this.model.get('communities') || [];

		// if no user communities are defined then use defaultl
		//
		if (communities.length == 0 && defaults.community) {
			communities = [defaults.community];
		}

		// if not a community specific map, then all communities
		//
		if (communities.length == 0) {
			communities = defaults.communities;
		}

		return {
			sso: config.sso != undefined,
			communities: communities
		}
	},

	onRender: function() {
		FormView.prototype.onRender.call(this);

		// show child views
		//
		this.showChildView('user_profile', new EditableUserProfileFormView({
			model: this.model
		}));
	},

	updateNotificationPanels: function() {
		let checkboxes = this.$el.find('#communities input[type="checkbox"]');
		let tabs = this.$el.find('#notifications li');
		let panels = this.$el.find('#notifications .tab-pane');
		let communities = this.getCommunities();

		for (let i = 0; i < checkboxes.length; i++) {
			if ($(checkboxes[i]).is(':checked')) {
				$(tabs[i]).removeClass('hidden');
				$(panels[i]).removeClass('hidden');
			} else {
				$(tabs[i]).addClass('hidden');
				$(panels[i]).addClass('hidden');
			}
		}

		// if just one community, then make it active
		//
		if (communities.length == 1) {
			for (let i = 0; i < checkboxes.length; i++) {
				if ($(checkboxes[i]).is(':checked')) {
					$(tabs[i]).addClass('active');
					$(panels[i]).addClass('active');
				} else {
					$(tabs[i]).removeClass('active');
					$(panels[i]).removeClass('active');
				}
			}
		}

		// show / hide research interests
		//
		if (communities.length != 0) {
			this.$el.find('#notifications').show();
		} else {
			this.$el.find('#notifications').hide();
		}
	},

	update: function() {
		this.updateNotificationPanels();
	},

	//
	// mouse event handling methods
	//

	onClickCommunities: function() {
		this.update();
	},
});