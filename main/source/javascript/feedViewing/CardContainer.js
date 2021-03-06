enyo.kind({
	name: "NomNomNom.CardContainer",
	kind: enyo.VFlexBox,
	published: {
		items: [],
		index: 0
	},
	events: {
		onArticleView: "",
	},
	components: [
		{name: "carousel", kind: "VirtualCarousel", flex: 1, onSetupView: "setupView", viewControl: {kind: "NomNomNom.CardPage", onArticleView: "articleView"}, onSetupView: "setupView", onSnap: "snap", onSnapFinish: "snapFinish"}
	
	],
	create: function(){
		this.inherited(arguments);

		subscribe("article/view", _.bind(function(showing, index, page){
			var oldViewingArticle = this.viewingArticle
			this.viewingArticle = showing;

			if(this.viewingArticle && !oldViewingArticle){

				//console.error("Moving to single view", page * 3 + index + 1);
				//this.$.carousel.setIndex(page * 3 + index);	
				this.$.carousel.renderViews(page * 3 + index);
				this.$.carousel.setIndex(1);

				this.page = page * 3 + index;

			} else if(this.viewingArticle && oldViewingArticle){

				this.page = page;

			} else {
				//console.error("Going back to multiple cards per page view");
				//console.error("page", this.page, "newPage", Math.floor((this.page)/3));
				//var cardsPerPage = (this.orientation === "portrait") ? 2 : 3;


				this.$.carousel.renderViews(Math.floor((this.page)/3) );
				this.$.carousel.setIndex(1);
			}
		}, this));
	},
	rendered: function() {
	    this.inherited(arguments);
	},
	setupView: function(inSender, inView, inViewIndex) {
		var cardsPerPage = 3;//(this.orientation === "portrait") ? 2 : 3;
		if(!this.viewingArticle){
			if (inViewIndex < (this.items.length/cardsPerPage) && inViewIndex >= 0) {
		    	inView.setItems(this.items.slice(inViewIndex * cardsPerPage, inViewIndex * cardsPerPage + cardsPerPage));
		    	inView.setPage(inViewIndex);
		        return true;
		    }	
		} else {
			if (inViewIndex < this.items.length && inViewIndex >= 0) {
				inView.setItems(this.items.slice(inViewIndex, inViewIndex+1));
				inView.setPage(inViewIndex);
				return true;
			}
		}
	    
	},
	itemsChanged: function(){
		this.$.carousel.renderViews(0);
		this.$.carousel.setIndex(0);
		this.viewingArticle = false;

		this.markViewableCardsRead();
	},
	snapFinish: function(){

		_.defer(_.bind(this.markViewableCardsRead, this));

		if(this.viewingArticle){
			this.$.carousel.fetchCurrentView().viewArticle();
		}

	},
	articleView: function(inSender, article, cardKind, index, page, force){
		if(!this.viewingArticle || force){
			this.doArticleView(article, cardKind);	
			publish("article/view", [true, index, page]);			
		}

	},
	markViewableCardsRead: function(){
		if(AppPrefs.get("autoMarkAsRead") === false){
			return;
		}
		this.$.carousel.fetchCurrentView().markRead();

	},

	resizeHandler: function(){
		this.$.carousel.resized();
	},

});