# Use Iced CoffeeScript

root = exports ? this

class root.SongData
	mbid: null
	title: null
	artist: null
	album: null
	gs:
		found: false
		url: null
		id: null
	

	loaded: false
	error: false
	
	constructor: (title, artist) ->
		this.title = title
		this.artist = artist
		this.album = null
		
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
	parent: null
	song: null
	similar: []

	constructor: (songdata, parent) ->
		this.song = songdata
		this.parent = parent ? null

	expand: (callback) =>
		items = []
		await this.song.getSimilar defer items
		this.similar = (new SongNode(item, this) for item in items)
		
		# filter out items that are the same as this node's parent so
		# we don't toggle between two similar songs indefinitely
		if this.parent?
			console.log 'filtering'
			self = this
			this.similar = this.similar.filter (item) ->
				return item.song.mbid != self.parent.song.mbid

		callback?(this)
