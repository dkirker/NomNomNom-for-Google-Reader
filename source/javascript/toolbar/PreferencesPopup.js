enyo.kind({
	name: "PreferencesPopup",
	kind: enyo.Popup,
	scrim: true,
	modal: true,
	autoClose: true,
	dismissWithClick: true,
	width: "400px",
	events: {
	
	},
	components: [
		{layoutKind: "HFlexLayout", components: [
			{content: $L("Preferences")},
			{kind: "Spacer"},
			{kind: "ToolButton", icon: "source/images/menu-icon-close.png", style: "position: relative; bottom: 7px;", onclick: "close"}
		]},	
		{kind: enyo.RowGroup, caption: "Icons", components: [
			{kind: "Item", layoutKind: "HFlexLayout", components: [
				{content: $L("Hide Read"), kind: enyo.Control},
				{kind: enyo.Spacer},
				{kind: "CheckBox", preferenceProperty: "hideRead", rerender: true, onChange: "setPreference"}
			]},
		]},
		{kind: enyo.RowGroup, caption: "Account", components: [
			{kind: "Item", layoutKind: "HFlexLayout", components: [
				{kind: enyo.Button, flex: 1, className: "enyo-button-negative", caption: "Log out", onclick: "logout"}
			]},
		]},
		{name: "errorResponse", className: "errorText"}
		
	],
	close: function(){
		this.inherited(arguments);
	},
	showAtCenter: function(){
		if(this.lazy) {
			this.validateComponents();
		}
		
		this.openAtCenter();

		_.each(this.getComponents(), function(component){
			if(component.preferenceProperty){
				if(component.kind === "CheckBox"){
					component.setChecked(AppPrefs.get(component.preferenceProperty));
				} else {
					component.setValue(AppPrefs.get(component.preferenceProperty));
				}
			}
		});

	},

	setPreference: function(inSender, inValue){
		var value = (inSender.kind === "CheckBox") ? inSender.getChecked() : inValue;
		AppPrefs.set(inSender.preferenceProperty, value);

		if(inSender.rerender){
			AppUtils.refreshIcons();
		}
	},

	logout: function(){
		AppUtils.logout();
		this.close();
	}

});