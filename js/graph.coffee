# Use Iced CoffeeScript

root = exports ? this

class root.SongData
	mbid: null
	title: null
	artist: null
	album: null
	gs: {}

	loaded: false
	error: false
	
	constructor: (title, artist) ->
		this.title = title
		this.artist = artist
		this.album = null
		this.gs = 
			found: false
			url: null
			id: null
		
	checkLastFM: (callback) =>
		lastfm.track.getInfo
			track: this.title
			artist: this.artist
			autocorrect: 1
		,
			success: (data) =>
				console.log data
				this.mbid = data.track.mbid
				this.title = data.track.name
				this.artist = data.track.artist.name
				this.album = data.track.album.title
				callback?(this)
			error: (code, message) =>
				callback?(this)


	checkGrooveShark: (callback) =>
		gs.search this.title, this.artist, (data) =>
			this.loaded = true
			if data?
				this.gs.found = true
				this.gs.url = data.Url
				this.gs.id = data.SongID
				this.album = data.AlbumName
			else
				this.gs.found = false
				
			callback?(this)
		, (err) =>
			this.loaded = true
			this.error = true
			callback?(this)

	getSimilar: (callback) =>
		f = new TrackFinder
		f.find this.title, this.artist, (data) ->
			if 'error' of data
				console.log data
				return []

			items = []
			for track, i in data.track
				item = new SongData track.name, track.artist.name
				item.mbid = track.mbid
				await item.checkGrooveShark defer items[i]

			items = items.filter (s) -> s.gs.found
			callback?(items)

class root.SongNode
	@maxChildren: 4

	parent: null
	song: null
	expanded: false
	children: []

	constructor: (songdata, parent) ->
		this.song = songdata
		this.parent = parent ? null

	expand: (callback) =>
		if not this.expanded
			items = []
			await this.song.getSimilar defer items
			this.children = (new SongNode(item, this) for item in items)
		
			# filter out items that are the same as this node's parent so
			# we don't toggle between two similar songs indefinitely
			if this.parent?
				self = this
				this.children = this.children.filter (item) ->
					return item.song.mbid != self.parent.song.mbid

			# grab the first few results
			this.children = this.children.slice(0, SongNode.maxChildren)

		this.expanded = true
		callback?(this)
