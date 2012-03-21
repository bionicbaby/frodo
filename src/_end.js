
	
	// scope jquery to the closure
	var $ = window.jQuery.noConflict(true);	
	var scope = {
		/* Classes */
		core: {
			BaseClass: BaseClass,
		},
		
		/* Cache */
		cache: {
			Cache: Cache,
			CookieCache: CookieCache,
			PersistentCache: PersistentCache,
			LocalStorageCache: LocalStorageCache,
			SessionStorageCache: SessionStorageCache,
			TemporaryCache: TemporaryCache
		},
		
		/* Data */
		data: {
			ArrayCollection: ArrayCollection,
			HashTable: HashTable,
			Model: Model,
			PersistentArrayCollection: PersistentArrayCollection,
			VO: VO,
			SerializableVO: SerializableVO
		},
		
		/* View */
		view: {
			DisplayObject: DisplayObject,
			Component: Component,
			ListContainer: ListContainer,
			ItemRenderer: ItemRenderer,
			jQuery: $,
			ConfigVO: ConfigVO
		},
		
		/* Util */
		util: {
			Browser: Browser,
			Log: Log,
			ConsoleLogger: ConsoleLogger
		},

		/* Event */		
		event: {
			Event: Event,
			EventDispatcher: EventDispatcher,
			Command: Command,
			
			ClickHandler: ClickHandler
		},
		
		service: Service,
		
		factory: {
			Factory: Factory,
			SingletonFactory: SingletonFactory,
			ServiceFactory: ServiceFactory
		}
		
	};
	var framework = new Framework(scope);

})( window );

