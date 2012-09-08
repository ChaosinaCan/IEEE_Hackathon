root = exports ? this

class root.GrooveShark
	@endpoint = 'api/query-song.php'

	key = null
	window: null

	constructor: (apikey) ->
		key = apikey

	query: (query, callback, errback) ->
		url = encodeURI(GrooveShark.endpoint + "?query=#{query}")
		$.getJSON(url).then callback, errback

	search: (title, artist, callback, errback) =>
		this.query "#{artist} #{title}", callback, errback
		
	open: () ->
		this.window = window.open('http://grooveshark.com')
		this.window.blur()
		window.focus()

	changeSong: (url) ->
		if this.window?
			this.window.location.assign(url)
		else
			this.window = window.open(url)